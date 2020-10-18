
const favCon = document.querySelector('.favouriteMeals')
const mealImg = document.querySelector('.meal-img')
const popup = document.querySelector('.popup-container')
const nutriWrapper = document.querySelector('.nutri-wrapper')
const ingWrapper = document.querySelector('.ing-wrapper')


async function getRecipeById(id) {
    const apiKey = `9973533` 
    const res = await fetch(`https://www.themealdb.com/api/json/v2/${apiKey}/lookup.php?i=${id}`)
    const data = await res.json()
    return data.meals

    }
    fetchFavMeals()


    function getMealLS() {
    const meals = JSON.parse(localStorage.getItem('meals'));
    return meals === null ? [] : meals;
    }
    function removeMealLS(meal) {
        const meals = getMealLS()
        localStorage.setItem('meals', JSON.stringify(meals.filter((id) => id !== meal)))
        }
   
    async function fetchFavMeals() {
        const mealsById = getMealLS();
        const sortedMeals = mealsById.filter((a,b) => mealsById.indexOf(a) === b)
        for(let i = 0; i < mealsById.length; i++) {
    const mealId = sortedMeals[i];
     const meal = await getRecipeById(mealId)
     addMealToFav(meal[0])
        }
    }

    async function addMealToFav(data) {
        const mealEl = document.createElement('div')
        mealEl.classList.add('favMeal')
     mealEl.innerHTML = `
     <div class="closeDiv"><i class="fas fa-times"></i></div>
     <div class="favMealImg">
     <img src="${data.strMealThumb}" width="100%"
      height="150px" alt="">
    </div>
    <div class="meal-info">
     <h6 class="mealName">${data.strMeal}</h6>
    </div>
     `
     favCon.appendChild(mealEl)
     mealEl.addEventListener('click', (e) => {
if(e.target.classList.contains('fa-times')) {
    const getMealId = data.idMeal
    e.target.parentElement.parentElement.style.display = 'none'
    removeMealLS(getMealId)
} else if(!e.target.classList.contains('fa-times')) {
    showMealInfo(data.idMeal)
}
     })
    }
    this.addEventListener('click', e =>  console.log(e.target))


    async function showMealInfo(data) {
        const mealId = data;
    const meal = await getRecipeById(mealId)
        popup.classList.add('active')
        document.body.classList.add('active')
        mealImg.src = meal[0].strMealThumb;
        const label = document.querySelector('.label')
        label.innerHTML = meal[0].strMeal
        //get ingredients
        const ingredients = []
         for(let i = 1; i < 20; i++) {
             if(meal[0]['strIngredient'+i]) {
                 ingredients.push(`${meal[0]['strIngredient' +i]} / ${meal[0]['strMeasure'+i]}`)
             } else {
                 break;
             }
        }
        let output = ''
        ingredients.forEach(ing => {
            output += `
            <li>${ing}</li>
            `
        })
        const list = document.createElement('ul')
       list.innerHTML = output
       ingWrapper.appendChild(list)
    nutriWrapper.innerHTML = `
    <p>${meal[0].strInstructions}</p>
    `
    }
    const closeBtn = document.querySelector('.close-div')
    closeBtn.addEventListener('click', e => {
        if(e.target || e.target.parentElement.classList.contains('close-div')) {
            nutriWrapper.innerHTML = "";
            ingWrapper.innerHTML = ""
    popup.classList.remove('active')
    document.body.classList.remove('active')
        }
    })