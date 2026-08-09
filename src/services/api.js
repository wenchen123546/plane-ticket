import axios from 'axios';
import { generateFlights } from './mockData';

// ==========================================
// API Configuration
// ==========================================
// Render 部署時，前後端同源，因此生產環境使用相對路徑 '/api'
// 本機開發時，則指向 5000 Port
export const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

// Transform SerpApi Google Flights response to our frontend format
const transformFlight = (flightData, isReturn = false, originCode, destCode, dateStr) => {
  // Sometimes a trip has multiple legs (flights array)
  // We'll just grab the first flight for basic info, or map them all if needed
  if (!flightData?.flights?.length) return null;
  const firstLeg = flightData.flights[0];
  const lastLeg = flightData.flights[flightData.flights.length - 1];
  
  const depTime = new Date(firstLeg.departure_airport.time);
  const arrTime = new Date(lastLeg.arrival_airport.time);
  
  const stops = flightData.flights.length - 1;
  const durationHours = Math.floor(flightData.total_duration / 60) || 0;
  const durationMins = (flightData.total_duration % 60) || 0;
  // Calculate Layover Duration
  let isLongLayover = false;
  if (stops > 0 && flightData.layovers && flightData.layovers.length > 0) {
    // Check if any layover is > 240 mins (4 hours)
    isLongLayover = flightData.layovers.some(layover => layover.duration >= 240);
  }

  // Extract Extensions (e.g. cabin, baggage)
  let cabin = '經濟艙 (Economy)';
  let includesBaggage = false;
  if (flightData.extensions) {
    const extStr = flightData.extensions.join(' ').toLowerCase();
    if (extStr.includes('business') || extStr.includes('商務')) cabin = '商務艙 (Business)';
    if (extStr.includes('first') || extStr.includes('頭等')) cabin = '頭等艙 (First)';
    if (extStr.includes('premium')) cabin = '豪經艙 (Premium Economy)';
    
    // Some LCC extensions say "No overhead bin access" or "Personal item only"
    if (!extStr.includes('no overhead bin') && !extStr.includes('personal item only')) {
      includesBaggage = true;
    }
  }

  // Construct Deep Link to Google Flights
  // Format: https://www.google.com/travel/flights?q=Flights%20to%20{dest}%20from%20{origin}%20on%20{date}
  const bookingLink = `https://www.google.com/travel/flights?q=Flights%20to%20${destCode}%20from%20${originCode}%20on%20${dateStr}`;

  return {
    id: `${isReturn ? 'ret' : 'out'}-${Math.random().toString(36).substring(2, 9)}`,
    airline: firstLeg.airline || 'Unknown Airline',
    flightNum: firstLeg.flight_number || 'N/A',
    aircraft: firstLeg.airplane || 'Boeing 777-300ER', // fallback
    departure: {
      time: depTime,
      airport: firstLeg.departure_airport.id
    },
    arrival: {
      time: arrTime,
      airport: lastLeg.arrival_airport.id
    },
    duration: `${durationHours}h ${durationMins}m`,
    stops: stops,
    price: flightData.price || 10000,
    isBest: false,
    // Phase 1 & 2 new fields
    isLongLayover,
    cabin,
    includesBaggage,
    bookingLink
  };
};

export const fetchRealFlights = async (origin, dest, date, isReturn = false, directOnly = false, preferredAirline = null, passengers = 1) => {
  try {
    const params = {
      origin,
      destination: dest,
      outDate: typeof date === 'string' ? date.split('T')[0] : new Date().toISOString().split('T')[0],
      passengers,
      type: '2' // one-way
    };

    const response = await axios.get(`${API_URL}/flights`, { params });
    
    const outDateStr = typeof date === 'string' ? date.split('T')[0] : new Date().toISOString().split('T')[0];
    const allFlights = [
      ...(response.data.best_flights || []),
      ...(response.data.other_flights || [])
    ];

    let mapped = allFlights.map(f => transformFlight(f, isReturn, origin, dest, outDateStr)).filter(f => f !== null);

    // Filter by direct only if requested
    if (directOnly) {
      mapped = mapped.filter(f => f.stops === 0);
    }

    // Filter by preferred airline if requested
    if (preferredAirline) {
      // SerpApi returns standard names, preferredAirline might have format "長榮航空 (EVA Air)"
      // So we do a basic loose string inclusion check
      const prefName = preferredAirline.toLowerCase();
      mapped = mapped.filter(f => prefName.includes(f.airline.toLowerCase()) || f.airline.toLowerCase().includes(prefName.split(' (')[0]));
    }

    // Mark the cheapest one as best
    if (mapped.length > 0) {
      const minPrice = Math.min(...mapped.map(f => f.price));
      const bestIndex = mapped.findIndex(f => f.price === minPrice);
      if (bestIndex !== -1) {
        mapped[bestIndex].isBest = true;
      }
    }

    return mapped;

  } catch (error) {
    console.warn('Real flights API failed (e.g., missing API key), falling back to mock data.', error.message);
    const mockFlights = generateFlights(origin, dest, date, isReturn, directOnly, preferredAirline);
    return mockFlights;
  }
};

export const fetchAccountInfo = async () => {
  try {
    const response = await fetch(`${API_URL}/account`);
    if (!response.ok) {
      throw new Error(`Account API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching account info:", error);
    return null;
  }
};

// ==========================================
// Phase 4: Auth & Database Sync API
// ==========================================

const getAuthHeaders = () => {
  const token = localStorage.getItem('nexus_token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const register = async (username, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await res.json();
  } catch (error) {
    return { error: 'Network error' };
  }
};

export const login = async (username, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await res.json();
  } catch (error) {
    return { error: 'Network error' };
  }
};

export const syncData = async (savedFlights, passengerProfile) => {
  try {
    const res = await fetch(`${API_URL}/user/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ savedFlights, passengerProfile })
    });
    return await res.json();
  } catch (error) {
    return { error: 'Network error' };
  }
};

export const getUserData = async () => {
  try {
    const res = await fetch(`${API_URL}/user/info`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const fetchFlightStatus = async (flightNum) => {
  try {
    const response = await axios.get(`${API_URL}/flight-status/${flightNum}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('無法連線到即時航班伺服器');
  }
};
