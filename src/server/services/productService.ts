
// src/server/services/productService.ts
import type { Product } from '@/lib/types';
import { db, storageAdmin } from '@/server/lib/firebaseAdmin'; // Import initialized Firebase admin
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// --- Image Upload ---
async function uploadImage(file: File, productId: string): Promise<string> {
  const bucket = storageAdmin.bucket();
  // Create a unique filename to prevent overwrites and organize by product
  const fileName = `products/${productId}/${uuidv4()}-${file.name.replace(/\s+/g, '_')}`;
  const blob = bucket.file(fileName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.type,
      },
      resumable: false, // Using non-resumable upload for simplicity
    });
    blobStream.on('error', (err) => {
      console.error("Error uploading image to Firebase Storage:", err);
      reject(err);
    });
    blobStream.on('finish', () => {
      resolve(true);
    });
    blobStream.end(buffer);
  });

  // Make the file public to get a public URL
  // Note: Ensure your Storage bucket rules allow public reads for these files
  await blob.makePublic();
  return blob.publicUrl();
}

async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const bucketName = storageAdmin.bucket().name;
    // Expected URL format: https://storage.googleapis.com/YOUR_BUCKET_NAME/path/to/file
    const prefix = `https://storage.googleapis.com/${bucketName}/`;
    if (imageUrl.startsWith(prefix)) {
      const filePath = imageUrl.substring(prefix.length);
      const file = storageAdmin.bucket().file(decodeURIComponent(filePath)); // Decode URI component for file names with special chars
      await file.delete();
      console.log(`Successfully deleted ${filePath} from storage.`);
    } else {
      console.warn(`Could not parse Firebase Storage file path from URL: ${imageUrl}. Manual deletion might be required.`);
    }
  } catch (error: any) {
    // Log error but don't let it necessarily block product deletion if image is already gone or URL is malformed
    if (error.code === 404) {
        console.warn(`Image not found for deletion (already deleted or wrong URL): ${imageUrl}`);
    } else {
        console.error(`Failed to delete image ${imageUrl}:`, error);
    }
  }
}

// --- Product Data (CRUD operations using Firestore) ---
const PRODUCTS_COLLECTION = 'products';

export async function createProductInDB(
  productData: Omit<Product, 'id'> // Images should be URLs already
): Promise<Product> {
  const newId = uuidv4(); // Generate a unique ID for the product
  const productWithId: Product = { ...productData, id: newId };
  
  await db.collection(PRODUCTS_COLLECTION).doc(newId).set(productWithId);
  console.log("Service: Created product in Firestore with ID:", newId);
  return productWithId;
}

export async function getProductFromDB(productId: string): Promise<Product | null> {
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
  console.log("Service: Fetching all products from Firestore");
  const snapshot = await db.collection(PRODUCTS_COLLECTION).get();
  const products: Product[] = [];
  snapshot.forEach(doc => products.push(doc.data() as Product));
  return products;
}

export async function updateProductInDB(
  productId: string,
  productUpdateData: Partial<Omit<Product, 'id'>> // Images are URLs
): Promise<Product | null> {
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
  console.log("Service: Deleting product from Firestore", productId);
  const product = await getProductFromDB(productId); // Fetch product to get image URLs for deletion

  if (product && product.images && product.images.length > 0) {
    console.log(`Service: Deleting ${product.images.length} associated images for product ${productId}.`);
    for (const imageUrl of product.images) {
      await deleteImage(imageUrl);
    }
  } else if (!product) {
     console.warn(`Service: Product ${productId} not found for deletion, or it has no images.`);
     // Decide if this should return true or false. If product not found, it's effectively "deleted".
     // Returning true here as the state desired (product gone) is achieved.
     return true;
  }

  await db.collection(PRODUCTS_COLLECTION).doc(productId).delete();
  console.log(`Service: Product ${productId} deleted from Firestore.`);
  return true; 
}

// --- Combined Operations ---

export async function saveProduct(
  data: Omit<Product, 'id' | 'images'>, // Raw form data excluding id and pre-upload images
  imageFiles: File[], // Files to be uploaded
  existingProductId?: string
): Promise<Product | null> {
  
  const resolvedProductId = existingProductId || uuidv4(); // Use existing ID or generate one for organizing images
  let uploadedImageUrls: string[] = [];

  if (imageFiles && imageFiles.length > 0) {
    console.log(`Service: Uploading ${imageFiles.length} new images for product ID ${resolvedProductId}.`);
    for (const file of imageFiles) {
      const url = await uploadImage(file, resolvedProductId);
      uploadedImageUrls.push(url);
    }
  }

  if (existingProductId) {
    // Updating existing product
    const existingProduct = await getProductFromDB(existingProductId);
    if (!existingProduct) {
      console.error(`Service Error: Product ${existingProductId} not found for update.`);
      return null;
    }

    let finalImageUrls = existingProduct.images || [];

    if (uploadedImageUrls.length > 0) {
      // New images were uploaded, replace old ones
      console.log(`Service: Replacing images for product ${existingProductId}. Deleting ${existingProduct.images.length} old images.`);
      for (const oldImageUrl of existingProduct.images) {
        await deleteImage(oldImageUrl);
      }
      finalImageUrls = uploadedImageUrls;
    }
    // If no new images uploaded (uploadedImageUrls is empty), finalImageUrls remains existingProduct.images

    const productUpdatePayload = { ...data, images: finalImageUrls };
    return updateProductInDB(existingProductId, productUpdatePayload);

  } else {
    // Creating new product
    const productPayload = { ...data, images: uploadedImageUrls };
    // createProductInDB will assign its own ID, the resolvedProductId was mainly for image path organization
    return createProductInDB(productPayload);
  }
}
