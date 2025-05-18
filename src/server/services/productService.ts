
// src/server/services/productService.ts
import type { Product, ProductImage } from '@/lib/types';
import { db, storageAdmin } from '@/server/lib/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

// --- Image Upload ---
async function uploadImage(file: File, productId: string): Promise<ProductImage> {
  if (!storageAdmin) {
    throw new Error('Firebase Storage is not initialized');
  }

  const bucket = storageAdmin.bucket();
  const originalFileName = file.name.replace(/\s+/g, '_'); // Sanitize original name
  const uniqueFileName = `${uuidv4()}-${originalFileName}`;
  const filePath = `products/${productId}/${uniqueFileName}`; // This is the GCS path
  
  const blob = bucket.file(filePath);

  // Import Buffer from Node.js
  const buffer = Buffer.from(await file.arrayBuffer());

  await new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.type,
      },
      resumable: false,
    });    blobStream.on('error', (err: Error) => {
      console.error("Error uploading image to Firebase Storage:", err);
      reject(err);
    });
    blobStream.on('finish', () => {
      resolve(true);
    });
    blobStream.end(buffer);
  });

  await blob.makePublic();
  const publicUrl = blob.publicUrl();
  
  return { url: publicUrl, path: filePath, name: originalFileName };
}

async function deleteImage(filePath: string): Promise<void> {
  if (!storageAdmin) {
    throw new Error('Firebase Storage is not initialized');
  }
  
  try {
    const file = storageAdmin.bucket().file(filePath);
    await file.delete();
    console.log(`Successfully deleted ${filePath} from storage.`);
  } catch (error: any) {
    if (error.code === 404) {
        console.warn(`Image not found for deletion (already deleted or wrong path): ${filePath}`);
    } else {
        console.error(`Failed to delete image ${filePath}:`, error);
    }
    // Decide if you want to re-throw or just log. For now, logging.
  }
}

// --- Product Data (CRUD operations using Firestore) ---
const PRODUCTS_COLLECTION = 'products';

export async function createProductInDB(
  productData: Omit<Product, 'id'> 
): Promise<Product> {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }

  const newId = uuidv4();
  const productWithId: Product = { ...productData, id: newId };
  
  await db.collection(PRODUCTS_COLLECTION).doc(newId).set(productWithId);
  console.log("Service: Created product in Firestore with ID:", newId);
  return productWithId;
}

export async function getProductFromDB(productId: string): Promise<Product | null> {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  
  console.log("Service: Fetching product from Firestore", productId);
  const docRef = db.collection(PRODUCTS_COLLECTION).doc(productId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return docSnap.data() as Product;
  } else {
    console.log(`Service: Product with ID ${productId} not found in Firestore.`);
    return null;
  }
}

export async function getAllProductsFromDB(): Promise<Product[]> {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  
  console.log("Service: Fetching all products from Firestore");
  const snapshot = await db.collection(PRODUCTS_COLLECTION).orderBy('name').get(); // Added orderBy for consistency
  const products: Product[] = [];
  snapshot.forEach((doc: any) => products.push(doc.data() as Product));
  return products;
}

export async function updateProductInDB(
  productId: string,
  productUpdateData: Partial<Omit<Product, 'id'>>
): Promise<Product | null> {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  
  console.log("Service: Updating product in Firestore", productId);
  const docRef = db.collection(PRODUCTS_COLLECTION).doc(productId);
  
  const currentDoc = await docRef.get();
  if (!currentDoc.exists) {
    console.error(`Product with ID ${productId} not found for update.`);
    return null;
  }

  await docRef.update(productUpdateData);
  const updatedDocSnap = await docRef.get();
  return updatedDocSnap.data() as Product;
}

export async function deleteProductFromDB(productId: string): Promise<boolean> {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  
  console.log("Service: Deleting product from Firestore", productId);
  const product = await getProductFromDB(productId); 

  if (product && product.images && product.images.length > 0) {
    console.log(`Service: Deleting ${product.images.length} associated images for product ${productId}.`);
    for (const image of product.images) {
      await deleteImage(image.path); // Use the stored GCS path for deletion
    }
  } else if (!product) {
     console.warn(`Service: Product ${productId} not found for deletion, or it has no images.`);
     return true;
  }

  await db.collection(PRODUCTS_COLLECTION).doc(productId).delete();
  console.log(`Service: Product ${productId} deleted from Firestore.`);
  return true; 
}

// --- Combined Operations ---

export async function saveProduct(
  data: Omit<Product, 'id' | 'images'>,
  imageFiles: File[],
  existingProductId?: string
): Promise<Product | null> {
  
  const resolvedProductId = existingProductId || uuidv4();
  let newUploadedImages: ProductImage[] = [];

  if (imageFiles && imageFiles.length > 0) {
    console.log(`Service: Uploading ${imageFiles.length} new images for product ID ${resolvedProductId}.`);
    for (const file of imageFiles) {
      const uploadedImage = await uploadImage(file, resolvedProductId);
      newUploadedImages.push(uploadedImage);
    }
  }

  if (existingProductId) {
    const existingProduct = await getProductFromDB(existingProductId);
    if (!existingProduct) {
      console.error(`Service Error: Product ${existingProductId} not found for update.`);
      return null;
    }

    let finalImages = existingProduct.images || [];

    if (newUploadedImages.length > 0) {
      // New images were uploaded, replace old ones
      console.log(`Service: Replacing images for product ${existingProductId}. Deleting ${finalImages.length} old images.`);
      for (const oldImage of finalImages) {
        await deleteImage(oldImage.path); // Delete old images using their GCS path
      }
      finalImages = newUploadedImages; // Use only the newly uploaded images
    }
    // If no new images uploaded (newUploadedImages is empty), finalImages remains existingProduct.images

    const productUpdatePayload = { ...data, images: finalImages };
    return updateProductInDB(existingProductId, productUpdatePayload);

  } else {
    // Creating new product
    if (newUploadedImages.length === 0) {
        // This case should be caught by action validation, but as a safeguard
        console.error("Service Error: Attempted to create a new product without images.");
        throw new Error("At least one image is required to create a new product.");
    }
    const productPayload = { ...data, images: newUploadedImages };
    return createProductInDB(productPayload);
  }
}
