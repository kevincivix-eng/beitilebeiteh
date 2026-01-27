const fs = require('fs');

const apiKey = process.env.AIRTABLE_API_KEY || '';
const content = `const AIRTABLE_API_KEY = "${apiKey}";`;

fs.writeFileSync('config.js', content);
console.log('config.js generated successfully');
