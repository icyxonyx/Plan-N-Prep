import axios from 'axios';
import key from './key';

// In-memory cache for API responses with expiration
const cache = {};
const cacheTTL = 5 * 60 * 1000; // Cache TTL of 5 minutes

// Helper function to add a delay between API requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to handle detailed error logging
const handleError = (error) => {
  if (error.response) {
    console.error('Error Response:', error.response.data);
    console.error('Error Status:', error.response.status);
    console.error('Error Headers:', error.response.headers);
  } else if (error.request) {
    console.error('Error Request:', error.request);
  } else {
    console.error('Error Message:', error.message);
  }
};

// Exponential backoff function with a maximum retry limit
const backoff = async (attempt, fn, ...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    if (error.response && error.response.status === 429 && attempt < 5) {
      const delayTime = Math.pow(2, attempt) * 1000; // Exponential delay
      console.warn(`Rate limit hit, retrying in ${delayTime / 1000} seconds...`);
      await delay(delayTime);
      return backoff(attempt + 1, fn, ...args); // Retry with increased delay
    }
    throw error;
  }
};

// Cache wrapper to avoid repeated requests
const fetchWithCache = async (key, fn, ...args) => {
  const now = Date.now();
  
  if (cache[key] && (now - cache[key].timestamp < cacheTTL)) {
    return cache[key].data; // Return cached result if available and not expired
  }
  
  const result = await fn(...args);
  cache[key] = { data: result, timestamp: now }; // Cache the result with timestamp
  return result;
};

export const searchIngredientByName = (query = "", limit = 5, intolerances = []) => {
  const allergies = intolerances.join(",");
  return axios.get(`https://api.spoonacular.com/food/ingredients/autocomplete`, {
    params: {
      query: query,
      number: limit,
      intolerances: allergies,
      metaInformation: "true",
      apiKey: key.apiKey
    }
  }).catch(handleError);
};

// Get ingredient information by ID
export const getIngredientById = (id, amount = 1, unit = "gram") => {
  return axios.get(`https://api.spoonacular.com/food/ingredients/${id}/information`, {
    params: {
      amount: amount,
      unit: unit,
      apiKey: key.apiKey
    }
  }).catch(handleError);
};

// Returns array of substitutes under key 'substitutes'
export const getIngredientSubstitutes = (ingredientName) => {
  return axios.get(`https://api.spoonacular.com/food/ingredients/substitutes`, {
    params: {
      ingredientName: ingredientName,
      apiKey: key.apiKey
    }
  }).catch(handleError);
};

// Convert amounts
export const getConvertAmounts = (ingredient, sourceUnit, sourceAmount, targetUnit = "grams") => {
  return axios.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/convert", {
    headers: {
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "x-rapidapi-key": key.apiKey
    },
    params: {
      ingredientName: ingredient,
      targetUnit: targetUnit,
      sourceUnit: sourceUnit,
      sourceAmount: `${sourceAmount}`
    }
  }).catch(handleError);
};
