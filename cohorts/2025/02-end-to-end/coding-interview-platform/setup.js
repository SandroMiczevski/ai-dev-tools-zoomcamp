#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Coding Interview Platform...\n');

// Setup backend
console.log('📦 Installing backend dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
  console.log('✅ Backend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Setup frontend
console.log('📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Create .env files
const backendEnvExample = path.join(__dirname, 'backend', '.env.example');
const backendEnv = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnv) && fs.existsSync(backendEnvExample)) {
  fs.copyFileSync(backendEnvExample, backendEnv);
  console.log('✅ Backend .env file created');
}

const frontendEnvExample = path.join(__dirname, 'frontend', '.env.example');
const frontendEnvLocal = path.join(__dirname, 'frontend', '.env.local');
if (!fs.existsSync(frontendEnvLocal) && fs.existsSync(frontendEnvExample)) {
  fs.copyFileSync(frontendEnvExample, frontendEnvLocal);
  console.log('✅ Frontend .env.local file created\n');
}

console.log('✨ Setup complete!\n');
console.log('🎯 Next steps:');
console.log('   1. Start the backend:  cd backend && npm run dev');
console.log('   2. Start the frontend: cd frontend && npm run dev');
console.log('   3. Open http://localhost:3000 in your browser\n');
console.log('📚 For more information, see README.md\n');
