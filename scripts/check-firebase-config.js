#!/usr/bin/env node

/**
 * Firebase Environment Variables Check Script
 * 
 * This script checks if all required Firebase environment variables are set correctly.
 * It can be run with `npm run check-firebase-config`
 */

// Check if .env.local file exists
const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');

console.log('\n=== Firebase Environment Variables Check ===\n');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.error('   Please create a .env.local file based on .env.local.example');
  process.exit(1);
} else {
  console.log('✅ .env.local file found');
}

// Required environment variables
const requiredVars = [
  'FIREBASE_SERVICE_ACCOUNT_JSON_BASE64',
  'FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

// Load environment variables
require('dotenv').config({ path: envPath });

// Check if each required variable is set
let missingVars = 0;
let emptyVars = 0;

requiredVars.forEach(varName => {
  if (!(varName in process.env)) {
    console.error(`❌ ${varName} is not set in .env.local`);
    missingVars++;
  } else if (!process.env[varName] || process.env[varName].trim() === '') {
    console.error(`❌ ${varName} is set but empty`);
    emptyVars++;
  } else if (
    varName === 'FIREBASE_SERVICE_ACCOUNT_JSON_BASE64' && 
    (
      process.env[varName] === 'your_base64_encoded_service_account_json_here' ||
      process.env[varName].length < 50
    )
  ) {
    console.error(`❌ ${varName} appears to be a placeholder value`);
    emptyVars++;
  } else if (
    varName.startsWith('NEXT_PUBLIC_FIREBASE_') && 
    (process.env[varName].includes('your_') || process.env[varName].includes('your-'))
  ) {
    console.error(`❌ ${varName} appears to be a placeholder value`);
    emptyVars++;
  } else {
    let value = process.env[varName];
    // Truncate for display
    if (varName === 'FIREBASE_SERVICE_ACCOUNT_JSON_BASE64' && value.length > 20) {
      value = value.substring(0, 20) + '...';
    }
    console.log(`✅ ${varName} is set properly`);
  }
});

if (missingVars === 0 && emptyVars === 0) {
  console.log('\n✅ All Firebase environment variables are set up correctly!\n');
  process.exit(0);
} else {
  console.error(`\n❌ Problems found: ${missingVars} missing variables, ${emptyVars} empty/placeholder variables\n`);
  console.error('Please update your .env.local file with proper values from your Firebase console.');
  console.error('For guidance, refer to the README.md or .env.local.example file.\n');
  process.exit(1);
}
