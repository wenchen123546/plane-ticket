const https = require('https');
const fs = require('fs');

const url = 'https://raw.githubusercontent.com/mwgg/Airports/master/airports.json';
console.log('Fetching comprehensive airport data from mwgg/Airports...');

https.get(url, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      
      // mwgg/Airports data format: { "ICAO": { "icao": "...", "iata": "...", "name": "...", "city": "...", "country": "..." } }
      const formatted = Object.values(data)
        // Only keep airports that have a valid IATA code (usually means it's a commercial passenger airport)
        .filter(a => a.iata && typeof a.iata === 'string' && a.iata.trim() !== '' && a.iata !== '0')
        .map(a => {
          const cityDisplay = a.city ? `${a.city} ` : '';
          const countryDisplay = a.country ? ` - ${a.country}` : '';
          return {
            value: a.iata.toUpperCase(),
            label: `${cityDisplay}${a.name} (${a.iata.toUpperCase()})${countryDisplay}`
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
      
      fs.mkdirSync('src/data', { recursive: true });
      
      const jsContent = `// Automatically generated huge list of airports\nexport const airports = ${JSON.stringify(formatted, null, 2)};\n`;
      
      fs.writeFileSync('src/data/airports.js', jsContent);
      console.log(`Successfully saved ${formatted.length} airports with IATA codes to src/data/airports.js.`);
    } catch (e) {
      console.error('Failed to parse or save airport data', e);
    }
  });
}).on('error', (e) => {
  console.error('Failed to fetch airport data', e);
});
