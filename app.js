const results = document.querySelector('.cards')
const searchIcon = document.querySelector('#searchIcon')
const searchInput = document.querySelector('#searchInput')
const bottomIcons = document.querySelectorAll('.bottom a i')
const popup = document.querySelector('.popup-container')
const closeBtn = document.querySelector('.close-div')
const nutriWrapper = document.querySelector('.nutri-wrapper')
const ingWrapper = document.querySelector('.ing-wrapper')
const mealImg = document.querySelector('.meal-img')
const homeBtn = document.querySelector('#homeBtn')
const sortBtn = document.querySelector('.sortBtn')
const sortChoicesContainer = document.querySelector('.sortChoices')
const sortByCalories = document.querySelector('.byCalories')
const sortByIng = document.querySelector('.byIngredients')
const sortBtnContainer = document.querySelector('.sort-div')

let searchValue = searchInput.value
sortBtn.addEventListener('click', () => {
    sortChoicesContainer.classList.toggle('active')
})
//close popup Btn
closeBtn.addEventListener('click', e => {
    if(e.target || e.target.parentElement.classList.contains('close-div')) {
        nutriWrapper.innerHTML = "";
        ingWrapper.innerHTML = ""
popup.classList.remove('active')
document.body.classList.remove('active')
    }
})
homeBtn.addEventListener('click', () => {
location.reload()
})
//
bottomIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        bottomIcons.forEach(icon => {
            icon.classList.remove('activeThumb')
        })
        icon.classList.add('activeThumb')
    })
})

// getting random recipes
const apiKey = `9973533` 

async function getRecipeCategories() { 
    const res = await fetch(`https://www.themealdb.com/api/json/v2/${apiKey}/categories.php`)
    const data = await res.json()
    const finalData = data.categories
finalData.forEach(category => {
    displayCategories(category)
})
}
getRecipeCategories()

async function getRecipesByCategory(categoryName) {
    results.innerHTML = ""
    const res = await fetch(`https://www.themealdb.com/api/json/v2/${apiKey}/filter.php?c=${categoryName}`)
    const data = await res.json()
data.meals.forEach(meal => {
    displayRecipes(meal)
})
}
async function getRecipeById(id) {
const res = await fetch(`https://www.themealdb.com/api/json/v2/${apiKey}/lookup.php?i=${id}
`)
const data = await res.json()
return data;

}
async function searchMealByName(searchTerm) {
    const res = await fetch(`https://www.themealdb.com/api/json/v2/${apiKey}/search.php?s=${searchTerm}
    `)
    const data = await res.json()
data.meals.forEach(meal => {
    displayRecipes(meal)
})
}


function displayCategories(categoryData) {
const categoryCard = document.createElement('div')
categoryCard.classList.add('card')
categoryCard.innerHTML = `
<div class="card-image">
<img src="${categoryData.strCategoryThumb}" alt="" />
</div>
<div class="card-bottom">
<p class="mealType">${categoryData.strCategory}</p>
</div>
`
results.appendChild(categoryCard)

categoryCard.addEventListener('click', () => {
    const catName = categoryData.strCategory
getRecipesByCategory(catName)
})
}


function displayRecipes(data) {
    const card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `
    <div class="card-image">
    <img src="${data.strMealThumb}" alt="Couldn't Load Image" />
  </div>
  <div class="card-bottom">
              <p class="mealType">${data.strMeal}</p>
              <i class="fas fa-heart"></i>
            </div>
            `
            const favBtn = card.querySelector('.card-bottom .fa-heart')
            favBtn.addEventListener('click', () => {
                if(!favBtn.classList.contains('active')) {
                    favBtn.classList.add('active')
                    addMealLS(data.idMeal)
                } else {
                    favBtn.classList.remove('active')
                    removeMealLS(data.idMeal)
                }
            })
            
card.addEventListener('click', (e) => {
    if(!e.target.classList.contains('fa-heart')) {
     showMealInfo(data)
    } 
})
results.appendChild(card)
}
function addMealLS(meal) {
    const meals = getMealLS()
    localStorage.setItem('meals', JSON.stringify([...meals, meal]))
    }
    
    function getMealLS() {
    const meals = JSON.parse(localStorage.getItem('meals'));
    return meals === null ? [] : meals;
    }
    function removeMealLS(meal) {
    const meals = getMealLS()
    localStorage.setItem('meals', JSON.stringify(meals.filter((id) => id !== meal)))
    }





 async function showMealInfo(data) {
    const mealId = data.idMeal;
const meal = await getRecipeById(mealId)
const mealInfo = meal.meals[0]
    popup.classList.add('active')
    document.body.classList.add('active')
    mealImg.src = mealInfo.strMealThumb;
    const label = document.querySelector('.label')
    label.innerHTML = mealInfo.strMeal
    //get ingredients
    const ingredients = []
     for(let i = 1; i < 20; i++) {
         if(mealInfo['strIngredient'+i]) {
             ingredients.push(`${mealInfo['strIngredient' +i]} / ${mealInfo['strMeasure'+i]}`)
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
<p>${mealInfo.strInstructions}</p>
`
}

searchIcon.addEventListener('click', () => {
searchValue = searchInput.value;
if(searchValue === "") {
showErr()
}
else {
    results.innerHTML = ""
searchMealByName(searchValue)
    }
    })
function showErr() {
const searchEl = document.querySelector('.search')
const wrapper = searchEl.parentElement
const message = document.createElement('blockquote');
message.style.color = '#FD0E35'
message.innerHTML = 'Enter meal type, name or random food'
wrapper.insertBefore(message, searchEl)
setTimeout(() => {
    message.style.display = 'none'
}, 2000)
}

// infinite scroll
/*window.addEventListener('scroll', () => {
    const {clientHeight, scrollTop, scrollHeight} = document.documentElement;
  
    if(clientHeight + scrollTop >= scrollHeight - 100) {
        showMoreBtn.classList.add('activeBtn')
    } else {
        showMoreBtn.classList.remove('activeBtn')
    }
})*/

//preventing fetch function execute more than once in a range of delay

function sortBy(recipes) {
    sortByCalories.addEventListener('click', () => {
        sortChoicesContainer.classList.remove('active')
        results.innerHTML = ""
    const sorted = recipes.sort((a,b) => a.recipe.calories - b.recipe.calories)
sorted.forEach(item => {
    displayRecipes(item)
})
    })
    sortByIng.addEventListener('click', () => {
        sortChoicesContainer.classList.remove('active')
        results.innerHTML = ""
    const sorted = recipes.sort((a,b) => a.recipe.ingredients.length - b.recipe.ingredients.length)
sorted.forEach(item => {
    displayRecipes(item)
})
    })
}

