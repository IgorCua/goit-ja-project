import * as icons from '../images/svg/symbol-defs.svg';
import { currentUserId } from './firebase';
import { readFavoriteDrinks, writeFavoriteDrinks, deleteFavoriteDrink } from './firebase';

function getFavouriteDrinks() {
  console.log(currentUserId);
  if (currentUserId) {
    console.log(`hello i am readFavoriteDrinks for ${currentUserId}`);
    return readFavoriteDrinks(currentUserId);
  }
  return JSON.parse(localStorage.getItem('favorite-cocktail')) ?? [];
}

function setFavouriteDrinks(favourites) {
  localStorage.setItem('favorite-cocktail', JSON.stringify(favourites));
}

export function addDrink(id, name, image) {
  if (!getDrink(id)) {
    let favouriteDrink = { id: id, name: name, img: image };
    let favourites = getFavouriteDrinks();
    favourites.push(favouriteDrink);
    setFavouriteDrinks(favourites);
    console.log(currentUserId);
    if (currentUserId) {
      console.log(`hello i am writeFavoriteDrinks for ${currentUserId}`);
      writeFavoriteDrinks(currentUserId, favourites);
    };
  }
}

export function removeDrink(id) {
  let favourites = getFavouriteDrinks();
  let updatedFavourites = [];
  for (let i = 0; i < favourites.length; i++) {
    let drink = favourites[i];
    if (drink.id != id) {
      updatedFavourites.push(drink);
    }
  }
  setFavouriteDrinks(updatedFavourites);
  console.log(currentUserId);
  if (currentUserId) {
    console.log(`hello i am deleteFavoriteDrink fav drink for ${currentUserId}`);
    deleteFavoriteDrink(currentUserId, id);
  };
}

export function getDrink(id) {
  for (let drink of getFavouriteDrinks()) {
    if (drink.id == id) {
      return drink;
    }
  }
}

export function renderAddRemoveDrinkButton(id, name, image) {
  if (getDrink(id)) {
    return `<button class="favourite removeFrom" data-id="${id}" data-name="${name}" data-image="${image}">Remove
        <svg class="icon-heart-selected">
            <use href="${icons}#heart"></use>
        </svg>
      </button>`;
  }

  return `<button class="favourite addTo" data-id="${id}" data-name="${name}" data-image="${image}">Add to
      <svg class="icon-heart">
        <use href="${icons}#heart"></use>
      </svg>
      </button>`;
}

export function getFavouriteIngredients() {
  return JSON.parse(localStorage.getItem('favorite-ingredient')) ?? [];
}

function setFavouriteIngredients(favourites) {
  localStorage.setItem('favorite-ingredient', JSON.stringify(favourites));
}

export function addIngredient(name, type) {
  if (!getIngredient(name)) {
    let favouriteIngredient = { name: name, type: type };
    let favourites = getFavouriteIngredients();
    favourites.push(favouriteIngredient);
    setFavouriteIngredients(favourites);
  }
}

export function removeIngredient(name, type) {
  let favourites = getFavouriteIngredients();
  let updatedFavourites = [];
  for (let i = 0; i < favourites.length; i++) {
    let ingredient = favourites[i];
    if (ingredient.name != name && ingredient.type != type) {
      updatedFavourites.push(ingredient);
    }
  }
  setFavouriteIngredients(updatedFavourites);
}

export function getIngredient(name) {
  for (let ingredient of getFavouriteIngredients()) {
    if (ingredient.name == name) {
      return ingredient;
    }
  }
}

export function renderAddRemoveIngredientButton(name, type) {
  if (getIngredient(name)) {
    return `<button class="favourite removeFrom" data-name="${name}" data-type="${type}">Remove
        <svg class="icon-heart-selected">
            <use href="${icons}#heart"></use>
        </svg>
      </button>`;
  }

  return `<button class="favourite addTo" data-name="${name}" data-type="${type}">Add to
      <svg class="icon-heart">
        <use href="${icons}#heart"></use>
      </svg>
      </button>`;
}

export function refreshFavouriteButtons(id) {
    let favouriteButton = document.querySelector(`.favourite[data-id="${id}"]`);
    let favourite = getDrink(id);

    if (favourite && favouriteButton.classList.contains("addTo") || (!favourite && favouriteButton.classList.contains("removeFrom"))) {
        let e = { target: favouriteButton };
        favouritesClickEvent(e);
    }
}

export function favouritesClickEvent(event) {
  let button = event.target;

  if (!button || !button.className || typeof button.className != 'string')
    return;

  if (button.dataset.type) {
    if (button.className && button.className.indexOf('addTo') > 0) {
      addIngredient(button.dataset.name, button.dataset.type);
    } else {
      removeIngredient(button.dataset.name, button.dataset.type);
    }
    button.insertAdjacentHTML(
      'beforebegin',
      renderAddRemoveIngredientButton(button.dataset.name, button.dataset.type)
    );
  } else {
    if (button.className && button.className.indexOf('addTo') > 0) {
      addDrink(button.dataset.id, button.dataset.name, button.dataset.image);
    } else {
      removeDrink(button.dataset.id);
    }
    button.insertAdjacentHTML(
      'beforebegin',
      renderAddRemoveDrinkButton(
        button.dataset.id,
        button.dataset.name,
        button.dataset.image
      )
    );
  }

  button.remove();
  attachFavouriteClickEvents();
}

export function attachFavouriteClickEvents() {
  let buttons = document.querySelectorAll('.favourite');
  for (let button of buttons) {
    button.onclick = favouritesClickEvent;
  }
}
