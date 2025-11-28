#!/usr/bin/env node

/**
 * Admin User Creation Script for Maria Skidmore Portfolio
 *
 * This script creates an admin user in Firebase Authentication.
 * Run with: node scripts/createAdmin.js
 *
 * Prerequisites:
 * 1. Firebase Admin SDK installed: npm install firebase-admin --save-dev
 * 2. Service account key downloaded from Firebase Console
 * 3. Place service account key in project root (add to .gitignore!)
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createAdmin() {
  console.log('\n🎵 Maria Skidmore Portfolio - Admin Setup\n');
  console.log('This script will create an admin user in Firebase Authentication.\n');

  try {
    // Try to import firebase-admin
    let admin;
    try {
      admin = require('firebase-admin');
    } catch (error) {
      console.error('❌ firebase-admin is not installed.');
      console.log('\n📦 Please install it first:');
      console.log('   npm install firebase-admin --save-dev\n');
      process.exit(1);
    }

    // Check if already initialized
    if (!admin.apps.length) {
      console.log('📋 Firebase Admin SDK Setup:\n');
      console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
      console.log('2. Click "Generate New Private Key"');
      console.log('3. Save the JSON file as "serviceAccountKey.json" in the project root');
      console.log('4. Add "serviceAccountKey.json" to .gitignore\n');

      const serviceAccountPath = await question('Enter path to service account key (default: ./serviceAccountKey.json): ');
      const finalPath = serviceAccountPath.trim() || './serviceAccountKey.json';

      try {
        const serviceAccount = require(finalPath.startsWith('.') ? finalPath : `./${finalPath}`);

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });

        console.log('✅ Firebase Admin SDK initialized\n');
      } catch (error) {
        console.error(`❌ Could not load service account key from: ${finalPath}`);
        console.error('Error:', error.message);
        process.exit(1);
      }
    }

    // Get admin email and password
    const email = await question('Enter admin email: ');

    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      process.exit(1);
    }

    const password = await question('Enter admin password (min 6 characters): ');

    if (!password || password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    const confirm = await question(`\nCreate admin user with email: ${email}? (yes/no): `);

    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Cancelled');
      process.exit(0);
    }

    // Create user
    console.log('\n🔄 Creating admin user...');

    try {
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        emailVerified: true
      });

      console.log('✅ Admin user created successfully!');
      console.log('\nUser Details:');
      console.log(`   UID: ${userRecord.uid}`);
      console.log(`   Email: ${userRecord.email}`);
      console.log(`   Email Verified: ${userRecord.emailVerified}`);
      console.log('\n🎉 You can now log in at: /admin/login\n');

    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.error('❌ User with this email already exists');
      } else {
        console.error('❌ Error creating user:', error.message);
      }
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
createAdmin();
