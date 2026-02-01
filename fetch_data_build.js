const fs = require('fs');
const https = require('https');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = "appOPXerkRuO4YH1D";
const AIRTABLE_TABLE_NAME = "EVENT";

console.log('Starting build-time data fetch...');

if (!AIRTABLE_API_KEY) {
    console.error('❌ ERROR: AIRTABLE_API_KEY is missing. Cannot fetch data.');
    process.exit(1);
}

const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

let allRecords = [];

function fetchData(offset = null) {
    let fetchUrl = `${url}?fields%5B%5D=מאיפה%20יוצאת%20המסירה&fields%5B%5D=לאן%20נמסרת`;
    if (offset) fetchUrl += `&offset=${offset}`;

    const options = {
        headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
    };

    https.get(fetchUrl, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    const jsonData = JSON.parse(data);
                    allRecords = [...allRecords, ...jsonData.records];

                    if (jsonData.offset) {
                        console.log(`Fetched page. Total so far: ${allRecords.length}. Fetching next page...`);
                        fetchData(jsonData.offset);
                    } else {
                        console.log(`✅ Finished fetching. Total records: ${allRecords.length}`);
                        fs.writeFileSync('data.json', JSON.stringify(allRecords));
                        console.log('✅ data.json saved successfully.');
                    }
                } catch (e) {
                    console.error('❌ Error parsing JSON:', e);
                    process.exit(1);
                }
            } else {
                console.error(`❌ Request failed with status code: ${res.statusCode}`);
                console.error('Response:', data);
                process.exit(1);
            }
        });

    }).on('error', (err) => {
        console.error('❌ Error fetching data:', err.message);
        process.exit(1);
    });
}

fetchData();
