import React from "react";
import NavBarContainer from "../nav/navbar_container";
import WeeklyCartDayContainer from "./weekly_cart_day_container";
import WeeklyMacro from "./weekly_macro";
import WeeklyNutrition from "./weekly_nutrition";
import "../stylesheets/weekly_cart/weekly_cart.scss";

const TIMES = ["BREAKFAST", "LUNCH", "DINNER"];

class WeeklyCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dates: [],
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
    };

    this.generateDates = this.generateDates.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
    this.modifyMacros = this.modifyMacros.bind(this);
    this.removeMacros = this.removeMacros.bind(this);
  }

  componentDidMount() {
    const { getCart, user, cart, fetchFridge, fetchUser } = this.props;
    fetchFridge(user.id).then(() => {
      if (!cart.dates) {
        getCart(user.id).then(() => {
          this.getRecipes();
        });
      } else {
        this.getRecipes();
      }
    });
    fetchUser(user.id);
  }

  generateDates() {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    let dateStrings = [currentDate.toDateString().slice(0, 15)];
    while (dateStrings.length < 7) {
      currentDate.setDate(currentDate.getDate() + 1);
      dateStrings.push(currentDate.toDateString().slice(0, 15));
    }

    return dateStrings;
  }

  getRecipes() {
    let dates = this.generateDates();
    const { cart, recipes, addCartDate, getRecipeDB } = this.props;
    let recipeId;

    let results = 0;
    for (let i = 0; i < dates.length; i++) {
      if (!cart.dates[dates[i]]) {
        results++;
        addCartDate(cart.id, { date: dates[i] }).then(() => {
          results--;
          if (results === 0) this.setState({ dates });
        });
      } else {
        for (let j = 0; j < TIMES.length; j++) {
          recipeId = cart.dates[dates[i]][TIMES[j]];
          if (recipeId && recipes[recipeId]) {
            this.modifyMacros(recipes[recipeId], "add");
          } else if (recipeId && !recipes[recipeId]) {
            results++;
            getRecipeDB(recipeId)
              .then((response) => {
                const { recipe } = response || {}; // Safeguard against undefined response
                if (recipe) {
                  this.modifyMacros(recipe, "add");
                }
                results--;
                if (results === 0) this.setState({ dates });
              })
              .catch((error) => {
                console.error("Error fetching recipe:", error);
                results--;
                if (results === 0) this.setState({ dates });
              });
          } else if (!recipeId) {
            if (results === 0) this.setState({ dates });
          }
        }
        if (results === 0) this.setState({ dates });
      }
    }
  }

  modifyMacros(recipe, operation) {
    let recipeNutrition = Object.values(recipe.nutrition);
    let nutrientNames = [
      "Calories",
      "Fat",
      "Saturated Fat",
      "Carbohydrates",
      "Sugar",
      "Cholesterol",
      "Sodium",
      "Protein",
      "Vitamin B6",
      "Potassium",
      "Manganese",
      "Phosphorus",
      "Fiber",
      "Magnesium",
      "Vitamin C",
      "Vitamin B1",
      "Vitamin B3",
      "Copper",
      "Iron",
      "Folate",
      "Vitamin B5",
      "Vitamin B2",
      "Selenium",
      "Zinc",
      "Calcium",
      "Vitamin K",
      "Vitamin B12",
      "Vitamin D",
      "Vitamin E",
      "Vitamin A",
    ];

    let newState = {};
    for (let i = 0; i < nutrientNames.length; i++) {
      let nutrient = nutrientNames[i];

      let recipeInfo = recipeNutrition.filter((val) =>
        [nutrient].includes(val.title)
      );
      if (!recipeInfo || !recipeInfo[0]) continue;

      let recipeAmount = recipeInfo[0] ? recipeInfo[0].amount : 0;
      let recipePercentage = recipeInfo[0]
        ? recipeInfo[0].percentOfDailyNeeds
        : 0;

      let stateAmount = this.state[nutrient] ? this.state[nutrient].amount : 0;
      let statePercentage = this.state[nutrient]
        ? this.state[nutrient].percentage
        : 0;

      if (operation === "add") {
        newState[nutrient] = {
          amount:
            stateAmount + recipeAmount < 0 ? 0 : stateAmount + recipeAmount,
          unit: recipeInfo[0].unit,
          percentage:
            statePercentage + recipePercentage < 0
              ? 0
              : statePercentage + recipePercentage,
        };
      } else {
        newState[nutrient] = {
          amount: stateAmount - recipeAmount,
          unit: recipeInfo[0].unit,
          percentage: statePercentage - recipePercentage,
        };
      }
    }

    this.setState(newState);
  }

  removeMacros(recipeId) {
    this.props
      .getRecipeDB(recipeId)
      .then((response) => {
        const { recipe } = response || {};
        if (recipe) {
          this.modifyMacros(recipe, "remove");
        }
      })
      .catch((error) => {
        console.error("Error removing recipe:", error);
      });
  }

  render() {
    const { dates } = this.state;
    if (dates.length > 0) {
      return (
        <div className="weekly-cart-page">
          <div className="top">
            <NavBarContainer />
          </div>
          <div className="weekly-cart-info">
            <div className="weekly-cart-days">
              <div className="weekly-cart-times">
                <div>BREAKFAST</div>
                <div>LUNCH</div>
                <div>DINNER</div>
              </div>
              <div className="weekly-cart-divider"></div>
              {dates.map((date, idx) => {
                return (
                  <WeeklyCartDayContainer
                    date={date}
                    key={idx}
                    removeMacros={this.removeMacros}
                  />
                );
              })}
            </div>
            {/* <div className="weekly-cart-details">
              <WeeklyNutrition nutrients={this.state} />
              <div className="weekly-cart-data">
                <WeeklyMacro
                  calories={
                    this.state.Calories ? this.state.Calories.amount : 0
                  }
                  carbs={
                    this.state.Carbohydrates
                      ? this.state.Carbohydrates.amount
                      : 0
                  }
                  protein={this.state.Protein ? this.state.Protein.amount : 0}
                  fat={this.state.Fat ? this.state.Fat.amount : 0}
                  fiber={this.state.Fiber ? this.state.Fiber.amount : 0}
                  user={this.props.currentUser}
                />
                <div className="weekly-cart-graph"></div>
              </div>
            </div> */}
          </div>
        </div>
      );
    } else {
      return <div className="weekly-cart"></div>;
    }
  }
}

export default WeeklyCart;
