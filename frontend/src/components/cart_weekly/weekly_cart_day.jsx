import React from "react";
import { modifyFridge } from "../../util/fridge_api_util";
import "../stylesheets/weekly_cart/weekly_cart_day.scss";

const TIMES = ["BREAKFAST", "LUNCH", "DINNER"];

class WeeklyCartDay extends React.Component {
  constructor(props) {
    super(props);

    this.recipe = {
      BREAKFAST: null,
      LUNCH: null,
      DINNER: null,
    };

    this.removeItem = this.removeItem.bind(this);
    this.makeItem = this.makeItem.bind(this);
    this.makeItemButton = this.makeItemButton.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  removeItem(e, time) {
    e.stopPropagation();
    const { cart, date, removeCartMeal, removeMacros } = this.props;

    // Removing macros related to the meal
    removeMacros(cart.dates[date][time]);

    // Remove the meal from the cart using Redux action
    removeCartMeal(cart.id, { date, time });

    // After removing the meal, also update the UI
    this.recipe[time] = null; // Update the local recipe state to reflect removal
  }

  makeItemButton(time) {
    let { cart, date } = this.props;

    if (cart.dates[date].STATUS && cart.dates[date].STATUS[time]) {
      return (
        <div
          className="weekly-cart-item-eat"
          onClick={(e) => {
            this.unmakeItem(e, this.recipe[time], date, time);
          }}
        >
          Unmake Meal
        </div>
      );
    } else {
      if (!cart.dates[date].STATUS) debugger;
      return (
        <div
          className="weekly-cart-item-eat"
          onClick={(e) => {
            this.makeItem(e, this.recipe[time], date, time);
          }}
        >
          Make Meal
        </div>
      );
    }
  }

  makeItem(e, recipe, date, time) {
    e.stopPropagation();
    const { fridge, user } = this.props;
    let fridgeCopy = Object.assign({}, fridge);
    let ingredients = Object.values(recipe.ingredients);

    // Ensure there are enough ingredients in the fridge before making the meal
    for (let i = 0; i < ingredients.length; i++) {
      let id = ingredients[i].ingredientId;
      if (!fridgeCopy[id] || fridgeCopy[id].quantity < ingredients[i].amount) {
        // Exit if not enough ingredients
        return;
      }
      fridgeCopy[id].quantity -= ingredients[i].amount;
    }

    // Update fridge in the backend and mark the meal as made
    modifyFridge(user.id, fridgeCopy);
    this.props.makeRecipe(date, time); // Mark the meal as "made"
  }

  unmakeItem(e, recipe, date, time) {
    e.stopPropagation();
    const { fridge, user } = this.props;
    let fridgeCopy = Object.assign({}, fridge);
    let ingredients = Object.values(recipe.ingredients);

    // Return ingredients to the fridge
    for (let i = 0; i < ingredients.length; i++) {
      let id = ingredients[i].ingredientId;
      if (!fridgeCopy[id]) {
        fridgeCopy[id] = { quantity: 0 }; // Initialize if it doesn't exist
      }
      fridgeCopy[id].quantity += ingredients[i].amount;
    }

    // Update fridge in the backend and mark the meal as unmade
    modifyFridge(user.id, fridgeCopy);
    this.props.unmakeRecipe(date, time); // Mark the meal as "unmade"
  }

  openModal(e, recipe) {
    e.stopPropagation();
    if (recipe.image !== "...") this.props.openModal(recipe);
  }

  render() {
    const { recipes, cart, date, openModal, addMacros } = this.props;
    const mapper = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };

    let cartContent = TIMES.map((time, idx) => {
      this.recipe[time] = recipes[cart.dates[date][time]];

      // Handle the case where the recipe isn't found
      if (!this.recipe[time] && recipes[cart.dates[date][time]]) {
        this.recipe[time] = {
          title: "Recipe Not Found",
          image: "...",
          recipeId: cart.dates[date][time],
        };
      }

      // Render if the recipe exists
      if (this.recipe[time]) {
        return (
          <div className="weekly-cart-item" key={idx}>
            <div className="weekly-cart-item-main">
              <div className="weekly-cart-item-info">
                <div className="weekly-cart-item-info-text">
                  <div className="weekly-cart-item-info-left">
                    <div className="weekly-cart-item-name">
                      {this.recipe[time].title.slice(0, 15) + ".."}
                    </div>
                    <div className="weekly-cart-item-buttons">
                      <div
                        className="weekly-cart-item-remove"
                        onClick={(e) => {
                          this.removeItem(e, time);
                        }}
                      >
                        Remove
                      </div>
                      {this.makeItemButton(time)}
                    </div>
                  </div>
                  <div className="weekly-cart-image">
                    <img
                      className="weekly-cart-item-info-image"
                      src={this.recipe[time].image}
                      onClick={(e) => this.openModal(e, this.recipe[time])}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="weekly-cart-item" key={idx}>
            <div className="weekly-cart-item-info"></div>
          </div>
        );
      }
    });

    return (
      <div className="weekly-cart-day">
        <div className="weekly-cart-header-date">
          <div>{date.split(" ")[0]}</div>
        </div>
        <div className="weekly-cart-day-divider"></div>
        <div className="weekly-cart-date">{cartContent}</div>
      </div>
    );
  }
}

export default WeeklyCartDay;
