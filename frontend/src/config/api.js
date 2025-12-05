// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  PROGRAM_ADDRESS: import.meta.env.VITE_PROGRAM_ADDRESS || '', // Solana Program ID (to be deployed)
  NETWORK: import.meta.env.VITE_SOLANA_NETWORK || 'devnet', // 'devnet' or 'mainnet-beta'
  RPC_URL: import.meta.env.VITE_RPC_URL || 'https://api.devnet.solana.com',
};

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/',
  CONTESTS: '/contests',
  CONTEST_BY_ID: (id) => `/contests/${id}`,
  CONTEST_JOIN: (id) => `/contests/${id}/join`,
  CONTEST_JOINED: (id, userAddress) => `/contests/${id}/joined/${userAddress}`,
  CONTEST_CREATE: '/contests/create',
  CONTEST_DISTRIBUTE: '/contests/distribute',
  TEST_CONTRACT: '/test-contract',
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to make API calls with error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};
