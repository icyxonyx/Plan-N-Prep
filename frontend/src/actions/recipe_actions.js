import * as RecipeAPI from '../util/recipe_api_util';
import { recipeArrayToObject } from "../selectors/selectors";
import { stopLoad } from './loading_actions';
import { getIngredientById } from '../util/ingredient_api_util';

export const RECEIVE_RECIPE = "RECEIVE_RECIPE";
export const RECEIVE_RECIPES = "RECEIVE_RECIPES";
export const RECEIVE_RECIPE_ERRORS = "RECEIVE_RECIPE_ERRORS";
export const ROTATE_RECIPE = "ROTATE_RECIPE";

// receives an array of recipes
const receiveRecipes = (recipes) => ({
  type: RECEIVE_RECIPES,
  recipes: recipeArrayToObject(recipes),
});

// receives a single recipe
const receiveRecipe = (recipe) => ({
  type: RECEIVE_RECIPE,
  recipe,
});

const receiveRecipeErrors = (errors) => ({
  type: RECEIVE_RECIPE_ERRORS,
  errors,
});

export const rotateRecipe = recipe_idx => ({
  type: ROTATE_RECIPE,
  recipe_idx,
});

export const getRecipeDB = (recipeId) => dispatch => (
  RecipeAPI
    .getRecipe(recipeId)
    .then(
      (response) => {
        if (response && response.data) {
          dispatch(receiveRecipe(response.data));
        } else {
          console.error('Invalid response format:', response);
          dispatch(receiveRecipeErrors('Invalid response format'));
        }
      },
      errors => dispatch(receiveRecipeErrors(errors))
    )
);

export const getRecipeById = (recipeId) => dispatch => (
  RecipeAPI
    .getRecipeById(recipeId)
    .then(
      (response) => {
        if (response && response.data) {
          let apiData = response.data;
          RecipeAPI
            .getRecipe(apiData.id)
            .then((response) => {
              if (response && response.data) {
                apiData = response.data;
                dispatch(receiveRecipes([apiData]));
              }
            })
            .catch(() => {
              RecipeAPI.postRecipeId(apiData)
                .then((response) => {
                  if (response && response.data) {
                    apiData = response.data;
                    dispatch(receiveRecipes([apiData]));
                  }
                });
            });
        } else {
          console.error('Invalid response format:', response);
          dispatch(receiveRecipeErrors('Invalid response format'));
        }
      },
      errors => dispatch(receiveRecipeErrors(errors))
    )
);

const getMultipleRecipes = (recipeIds) => dispatch => (
  RecipeAPI
    .getMultipleRecipes(recipeIds)
    .then(
      (response) => {
        if (response && response.data) {
          let apiData = response.data;
          let results = 0;
          let updateDone = 0;

          for (let i = 0; i < apiData.length; i++) {
            results++;
            RecipeAPI
              .getRecipe(apiData[i].id)
              .then((response) => {
                if (response && response.data) {
                  results--;
                  apiData[i] = response.data;
                  if (results === 0) {
                    dispatch(receiveRecipes(apiData));
                    dispatch(stopLoad());
                  }
                }
              })
              .catch(() => {
                let newRecipes = {};
                updateDone++;
                RecipeAPI.postRecipeId(apiData[i])
                  .then((payload) => {
                    if (payload && payload.data) {
                      results--;
                      apiData[i] = payload.data;
                      let ing = payload.data.ingredients;
                      let count = 0;
                      for (let j = 0; j < ing.length; j++) {
                        if (!ing[j].id) {
                          continue;
                        }
                        count++;
                        getIngredientById(ing[j].id).then(res => {
                          count--;
                          if (res && res.data) {
                            ing[j].aisle = res.data.aisle;
                          }
                          if (count === 0) {
                            RecipeAPI.updateRecipeIngredients(payload.data.recipeId, ing)
                              .then(res => {
                                if (res && res.data) {
                                  updateDone--;
                                  apiData[i] = res.data;

                                  if (updateDone === 0) {
                                    dispatch(receiveRecipes(apiData));
                                  }
                                }
                              });
                          }
                        });
                      }
                      if (results === 0) {
                        dispatch(receiveRecipes(apiData));
                        dispatch(stopLoad());
                      }
                    }
                  });
              });
          }
        } else {
          console.error('Invalid response format:', response);
          dispatch(receiveRecipeErrors('Invalid response format'));
        }
      },
      errors => dispatch(receiveRecipeErrors(errors))
    )
);

