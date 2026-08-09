const fs = require('fs');
const airportsContent = fs.readFileSync('src/data/airports.js', 'utf8');
const searchContent = fs.readFileSync('src/components/FlightSearch.jsx', 'utf8');

// Extract all countries from airports.js
const regex = /label: '.*? - (.*?)'/g;
let match;
const airportCountries = new Set();
while ((match = regex.exec(airportsContent)) !== null) {
  airportCountries.add(match[1]);
}

// Extract all countries mapped in continentMap
const mapRegex = /'([^']+)': '[^']+'/g;
let mapMatch;
const mappedCountries = new Set();
while ((mapMatch = mapRegex.exec(searchContent)) !== null) {
  mappedCountries.add(mapMatch[1]);
}

// Find unmapped countries
const unmapped = [];
for (const country of airportCountries) {
  if (!mappedCountries.has(country)) {
    unmapped.push(country);
  }
}

console.log('Unmapped countries:', unmapped);
