import {
  ADD_RECIPE,
  REMOVE_RECIPE,
  MAKE_RECIPE,
  UNMAKE_RECIPE,
  ADD_DATE,
  RECEIVE_CART,
} from '../actions/cart_actions';

const CartReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);

  switch (action.type) {
    case ADD_RECIPE:
      nextState.dates[action.date][action.time] = action.recipeId;
      return nextState;
    case REMOVE_RECIPE:
      nextState.dates[action.date][action.time] = undefined;
      return nextState;

    case MAKE_RECIPE:
      nextState.dates[action.date].STATUS[action.time] = true;
      return nextState;

    case UNMAKE_RECIPE:
      nextState.dates[action.date].STATUS[action.time] = undefined;
      return nextState;

    case ADD_DATE:
      if (nextState[action.date]) return nextState;
      nextState.dates[action.date] = { 
        "BREAKFAST": null, 
        "LUNCH": null,
        "DINNER": null,
        "STATUS": {},
      };
      return nextState;

    case RECEIVE_CART:
      return action.cart;

    default:
      return state;
  }
};

export default CartReducer;