export const getRandomRecipe = () => dispatch => (
  RecipeAPI
    .getRandomRecipe()
    .then(
      (response) => {
        if (response && response.data) {
          let recipeId = response.data.recipes[0].id;
          dispatch(getRecipeById(recipeId));
        } else {
          console.error('Invalid response format:', response);
          dispatch(receiveRecipeErrors('Invalid response format'));
        }
      },
      errors => dispatch(receiveRecipeErrors(errors))
    )
);

export const getRandomRecipes = (number) => dispatch => (
  RecipeAPI.getRandomRecipes(number)
    .then(
      (response) => {
        if (response && response.data) {
          let recipeIds = response.data.recipes.map(recipe => recipe.id);
          dispatch(getMultipleRecipes(recipeIds));
        } else {
          console.error('Invalid response format:', response);
          dispatch(receiveRecipeErrors('Invalid response format'));
        }
      },
      errors => dispatch(receiveRecipeErrors(errors))
    )
);

export const getRecipesByIngredients = (ingredients, limit, ranking, ignorePantry) => dispatch => (
  RecipeAPI
    .getRecipesByIngredients(ingredients, limit, ranking, ignorePantry)
    .then(
      (response) => {
        if (response && response.data) {
          let recipeIds = response.data.map(recipe => recipe.id);
          dispatch(getMultipleRecipes(recipeIds));
        } else {
          console.error('Invalid response format:', response);
          dispatch(receiveRecipeErrors('Invalid response format'));
        }
      },
      errors => dispatch(receiveRecipeErrors(errors))
    )
);

export const getRecipesByName = (name, limit = 5) => dispatch => (
  RecipeAPI
    .searchRecipeByName(name, limit)
    .then(
      (response) => {
        if (response && response.data) {
          let recipeIds = response.data.map(recipe => recipe.id);
          dispatch(getMultipleRecipes(recipeIds));
        } else {
          console.error('Invalid response format:', response);
          dispatch(receiveRecipeErrors('Invalid response format'));
        }
      },
      errors => dispatch(receiveRecipeErrors(errors))
    )
);

// Complex search handling with updated checks
export const complexRecipeSearch = ({
  search, cuisine, diet, intolerances, sort, sortDirection, 
  minCalories, maxCalories, maxFat, maxCarbs, minProtein, 
  ignorePantry, limit
}) => dispatch => {
  RecipeAPI
    .complexRecipeSearch({
      search, cuisine, diet, intolerances, sort, sortDirection, 
      minCalories, maxCalories, maxFat, maxCarbs, minProtein,
      ignorePantry, limit
    })
    .then(
      (response) => {
        if (response && response.data) {
          let apiData = response.data.results;
          let results = 0;
          for (let i = 0; i < apiData.length; i++) {
            results++;
            RecipeAPI
              .getRecipe(apiData[i].id)
              .then((response) => {
                if (response && response.data) {
                  results--;
                  apiData[i] = response.data;
                  if (results === 0) {
                    dispatch(receiveRecipes(apiData));
                    dispatch(stopLoad());
                  }
                }
              })
              .catch(() => {
                RecipeAPI.postRecipeComplex(apiData[i])
                  .then((response) => {
                    if (response && response.data) {
                      results--;
                      apiData[i] = response.data;
                      if (results === 0) {
                        dispatch(receiveRecipes(apiData));
                        dispatch(stopLoad());
                      }
                    }
                  });
              });
          }
        } else {
          console.error('Invalid response format:', response);
          dispatch(receiveRecipeErrors('Invalid response format'));
        }
      },
      errors => dispatch(receiveRecipeErrors(errors))
    )
    .catch(err => {
      console.error('Error in complexRecipeSearch:', err);
    });
};
