const API_BASE_URL =
  import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_API_BASE_URL || 'https://adsdiagnosticsdatabase.onrender.com';

export default API_BASE_URL;