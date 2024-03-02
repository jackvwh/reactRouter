import { API_URL } from "../settings";
import { makeOptions, handleHttpErrors } from "./fetchUtils";
const CATEGORIES_URL = API_URL + "/categories";
const RECIPE_URL = API_URL + "/recipes";
const INFO_URL = API_URL + "/info";

interface Recipe {
  id: number | null;
  name: string;
  category: string;
  instructions: string;
  thumb: string;
  youTube: string;
  ingredients: string;
  source: string;
}

interface Info {
  reference: string;
  created: string;
  info: string;
}

let categories: Array<string> = [];
let recipes: Array<Recipe> = [];
// booleans to check if the lists are updated
let recipeListUpdated: boolean = false;
let categoryListUpdated: boolean = false;

async function getCategories(): Promise<Array<string>> {
  // If we have the categories in the list and not updated, return it
  if (categoryListUpdated === true || categories.length === 0) {
    const res = await fetch(CATEGORIES_URL).then(handleHttpErrors);
    categories = [...res];
    // Set the categoryListUpdated to false, so we don't fetch the categories again
    categoryListUpdated = false;
    return categories;
  } else {
    return [...categories];
  }
}
async function getRecipes(category: string | null): Promise<Array<Recipe>> {
  // If we have the recipes in the list and not updated, return it
  if (recipeListUpdated === true || recipes.length === 0) {
    console.log("category", category);
    const queryParams = category ? "?category=" + category : "";
    const res = await fetch(RECIPE_URL + queryParams).then(handleHttpErrors);
    recipes = [...res];
    // Set the recipeListUpdated to false, so we don't fetch the recipes again
    recipeListUpdated = false;
    return recipes;
  } else {
    return [...recipes];
  }
}
async function getRecipe(id: number): Promise<Recipe> {
  // If we have the recipe in the list and not updated, return it
  if (recipes.length > 0 && recipeListUpdated === false) {
    const recipe = recipes.find((r) => r.id === id);
    if (recipe) {
      return recipe;
    }
  }
  return fetch(RECIPE_URL + "/" + id).then(handleHttpErrors);
}
async function addRecipe(newRecipe: Recipe): Promise<Recipe> {
  const method = newRecipe.id ? "PUT" : "POST";
  const options = makeOptions(method, newRecipe);
  const URL = newRecipe.id ? `${RECIPE_URL}/${newRecipe.id}` : RECIPE_URL;
  // Set the recipeListUpdated to true, so we fetch the recipes again
  recipeListUpdated = true;
  return fetch(URL, options).then(handleHttpErrors);
}
async function deleteRecipe(id: number): Promise<Recipe> {
  const options = makeOptions("DELETE", null);
  // delete the recipe from cached list with filter , easier than fetching all again
  recipes = recipes.filter((r) => r.id !== id);
  return fetch(`${RECIPE_URL}/${id}`, options).then(handleHttpErrors);
}

async function getInfo(): Promise<Info> {
  return fetch(INFO_URL).then(handleHttpErrors);
}

export type { Recipe, Info };
// eslint-disable-next-line react-refresh/only-export-components
export {
  getCategories,
  getRecipes,
  getRecipe,
  addRecipe,
  deleteRecipe,
  getInfo,
};
