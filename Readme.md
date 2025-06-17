**Plan N Prep** 🍽️
Full-stack meal-planning, nutrition-tracking, and grocery-management application built with Node.js, Express, MongoDB, and React. Users can sign up (including personal details like height, weight, age, gender, activity level, weekly calorie target), maintain a virtual fridge inventory, search and save recipes via the Spoonacular API, plan meals on a date-based calendar (breakfast/lunch/dinner), track meal status, and send custom ingredient lists to their email. 📧🛒

---

## Table of Contents 📖

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
   * [Environment Variables](#environment-variables)
   * [Running in Development](#running-in-development)
   * [Building for Production](#building-for-production)
4. [Project Structure](#project-structure)
5. [API Endpoints](#api-endpoints)

   * [User Authentication & Profile](#user-authentication--profile)
   * [Fridge Inventory Management](#fridge-inventory-management)
   * [Recipe Storage & Updates](#recipe-storage--updates)
   * [Meal Planner Calendar (Cart)](#meal-planner-calendar-cart)
   * [Email Ingredient List](#email-ingredient-list)
6. [Frontend Overview](#frontend-overview)
7. [License](#license)

---

## Features ✨

* **User Registration & Profile** 

  * Sign up with name, email, password, plus **height**, **weight**, **age**, **gender**, **activity level**, **weekly calorie target**.
  * Passwords are hashed with bcrypt.js.
  * On registration, a default empty fridge and a meal-planning “cart” (calendar for today’s date) are auto-generated for each user.

* **Fridge Inventory Management** 

  * **Add / Modify / Remove Ingredients** by ID.
  * Store all ingredients in a single document (per user) as a nested object—supports upserting new items or incrementing/decrementing quantities.
  * Bulk update multiple ingredients in one request.
  * Automatically removes any ingredient whose quantity drops to zero or below.

* **Recipe Storage & Updates** 

  * **Save recipes** fetched from the Spoonacular API into your own MongoDB collection (schema includes `recipeId`, `title`, `image`, `sourceUrl`, `ingredients`, `instructions`, `nutrition`, `servings`, dietary tags, and more).
  * **Retrieve a saved recipe** by its Spoonacular `recipeId`.
  * **Update an existing recipe’s image** or **modify its ingredients array** with dedicated endpoints.

* **Meal Planner Calendar (Cart)** 

  * Each user has a **“cart”** document that acts as a date-based meal planner.
  * **Initialize today’s date** with `BREAKFAST`, `LUNCH`, and `DINNER` slots set to `null`, plus a nested `STATUS` object.
  * **Add a new date** to the planner (auto-creates slots and status object).
  * **Assign a recipe to a specific date & time** (breakfast/lunch/dinner).
  * **Remove a meal entry** from any date/time slot.
  * **Set a meal’s status** to “made” or “unmade” (Boolean flags) for progress tracking.

* **Email Ingredient List** 

  * Compile a list of ingredients (e.g., from the fridge or selected recipes) and **send via email** to the user.
  * Uses Nodemailer with environment-configurable SMTP (e.g., Gmail).
  * Dynamic email body generation shows each ingredient and its quantity.

* **Data Visualization & Insights** 

  * (Frontend) Render pie charts showing fridge-category breakdowns or weekly meal stats.
  * Plan and view your meal calendar visually (future work could integrate more charts).

---

## Technologies Used 🛠️

**Backend (Node.js + Express + MongoDB)**

* **Node.js v18.x** 
* **Express v4.x**
* **Mongoose v8.x** (MongoDB ODM)
* **bcryptjs v2.x** for password hashing 
* **JSON Web Tokens** (jsonwebtoken + passport-jwt) for auth
* **Nodemailer v6.x** for sending emails 
* **dotenv v16.x** for environment variables 
* **cors v2.x**, **connect-timeout v1.x**, **validator v13.x** for request handling & validation
* **passport v0.7.x** for authentication middleware

**Frontend (React + Redux)**

* **React v18.x** (Create React App) 
* **Redux v5.x** + **react-redux v9.x** + **redux-thunk v2.x** + **redux-logger v3.x**
* **React Router v5.x** 
* **Axios v1.x** for HTTP requests
* **JWT-decode v4.x** for parsing tokens
* **Material-UI v4.x** for UI components 
* **react-minimal-pie-chart v8.x** & **victory v37.x** for charts/visualizations 
* **react-toggle v4.x** for toggle switches
* **sass v1.x** for styling 

---

## Getting Started 🚀

### Prerequisites ✅

* **Node.js** (v14 or higher)
* **npm** (v6 or higher) or **yarn**
* **MongoDB** (cluster URI or local installation)
* A valid **Spoonacular API key** for recipe data 
* A **SMTP email account** (e.g., Gmail) for Nodemailer 

---

### Installation 🧩

1. **Clone the repository**

   ```bash
   git clone https://github.com/icyxonyx/PlanNPrep.git
   cd PlanNPrep/PlanNPrep
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   npm run frontend-install
   ```

   > This runs `npm install` inside the `frontend` directory.

---

### Environment Variables 🔑

Create a `.env` file in the project root (`PlanNPrep/PlanNPrep/.env`) with the following:

```
MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
SECRET_OR_KEY=<YOUR_JWT_SECRET>
SPOONACULAR_API_KEY=<YOUR_SPOONACULAR_KEY>
EMAIL_USER=<YOUR_EMAIL_ADDRESS>
EMAIL_PASS=<YOUR_EMAIL_PASSWORD>
```

* `MONGO_URI` – Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`).
* `SECRET_OR_KEY` – Secret string used to sign JWTs.
* `SPOONACULAR_API_KEY` – API key from Spoonacular ([https://spoonacular.com/](https://spoonacular.com/)) for recipe data.
* `EMAIL_USER` & `EMAIL_PASS` – Credentials for the email account used by Nodemailer to send ingredient lists.

---

### Running in Development 🛠️

From the project root (`PlanNPrep/PlanNPrep`), run:

```bash
npm run dev
```

This command will:

* Launch the **Express server** (with nodemon) on `http://localhost:5000/` 
* Launch the **React frontend** on `http://localhost:3000/` 

Because they run concurrently, you’ll see server logs and frontend logs side-by-side.

* All backend routes are prefixed with `/api`.
* In production mode, Express serves the React build from `frontend/build`.

---

### Building for Production 🎉

1. **Build the React frontend**

   ```bash
   npm run frontend
   ```

   This runs `react-scripts build` in `frontend/` and outputs optimized static files to `frontend/build`.

2. **Start the Express server** in production mode:

   ```bash
   NODE_ENV=production npm start
   ```

   The server will serve static files from `frontend/build` and handle API routes on port 5000 by default.

---

## Project Structure 🗂️

```
PlanNPrep/
├── .env                       # Environment variables (not committed)
├── .eslintrc.json             # ESLint configuration
├── app.js                     # Entry point for the Express server
├── config/
│   ├── keys.js                # Exports MONGO_URI & JWT secret
│   └── passport.js            # Passport JWT strategy setup
│
├── models/                    # Mongoose schemas
│   ├── cart.js                # Meal-planner “cart” schema (dates → meals & status)
│   ├── fridge.js              # Fridge schema (ingredients object)
│   ├── Recipe.js              # Saved recipe schema (Spoonacular fields)
│   └── user.js                # User schema (profile + auth)
│
├── routes/
│   └── api/
│       ├── carts.js           # /api/carts (meal planner endpoints)
│       ├── email.js           # /api/email/send-ingredients (email list)
│       ├── fridge.js          # /api/fridge (add/modify/remove ingredients)
│       ├── recipes.js         # /api/recipes (save & update recipes)
│       └── users.js           # /api/users (register, login, profile)
│
├── validation/                # Joi or custom validation middleware
│   ├── login.js
│   ├── register.js
│   └── valid-text.js
│
├── frontend/                  # React single-page application
│   ├── public/
│   │   ├── index.html         # HTML template
│   │   └── (favicon, manifest, etc.)
│   │
│   └── src/
│       ├── actions/           # Redux action creators (auth, fridge, recipes, cart)
│       ├── components/        # Reusable UI components (Navbar, FridgeList, MealCard…)
│       ├── reducers/          # Redux reducers (auth, fridge, recipes, cart)
│       ├── selectors/         # Reselect selectors for memoized state
│       ├── store/             # Redux store configuration (thunk, logger)
│       ├── util/              # Utility functions (setAuthToken, formatDate, etc.)
│       ├── index.js           # React entry point
│       └── index.scss         # Global SCSS styling
│
├── package.json               # Backend dependencies, scripts, and metadata
├── package-lock.json          # Locked dependency versions
└── README.md                  # ← You are here
```

---

## API Endpoints 🛣️

> All endpoints are JSON-based and prefixed with `/api`. Protected routes require:
> `Authorization: Bearer <token>` header (JWT).

### User Authentication & Profile 🔐

* **POST /api/users/register**
  Create a new user account.
  **Body:**

  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securePass123",
    "password2": "securePass123",
    "height": 165,          // in centimeters
    "weight": 60,           // in kilograms
    "age": 28,
    "gender": "F",          // "M" / "F" / "O"
    "activityLevel": 2,     // 1 to 4
    "weeklyTarget": 0.25,   // enums: -1.0, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1.0
  }
  ```

  **Response:**

  * `200 OK` – `{ success: true, token: "Bearer <jwt>" }`
  * `400 Bad Request` – Validation errors or email already exists.

* **POST /api/users/login**
  Log in with email & password.
  **Body:**

  ```json
  {
    "email": "jane@example.com",
    "password": "securePass123"
  }
  ```

  **Response:**

  * `200 OK` – `{ success: true, token: "Bearer <jwt>" }`
  * `400/404` – Invalid credentials or user not found.

* **GET /api/users/current** *(Protected)*
  Retrieve the authenticated user’s profile.
  **Response:**

  ```json
  {
    "id": "<userId>",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```

---

### Fridge Inventory Management 🥦

* **GET /api/fridge/\:userId** *(Protected)*
  Get the user’s fridge document (contains an `ingredients` object).
  **Response:**

  ```json
  {
    "_id": "<fridgeId>",
    "userId": "<userId>",
    "ingredients": {
      "<ingredientId>": {
        "id": "<ingredientId>",
        "name": "Tomatoes",
        "amount": 5,
        "expiryDate": "2025-06-10"
      },
      // …other ingredients
    },
    "date": "2025-05-30T12:34:56.789Z"
  }
  ```

* **PATCH /api/fridge/\:userId/addNewIngredient** *(Protected)*
  Upsert a new ingredient (creates fridge doc if none).
  **Body:**

  ```json
  {
    "id": "abc123",          // Unique client-generated ID for this item
    "name": "Tomatoes",
    "amount": 3,
    "expiryDate": "2025-06-10"
  }
  ```

  **Behavior:**

  * Adds a nested field `ingredients.abc123 = { … }`.
  * If the fridge document doesn’t exist, creates one.
    **Response:**
  * `200 OK` – Returns the added ingredient’s data.

* **PATCH /api/fridge/\:userId/modifyIngredient** *(Protected)*
  Increment/decrement an existing ingredient’s `amount`.
  **Body:**

  ```json
  {
    "id": "abc123",
    "amount": -1    // Positive to add, negative to subtract
  }
  ```

  **Behavior:**

  * Increments `ingredients.abc123.amount` by `amount`.
  * If resulting `amount ≤ 0`, the key `ingredients.abc123` is `$unset` (removed).
    **Response:**
  * `200 OK` – Returns updated ingredient data (or `null` if removed).

* **PATCH /api/fridge/\:userId/modifyFridge** *(Protected)*
  Bulk increment/decrement multiple ingredients in one request.
  **Body:**

  ```json
  {
    "abc123": { "amount": -2 },
    "def456": { "amount": 5 }
  }
  ```

  **Behavior:**

  * Iterates over each key (ingredient ID) and `$inc` its `.amount`.
  * After updating, removes any whose `.amount ≤ 0`.
    **Response:**
  * `200 OK` – Returns the updated fridge document.

---

### Recipe Storage & Updates 📚

* **GET /api/recipes/\:recipeId** *(Protected)*
  Retrieve a saved recipe by its Spoonacular `recipeId`.
  **Response:**

  ```json
  {
    "_id": "<mongoId>",
    "recipeId": 12345,
    "title": "Chicken Salad",
    "image": "https://…/image.jpg",
    "sourceUrl": "https://…",
    "sourceName": "Spoonacular",
    "ingredients": [ /* array of ingredient objects */ ],
    "instructions": [ /* analyzed instructions array */ ],
    "nutrition": [ /* array of nutrient objects */ ],
    "servings": 4,
    "spoonacularScore": 82.5,
    "cuisines": ["Mediterranean"],
    "diets": ["Gluten Free"],
    "dishtypes": ["Salad"],
    "readyInMinutes": 30,
    "dairyFree": true,
    "glutenFree": true,
    "ketogenic": false,
    "vegan": false,
    "vegetarian": false,
    "veryPopular": false
  }
  ```

* **POST /api/recipes/indiv** *(Protected)*
  Save a recipe fetched from Spoonacular’s “Get Recipe Information” endpoint into your DB.
  **Body:** (matches Spoonacular’s response structure)

  ```json
  {
    "id": 12345,
    "title": "Chicken Salad",
    "image": "https://…/image.jpg",
    "sourceUrl": "https://…",
    "sourceName": "Spoonacular",
    "extendedIngredients": [ /* array of ingredient objects */ ],
    "analyzedInstructions": [ /* array of instruction objects */ ],
    "nutrition": { "nutrients": [ /* array of nutrient objects */ ] },
    "servings": 4,
    "spoonacularScore": 82.5,
    "cuisines": ["Mediterranean"],
    "diets": ["Gluten Free"],
    "dishtypes": ["Salad"],
    "readyInMinutes": 30,
    "dairyFree": true,
    "glutenFree": true,
    "ketogenic": false,
    "vegan": false,
    "vegetarian": false,
    "veryPopular": false
  }
  ```

  **Response:**

  * `200 OK` – Returns the newly created recipe document.

* **POST /api/recipes/item** *(Protected)*
  Save a recipe from Spoonacular’s “Search by Ingredients” (less detailed) into your DB.
  **Body:** (matches Spoonacular’s search-by-ingredients return)

  ```json
  {
    "id": 67890,
    "title": "Veggie Stir-Fry",
    "image": "https://…/image.jpg",
    "sourceUrl": "https://…",
    "sourceName": "Spoonacular",
    "missedIngredients": [ /* array of missing ingredient objects */ ],
    "nutrition": [ /* partial nutrition array */ ],
    "analyzedInstructions": [ /* instructions if available */ ],
    "servings": 2,
    "spoonacularScore": 75.0,
    "cuisines": [],
    "diets": ["Vegan"],
    "dishtypes": ["Main Course"],
    "readyInMinutes": 20,
    "dairyFree": true,
    "glutenFree": true,
    "ketogenic": false,
    "vegan": true,
    "vegetarian": true,
    "veryPopular": false
  }
  ```

  **Response:**

  * `200 OK` – Returns the newly created recipe document.

* **PATCH /api/recipes/\:recipeId/picture** *(Protected)*
  Update only the `image` field of an existing recipe.
  **Body:**

  ```json
  { "image": "https://…/new-image.jpg" }
  ```

  **Response:**

  * `200 OK` – Returns the updated recipe document.

* **PATCH /api/recipes/\:recipeId/ingredients** *(Protected)*
  Overwrite the `ingredients` array of an existing recipe.
  **Body:**

  ```json
  [ /* new array of ingredient objects */ ]
  ```

  **Response:**

  * `200 OK` – Returns the updated recipe document.

---

### Meal Planner Calendar (Cart) 📅

> Despite the name “cart”, this resource functions as a date-based meal planner with slots for `BREAKFAST`, `LUNCH`, and `DINNER`, plus a `STATUS` map.

* **GET /api/carts/\:userId** *(Protected)*
  Retrieve the current user’s meal-planner “cart” document.
  **Response:**

  ```json
  {
    "_id": "<cartId>",
    "userId": "<userId>",
    "dates": {
      "Tue May 27 2025": {
        "BREAKFAST": "12345",   // recipeId or null
        "LUNCH": null,
        "DINNER": null,
        "STATUS": {
          // e.g., "BREAKFAST": true/false if made/unmade
        }
      },
      // …other dates
    }
  }
  ```

* **PATCH /api/carts/\:cartId/addDate/** *(Protected)*
  Add a new date to the meal planner (auto-creates meal slots + empty `STATUS`).
  **Body:**

  ```json
  { "date": "Wed Jun 02 2025" }
  ```

  **Response:**

  * `200 OK` – Returns updated cart document with new date entry:

    ```json
    "dates": {
      "Wed Jun 02 2025": {
        "BREAKFAST": null,
        "LUNCH": null,
        "DINNER": null,
        "STATUS": {}
      }
      // …existing dates
    }
    ```

* **PATCH /api/carts/\:cartId/addMeal/** *(Protected)*
  Assign a recipe to a specific date & time.
  **Body:**

  ```json
  {
    "date": "Wed Jun 02 2025",
    "time": "LUNCH",      // "BREAKFAST" / "LUNCH" / "DINNER"
    "recipeId": "67890"
  }
  ```

  **Response:**

  * `200 OK` – Returns updated cart with `dates["Wed Jun 02 2025"].LUNCH = "67890"`.

* **DELETE /api/carts/\:cartId/meal** *(Protected)*
  Remove a meal from a specific date & time.
  **Body:**

  ```json
  {
    "date": "Wed Jun 02 2025",
    "time": "LUNCH"
  }
  ```

  **Response:**

  * `200 OK` – Returns updated cart with that slot removed.

* **PATCH /api/carts/\:cartId/setMealStatus** *(Protected)*
  Mark a meal as “made” or “unmade” for progress tracking.
  **Body:**

  ```json
  {
    "date": "Wed Jun 02 2025",
    "time": "BREAKFAST",
    "status": true    // true = made, false = unmade
  }
  ```

  **Response:**

  * `200 OK` – Returns updated cart with
    `dates["Wed Jun 02 2025"].STATUS.BREAKFAST = true`.

---

### Email Ingredient List 📧

* **POST /api/email/send-ingredients** *(Protected)*
  Send a curated ingredient list via email to the user.
  **Body:**

  ```json
  {
    "userId": "<userId>",
    "ingredients": [
      { "name": "Tomatoes", "amount": 3 },
      { "name": "Spinach", "amount": 2 }
    ]
  }
  ```

  **Behavior:**

  * Looks up the user’s email by `userId`.
  * Compiles a text body:

    ```
    Here is your ingredient list:
    - Tomatoes: 3
    - Spinach: 2
    ```
  * Sends the email via Nodemailer (using `EMAIL_USER` + `EMAIL_PASS`).
    **Response:**
  * `200 OK` – `{ message: "Email sent successfully!" }`
  * `500 Internal Server Error` – On SMTP or other failure.

---

## Frontend Overview 🖥️

* **Entry Point:**
  `frontend/src/index.js` initializes the React app, wraps `<App />` inside `<Provider>` (Redux) and `<BrowserRouter>`.

* **State Management:**

  * Redux store configured in `frontend/src/store/` with `redux-thunk` & `redux-logger`.
  * **actions/**: Action creators for `auth`, `fridge`, `recipes`, and `cart` (meal planner).
  * **reducers/**: Reducers handle slices for `auth`, `fridge`, `recipes`, and `cart`.
  * **selectors/**: Reselect selectors for memoized derived state (e.g., filter fridge items by expiry).

* **Styling:**

  * Global SCSS in `frontend/src/index.scss`.
  * **Material-UI** for ready-made components (Buttons, Cards, TextFields).
  * Custom Sass modules for responsive grid layouts, theme variables, and utility classes.

* **Key Components:**

  * **Auth & Profile**:

    * `RegisterForm.jsx` / `LoginForm.jsx` (with client-side validation matching backend).
    * `PrivateRoute.jsx` ensures authenticated access to protected routes.
    * `Profile.jsx` displays user’s personal details (height, weight, age, etc.) and weekly target.
  * **Fridge Dashboard:**

    * `FridgeList.jsx`: Renders a table/list of all fridge ingredients (name, amount, expiry).
    * `AddIngredientForm.jsx`: Form to enter a new ingredient (ID generated client-side, specify amount & expiry).
    * Inline “+ / –” buttons to increment/decrement each item’s quantity.
  * **Recipe Manager:**

    * `RecipeSearch.jsx`: Allows keyword search or “by ingredients” lookup via Spoonacular.
    * `RecipeCard.jsx`: Displays a saved recipe’s thumbnail, title, and diet tags.
    * `RecipeDetails.jsx`: Shows full details (ingredients list, instructions, nutrition, and “Save to My Recipes”).
    * In “My Recipes” page, each saved recipe can be updated (change image, edit ingredients).
  * **Meal Planner (Cart):**

    * `Calendar.jsx`: Displays a scrollable list of dates (e.g., next 7 days) with slots for BREAKFAST, LUNCH, DINNER.
    * Each slot shows either “Add Meal” (opens a modal to pick a saved recipe) or the assigned recipe’s title + thumbnail.
    * Click on a slot to mark as “Done” (✔️) or “Undone” (⏳) via toggle.
    * Buttons to “Add New Date” and automatically default today’s date.
  * **Email Builder:**

    * `EmailForm.jsx`: Displays a checkable list of fridge items or recipe ingredients; user selects which to include, then clicks “Send to Email.”
    * On submit, calls `/api/email/send-ingredients` and shows success/error toast.
  * **Charts & Insights:**

    * `FridgeStats.jsx`: Renders a pie chart of fridge ingredients by category (fruit, veggie, dairy, etc.).
    * `MealStats.jsx`: Optionally render a bar chart of “meals completed vs. planned” over the past week (using Victory).

* **Utilities:**

  * `setAuthToken.js`: Automatically sets the `Authorization` header in Axios if a JWT exists in localStorage.
  * `formatDate.js`: Converts JS `Date` objects to a string like `Tue May 27 2025`.
  * `validateInput.js`: Mirror of backend validation (e.g., check password length, email format).

## License 📄

This project is licensed under the [MIT License](LICENSE).
Feel free to fork, use, and modify as needed.
