// src/utils/nasaApi.js
import axios from 'axios';

// Point this to your new Express backend
const BACKEND_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/neo`;

export const fetchNeoData = async () => {
  try {
    const response = await axios.get(BACKEND_URL);
    // The data is already formatted by your Express server!
    return response.data; 
  } catch (error) {
    console.error("Error fetching telemetry from backend:", error);
    throw error;
  }
};