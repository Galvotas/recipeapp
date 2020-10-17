const apiKey = `727c3737f944d6ab5ec47f0cb6470b2a`
const id = `5bd1ce99`

const favCon = document.querySelector('.favouriteMeals')

fetchFavMeals()


async function getRecipeByLabel(label) {
    const response = await fetch(`https://api.edamam.com/search?q=${label}&app_id=${id}&app_key=${apiKey}&from=0&to=1`)
const data = await response.json();
}


    
    function getMealLS() {
    const meals = JSON.parse(localStorage.getItem('meals'));
    return meals === null ? [] : meals;
    }
   
    async function fetchFavMeals() {
        const mealsByLabel = getMealLS();
        for(let i = 0; i < mealsByLabel.length; i++) {
    const mealByLabel = mealsByLabel[i];
     const meal = await getRecipeByLabel(mealByLabel)
     addMealToFav(meal)
        }
    }

    async function addMealToFav(data) {
        const mealEl = document.createElement('div')
        mealEl.classList.add('favMeal')
     mealEl.innerHTML = `
     <div class="closeDiv"><i class="fas fa-times"></i></div>
     <div class="favMealImg">
     <img src="${data.image}" width="100%"
      height="150px" alt="">
    </div>
    <div class="meal-info">
     <h6 class="mealName">${data.label}</h6>
    </div>
     `
     favCon.appendChild(mealEl)
     mealEl.addEventListener('click', () => {

     })
    }