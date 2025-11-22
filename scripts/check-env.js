#!/usr/bin/env node

/**
 * Environment Check Script
 * Validates that all required environment variables and dependencies are configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Agentic Marketer Configuration...\n');

let hasErrors = false;
const warnings = [];

// Check if .env exists
console.log('📄 Checking .env file...');
if (!fs.existsSync('.env')) {
  console.log('  ❌ .env file not found');
  console.log('  👉 Run: cp .env.example .env');
  hasErrors = true;
} else {
  console.log('  ✅ .env file exists');
  
  // Load .env
  require('dotenv').config();
  
  // Check MongoDB
  console.log('\n🗄️  Checking MongoDB configuration...');
  if (!process.env.MONGODB_URI) {
    console.log('  ❌ MONGODB_URI not set');
    hasErrors = true;
  } else {
    console.log('  ✅ MONGODB_URI configured');
  }
  
  // Check LLM Provider
  console.log('\n🤖 Checking LLM configuration...');
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  
  if (!hasOpenAI && !hasAnthropic) {
    console.log('  ❌ No LLM API key found');
    console.log('  👉 Set either OPENAI_API_KEY or ANTHROPIC_API_KEY');
    hasErrors = true;
  } else {
    if (hasOpenAI) console.log('  ✅ OpenAI API key configured');
    if (hasAnthropic) console.log('  ✅ Anthropic API key configured');
  }
  
  // Check LLM Provider setting
  const provider = process.env.LLM_PROVIDER;
  if (!provider) {
    console.log('  ⚠️  LLM_PROVIDER not set (defaulting to openai)');
    warnings.push('Set LLM_PROVIDER to "openai" or "anthropic" in .env');
  } else {
    console.log(`  ✅ LLM_PROVIDER set to: ${provider}`);
  }
  
  // Check Stability AI
  console.log('\n🎨 Checking image generation configuration...');
  if (!process.env.STABILITY_API_KEY) {
    console.log('  ⚠️  STABILITY_API_KEY not set');
    console.log('  👉 Images will use placeholders');
    warnings.push('Set STABILITY_API_KEY for AI-generated images');
  } else {
    console.log('  ✅ Stability AI API key configured');
  }
}

// Check Node.js version
console.log('\n⚙️  Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.log(`  ❌ Node.js ${nodeVersion} detected (requires 18+)`);
  hasErrors = true;
} else {
  console.log(`  ✅ Node.js ${nodeVersion}`);
}

// Check if node_modules exists
console.log('\n📦 Checking dependencies...');
if (!fs.existsSync('node_modules')) {
  console.log('  ❌ node_modules not found');
  console.log('  👉 Run: npm install');
  hasErrors = true;
} else {
  console.log('  ✅ Dependencies installed');
}

// Check required directories
console.log('\n📁 Checking directories...');
const dirs = ['public', 'public/placeholders', 'lib', 'components', 'app'];
dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`  ✅ ${dir}/`);
  } else {
    console.log(`  ❌ ${dir}/ not found`);
    hasErrors = true;
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Configuration has errors. Please fix them before running.');
} else if (warnings.length > 0) {
  console.log('⚠️  Configuration complete with warnings:');
  warnings.forEach(warning => {
    console.log(`   - ${warning}`);
  });
  console.log('\n✅ You can still run the app, but some features may be limited.');
} else {
  console.log('✅ All checks passed! Ready to run.');
  console.log('\n🚀 Next steps:');
  console.log('   1. Start MongoDB: mongod');
  console.log('   2. Run dev server: npm run dev');
  console.log('   3. Open browser: http://localhost:3000');
}
console.log('='.repeat(50) + '\n');

process.exit(hasErrors ? 1 : 0);
