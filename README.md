# E-commerce Practice Project using Firebase

This is a Next.js e-commerce application with Firebase integration for authentication, data storage, and file storage.

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase configuration details (see below for instructions)
4. Run the development server:
   ```
   npm run dev
   ```

## Firebase Setup

This project requires Firebase configuration for the following services:
- Firebase Authentication
- Firestore Database
- Firebase Storage

### Setting up environment variables

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely
3. Base64 encode the JSON file:
   - On Windows PowerShell:
     ```
     [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content -Path "path\to\serviceAccountKey.json" -Raw)))
     ```
   - On macOS/Linux:
     ```
     cat path/to/serviceAccountKey.json | base64
     ```
4. Copy the base64 encoded string to your `.env.local` file
5. Set the `FIREBASE_STORAGE_BUCKET` and other required variables in `.env.local`

## Features

- Product management with admin dashboard
- Image upload using Firebase Storage
- User authentication
- Responsive design
