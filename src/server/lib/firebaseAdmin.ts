// src/server/lib/firebaseAdmin.ts
import admin from 'firebase-admin';

// Initialize Firebase App
let firebaseInitialized = false;

if (!admin.apps.length) {
  try {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
    if (!serviceAccountBase64) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 is not set in environment variables.\n' +
        'Please create a .env.local file with your Firebase configuration based on the .env.local.example file.\n' +
        'Instructions for setting up Firebase environment variables:\n' +
        '1. Go to Firebase Console > Project Settings > Service accounts\n' +
        '2. Click "Generate new private key" and download the JSON file\n' +
        '3. Base64 encode the entire JSON content\n' +
        '4. Set the encoded string as FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 in your .env.local file'
      );
    }
    const serviceAccountJsonString = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJsonString);

    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
    if (!storageBucket) {
        throw new Error(
          'FIREBASE_STORAGE_BUCKET is not set in environment variables.\n' +
          'Please set it in your .env.local file. You can find your storage bucket name in the Firebase Console under Storage > Files.'
        );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
    
    firebaseInitialized = true;
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    
    // For development environments, we can provide more helpful messages
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '\n===========================================================================\n' +
        'FIREBASE INITIALIZATION FAILED\n' +
        'Make sure you have:\n' +
        '1. Created a .env.local file based on .env.local.example\n' +
        '2. Added the correct Firebase service account credentials (base64 encoded)\n' +
        '3. Set all required Firebase environment variables\n' +
        '===========================================================================\n'
      );
    }
    
    // Re-throw the error to halt server startup as Firebase is critical for this app
    throw new Error(`Firebase Admin SDK failed to initialize: ${error.message}`);
  }
}

// Only export Firebase services if initialization was successful
// This prevents "The default Firebase app does not exist" errors
let db: admin.firestore.Firestore | undefined;
let storageAdmin: admin.storage.Storage | undefined;
let authAdmin: admin.auth.Auth | undefined;

if (firebaseInitialized) {
  db = admin.firestore();
  storageAdmin = admin.storage();
  authAdmin = admin.auth();
}

export { db, storageAdmin, authAdmin };
export default admin;
