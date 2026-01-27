const fs = require('fs');

console.log('Starting config generation...');

// Check if key exists
if (!process.env.AIRTABLE_API_KEY) {
    console.error('❌ ERROR: AIRTABLE_API_KEY environment variable is missing!');

    // Help debug by listing available keys (names only, no values)
    const availableKeys = Object.keys(process.env).filter(k => !k.startsWith('npm_') && !k.startsWith('NETLIFY_'));
    console.log('ℹ️  Available Environment Variables (names only):', availableKeys.join(', '));

    // Fail the build so the user sees the error immediately
    process.exit(1);
}

const apiKey = process.env.AIRTABLE_API_KEY;
console.log(`✅ AIRTABLE_API_KEY found (length: ${apiKey.length})`);

const content = `const AIRTABLE_API_KEY = "${apiKey}";`;

fs.writeFileSync('config.js', content);
console.log('✅ config.js generated successfully');
