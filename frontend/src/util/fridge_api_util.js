import axios from 'axios';
import { getConvertAmounts } from './ingredient_api_util';

export const fetchFridge = (userId) => {
  return axios.get(`/api/fridge/${userId}`);
};

// ingredient object format: 
// ingredient: { ingredientId: 1, ingredientName: "chicken", amount: 50 }
export const addFridgeIngredient = (userId, ingredient, amount) => {
  let item = ingredient;
  item['amount'] = amount;
  return axios.patch(`/api/fridge/${userId}/addNewIngredient`, item);
};

// Amount can be negative or positive
// ingredient: { id: 1, name: "chicken", image: "url", aisle: "meat", amount: 50 }
export const modifyIngredient = (userId, ingredient, amount) => {
  let item = Object.assign({}, ingredient);
  item.amount = amount;
  return axios.patch(`/api/fridge/${userId}/modifyIngredient`, item);
};

// Could receive entire recipe object from state instead
export const modifyFridge = (userId, recipe, makeItem = true) => {
  let ingredients = {};
  let requests = 0;
  
  const list = recipe.ingredients.map(ingredient => Object.assign({}, ingredient));

  return Promise.all(
    list.map(async (ingredient) => {
      requests++;
      
      try {
        const res = await getConvertAmounts(ingredient.name, ingredient.unit, ingredient.amount);
        
        // Safeguard: Check if response is valid and contains the expected data
        if (res && res.data && res.data.targetAmount) {
          ingredient.amount = makeItem ? -res.data.targetAmount : res.data.targetAmount;
          ingredient.unit = "grams";
          ingredients[ingredient.id] = ingredient;
        } else {
          console.warn(`Conversion failed for ingredient: ${ingredient.name}`);
        }
      } catch (error) {
        console.error(`Error converting ingredient: ${ingredient.name}`, error);
      } finally {
        requests--;
        // If all requests are finished, update the fridge
        if (requests === 0) {
          return axios.patch(`/api/fridge/${userId}/modifyFridge`, ingredients);
        }
      }
    })
  );
};
