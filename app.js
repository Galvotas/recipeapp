const cardsDefault = document.querySelectorAll('.default')
const results = document.querySelector('.cards')
const searchIcon = document.querySelector('#searchIcon')
const searchInput = document.querySelector('#searchInput')
const bottomIcons = document.querySelectorAll('.bottom a i')
const popup = document.querySelector('.popup-container')
const closeBtn = document.querySelector('.close-div')
const nutriWrapper = document.querySelector('.nutri-wrapper')
const ingWrapper = document.querySelector('.ing-wrapper')
const mealImg = document.querySelector('.meal-img')
const amountIngLine = document.querySelector('.amount-ing')
const showMoreBtn = document.querySelector('.showMoreBtn')
const homeBtn = document.querySelector('#homeBtn')
const sortBtn = document.querySelector('.sortBtn')
const sortChoicesContainer = document.querySelector('.sortChoices')
const sortByCalories = document.querySelector('.byCalories')
const sortByIng = document.querySelector('.byIngredients')
const sortBtnContainer = document.querySelector('.sort-div')
let amountCards = 0;
let plusAmountCards = 10;
let searchValue = searchInput.value
let allRecipes = []
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
cardsDefault.forEach(card => {
    card.addEventListener('click', e => {
      getParentforDefaultCard(e, 'dessert')
        getParentforDefaultCard(e, 'lunch')
        getParentforDefaultCard(e, 'dinner')
        getParentforDefaultCard(e, 'breakfast')
    })
})
function getParentforDefaultCard(e, value) {
    const parent = e.target.parentElement.parentElement;
    if(parent.classList.contains(`${value}`)) {
        searchValue = `${value}`;
        getRecipes(searchValue)
    }
}
// getting random recipes
const apiKey = `727c3737f944d6ab5ec47f0cb6470b2a`
const id = `5bd1ce99`
async function getRecipes(searchTerm) {  
const response = await fetch(`https://api.edamam.com/search?q=${searchTerm}&app_id=${id}&app_key=${apiKey}&from=${amountCards}&to=${plusAmountCards}`)
const data = await response.json()
const finalData = data.hits;
finalData.forEach(item => {
    displayRecipes(item)
})
cardsDefault.forEach(card => {
    card.style.display = 'none'
})
amountCards += 10;
plusAmountCards += 10;
Array.prototype.push.apply(allRecipes, finalData)
if(!sortBtnContainer.classList.contains('active')) {
    sortBtnContainer.classList.add('active')
}
sortBy(allRecipes)
}



function displayRecipes(data) {
    const card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `
    <div class="card-image">
    <img src="${data.recipe.image}" alt="Couldn't Load Image" />
  </div>
  <div class="card-bottom">
              <p class="mealType">${data.recipe.label}</p>
              <a href="#"><i class="fas fa-heart"></i></a>
            </div>
            `
card.addEventListener('click', () => {
showMealInfo(data)
})
results.appendChild(card)
}

function showMealInfo(data) {
    popup.classList.add('active')
    document.body.classList.add('active')
    mealImg.src = data.recipe.image;
    amountIngLine.innerHTML =`${data.recipe.ingredients.length} ingredients in this recipe`;
    const msg = document.querySelector('.prep-time')
    msg.textContent = `Preparation time: ${data.recipe.totalTime}min`
    const label = document.querySelector('.label')
    label.innerHTML = data.recipe.label
    const ings = data.recipe.ingredients
    const allNutrients = data.recipe.totalNutrients;
const nutrientsNeeded = [allNutrients.ENERC_KCAL, allNutrients.FAT, allNutrients.PROCNT, allNutrients.CHOCDF, allNutrients.SUGAR, allNutrients.MG, allNutrients.VITB6A, allNutrients.VITB12]
nutrientsNeeded.forEach(nutrient => {
    nutrientsNeeded.sort((a) => a.label)
    const ingEl = document.createElement('div')
        ingEl.classList.add('ing-content')
        ingEl.innerHTML = `
        <h5 class="ing-name">${nutrient.label}</h5>
        <h5 class="ing-amount">${nutrient.quantity.toFixed(2)}${nutrient.unit}</h5>
        `
        nutriWrapper.appendChild(ingEl)
})
    ings.forEach(ing => {
        const ingEl = document.createElement('div')
        ingEl.classList.add('ing-content')

            ingEl.innerHTML = `
            <h5 class="ing-name">${ing.text}</h5>
            `
            ingWrapper.appendChild(ingEl)
    })
}

searchIcon.addEventListener('click', () => {
searchValue = searchInput.value;
if(searchValue === "") {
showErr()
}
else {
    allRecipes = []
    results.innerHTML = ""
getRecipes(searchValue)
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
window.addEventListener('scroll', () => {
    const {clientHeight, scrollTop, scrollHeight} = document.documentElement;
  
    if(clientHeight + scrollTop >= scrollHeight - 100) {
        showMoreBtn.classList.add('activeBtn')
    } else {
        showMoreBtn.classList.remove('activeBtn')
    }
})
showMoreBtn.addEventListener('click', () => {
if(searchValue !== undefined) {
    getRecipes(searchValue)
}
})

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

