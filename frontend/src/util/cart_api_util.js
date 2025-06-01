import axios from "axios";

export const getCart = (userId) => {
  return axios.get(`/api/carts/${userId}`);
};

// dateInfo = { date: ... }
export const addCartDate = (cartId, dateInfo) => {
  return axios.patch(`/api/carts/${cartId}/addDate/`, dateInfo);
};

// mealInfo = { date: ..., time: ..., recipeId: ... }
export const setCartMeal = (cartId, mealInfo) => {
  return axios.patch(`/api/carts/${cartId}/addMeal/`, mealInfo);
};

// mealInfo = { date: ..., time: ... }
export const deleteCartMeal = (cartId, mealInfo) => {
  return axios.delete(`/api/carts/${cartId}/meal`, { data: mealInfo });
};

// Set meal status (made/unmade)
export const setMealStatus = (cartId, statusInfo) => {
  return axios.patch(`/api/carts/${cartId}/setMealStatus`, statusInfo);
};
