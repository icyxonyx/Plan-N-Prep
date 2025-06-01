import React from "react";
import WeeklyIngredientsCatagory from "./weekly_ingredients_catagory";

const TIMES = ["BREAKFAST", "LUNCH", "DINNER"];

class WeeklyIngredients extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dates: [],
      catagories: {},
    };

    this.ingredients = {};
    this.results = 0;
    this.generateDates = this.generateDates.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
    this.downloadIngredients = this.downloadIngredients.bind(this); // Bind the new function
  }

  componentDidMount() {
    let { getCart, userId, cart } = this.props;
    if (!cart.dates) {
      getCart(userId).then(() => this.getRecipes());
    } else {
      this.getRecipes();
    }
  }

  generateDates() {
    let currentDate = new Date();
    currentDate = new Date(currentDate);
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
    let { cart, recipes, addCartDate, getRecipeDB } = this.props;
    let recipeId;

    for (let i = 0; i < dates.length; i++) {
      for (let j = 0; j < TIMES.length; j++) {
        if (!cart.dates[dates[i]]) continue;
        recipeId = cart.dates[dates[i]][TIMES[j]];
        if (recipeId && recipes[recipeId]) {
          this.modifyIngredients(recipes[recipeId]);
        } else if (recipeId && !recipes[recipeId]) {
          this.results++;
          getRecipeDB(recipeId).then(({ recipe }) => {
            this.results--;
            this.modifyIngredients(recipe);
          });
        }
      }
    }
  }

  modifyIngredients(recipe) {
    for (let i = 0; i < recipe.ingredients.length; i++) {
      this.ingredients[recipe.ingredients[i].id] = recipe.ingredients[i];

      if (this.results === 0) {
        let ing = {};
        let ids = Object.keys(this.ingredients);
        for (let i = 0; i < ids.length; i++) {
          let ingredient = this.ingredients[ids[i]];
          let aisle = ingredient.aisle.split(";")[0];

          if (!ing[aisle]) {
            ing[aisle] = {};
          }

          ing[aisle][ids[i]] = ingredient;
        }
        this.setState({ catagories: ing });
      }
    }
  }

  // Updated function to download the ingredient list as a text file
  downloadIngredients() {
    const ingredientDetails = [];

    ingredientDetails.push("Weekly Ingredient List\n");
    ingredientDetails.push("========================================\n");

    for (const aisle in this.state.catagories) {
      ingredientDetails.push(`Category: ${aisle}\n`);
      ingredientDetails.push("----------------------------------------\n");

      for (const id in this.state.catagories[aisle]) {
        const ingredient = this.state.catagories[aisle][id];
        // Format the ingredient details with indentation
        ingredientDetails.push(`  - Name: ${ingredient.name}\n`);
        ingredientDetails.push(
          `    Quantity: ${ingredient.amount} ${ingredient.unit || ""}\n`
        );
      }
      ingredientDetails.push("\n"); // Add a blank line between aisles
    }

    const blob = new Blob([ingredientDetails.join("\n")], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ingredient-list.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  emptyCart() {
    if (this.props.cart.dates) {
      let days = Object.keys(this.props.cart.dates);
      for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < TIMES.length; j++) {
          if (this.props.cart.dates[days[i]][TIMES[j]]) {
            return false;
          }
        }
      }
      return true;
    }
    return true;
  }

  render() {
    let catagories;
    let ids = Object.keys(this.state.catagories);
    if (Object.keys(this.state.catagories).length === 0 && !this.emptyCart()) {
      catagories = <div className="weekly-loading">Loading...</div>;
    } else {
      catagories = [];
      for (let i = 0; i < ids.length; i++) {
        catagories.push(
          <WeeklyIngredientsCatagory
            key={ids[i]}
            catagory={ids[i]}
            ingredients={this.state.catagories[ids[i]]}
          />
        );
      }
    }

    return (
      <div className="weekly-ingredients-container">
        <div className="title">Weekly Shopping List</div>
        <ul className="catagory-list">{catagories}</ul>
        <a className="btnn" onClick={this.downloadIngredients}>
          <span>
            <span>
              <span>Download Ingredient List</span>
            </span>
          </span>
        </a>
      </div>
    );
  }
}

export default WeeklyIngredients;
