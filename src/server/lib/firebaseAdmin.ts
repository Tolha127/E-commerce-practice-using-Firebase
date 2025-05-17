// src/server/lib/firebaseAdmin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
    if (!serviceAccountBase64) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 is not set in environment variables. Please ensure it is correctly configured in your .env.local file.');
    }
    const serviceAccountJsonString = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJsonString);

    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
    if (!storageBucket) {
        throw new Error('FIREBASE_STORAGE_BUCKET is not set in environment variables. Please ensure it is correctly configured in your .env.local file.');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Depending on your error handling strategy, you might want to:
    // 1. Re-throw the error to halt server startup if Firebase is critical:
    //    throw new Error(`Firebase Admin SDK failed to initialize: ${error.message}`);
    // 2. Or, allow the app to start but log that Firebase features will be unavailable.
    //    This is generally not recommended for production if Firebase is integral.
    console.error("CRITICAL: Firebase Admin SDK could not be initialized. Firebase-dependent features will fail.");
  }
}

export const db = admin.firestore();
export const storageAdmin = admin.storage(); // Renamed to avoid conflict with window.storage
export const authAdmin = admin.auth();
export default admin;
