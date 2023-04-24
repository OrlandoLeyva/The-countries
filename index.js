//TODO: USE THE ALFA CODE RATHER THAN THE NAME TO IDENTIFY THE COUNTRIES
import {data} from './data.js'


const body = document.querySelector('body')
const main = document.querySelector('main')
const selectMode = document.getElementById('select-mode')
const modeIcon = document.getElementById('mode-icon')
const searchIcon = document.getElementById('search-icon')
const searchCountryForm = document.getElementById('search-country-form')
const countryInfo = document.getElementById('country-info')
const modeText = document.getElementById('mode-text')
const countriesSection = document.getElementById('countries')
const searchInput = document.getElementById('search-input')
const filterInput = document.getElementById('filter-input')

selectMode.addEventListener('click', changeMode)
filterInput.addEventListener('change', filterByRegion)
searchIcon.addEventListener('click', searchCountry)

let scrollPosition = window.scrollY
const selectedCountries = []

//*COUNTRIES NAVIGATION STATES
let lastCountriesSectionState = []
let firstCountry = null;
let currentCountry = null;
const visitedCountries = []

function getCurrentMode() {
    return selectMode.getAttribute('data-mode').toLocaleLowerCase()
}

function changeMode(e){
    if (getCurrentMode() == 'dark'){
        //* Change background colors
        const bgDarkElements = document.querySelectorAll('.bg-dark')
        bgDarkElements.forEach(element => element.classList.replace('bg-dark', 'bg-light'))
        //TODO: Find an more optimal way of doing this part
        selectMode.removeAttribute('data-mode')
        selectMode.setAttribute('data-mode', 'light')

        //* Change body 
        body.classList.replace('dark-body', 'light-body')

        searchCountryForm.setAttribute('data-mode', 'light')

        modeIcon.src = './assets/icons/moon-regular.svg'
        modeText.textContent = 'Dark mode'

        

    } else if (getCurrentMode() == 'light'){
        const bgLightElements = document.querySelectorAll('.bg-light')
        bgLightElements.forEach(element => element.classList.replace('bg-light', 'bg-dark'))
        //TODO: Find an more optimal way of doing this part
        selectMode.removeAttribute('data-mode')
        selectMode.setAttribute('data-mode', 'dark')

        //* Change body 
        body.classList.replace('light-body', 'dark-body')

        searchCountryForm.removeAttribute('data-mode')

        modeIcon.src = './assets/icons/sun-solid.svg'
        modeText.textContent = 'Light mode'
    }
}

function renderCountries(countriesToRender) {
    let countryItems = '';
    countriesToRender.forEach( country => {
        countryItems += `
            <div class="country-item flex ${getCurrentMode() == 'dark' ? 'bg-dark' : 'bg-light'}" data-country='${country.name}'>
                <img class="flag" src="${country.flags.png}" alt="${country.name}' flag">
                <div class="country-details">
                    <h2 class="country-text">${country.name}</h2>
                    <p> <span class="detail">Population</span>: ${ country.population}</p>
                    <p> <span class="detail">Region</span>: ${country.region}</p>
                    <p> <span class="detail">Capital</span>: ${country.capital}</p>
                </div>
            </div>
        `
    })
    countriesSection.innerHTML = countryItems
    window.scrollTo(0, scrollPosition);
    document.querySelectorAll('.country-item').forEach(countryItem => countryItem.addEventListener('click', (e)=>{
        e.stopPropagation()
        // The currentTarget property refers to the element to which the event listener was attached, which in your case is the father container.
        const renderCountryInfoOptions = {
            setScroll:true,
            firstCountry: true
        }
        lastCountriesSectionState = countriesToRender
        visitedCountries.push(findCountry(e.currentTarget.getAttribute('data-country')))
        renderCountryInfo(findCountry(e.currentTarget.getAttribute('data-country')), countriesToRender, renderCountryInfoOptions)
    }))
}

function filterByRegion(){
    const filteredCountries = data.filter( country => country.region == filterInput.value)
    renderCountries(filteredCountries)
}

function searchCountry(e){
    const foundCountry = data.find(country => country.name.toLocaleLowerCase() == searchInput.value.trim().toLocaleLowerCase())
    if (foundCountry) renderCountries([foundCountry])
    else anyResultFount()
}

function anyResultFount() {
    countriesSection.innerHTML = '<h3 class="not-found">Not Results Found</h3>'
}


function renderCountryInfo(country, beforeState, options={}){
    if (options.setScroll) setScrollPosition()

    //* + Initialize the current country.
    if (options.firstCountry) firstCountry = country
    currentCountry = country
    console.log(country);

    countryInfo.innerHTML = `
    
        <button id='back' class="back flex ${getCurrentMode() == 'dark' ? 'bg-dark' : 'bg-light'}">
            <img class="back-icon" src="./assets/icons/arrow-left-solid.svg" alt="go back button">
            Back
        </button>

        <div class="country flex sections-spacing">
            <img src="${country.flags.png}" alt="Mexico flag">
            <div class="country-details flex">
                <h2 class="country-text">${country.name}</h2>
                <div class="primary-details flex">
                    <div>
                        <p> <span class="detail">Native Name</span>: ${country.nativeName}</p>
                        <p> <span class="detail">Population</span>: ${country.population}</p>
                        <p> <span class="detail">Region</span>: ${country.region}</p>
                        <p> <span class="detail">Sub Region</span>: ${country.subregion}</p>
                        <p> <span class="detail">Capital</span>: ${country.capital}</p>
                    </div>

                    <div>
                        <p> <span class="detail">Top Level Domain</span>: ${country.topLevelDomain[0]}</p>
                        <p> <span class="detail">Currencies</span>: ${country.currencies[0].name}</p>
                        <p> <span class="detail">Languages</span>: ${country.languages[0].name}</p>
                    </div>
                </div>

                <div class="borders flex">
                    <p>Border Countries: </p>

                    ${getBordersButtons(country)}
                </div>
            </div>
        </div>
    
   `
   searchCountryForm.classList.add('hidden')
   countriesSection.classList.add('hidden')

   document.querySelectorAll('.country-btn').forEach(countryBtn => countryBtn.addEventListener('click', (e)=>{
        visitedCountries.push(findCountry(e.target.getAttribute('data-country')))
        renderCountryInfo(findCountry(e.target.getAttribute('data-country')), beforeState)
   }))

   document.getElementById('back').addEventListener('click', ()=>{
    
    goBack()
    // renderCountries(beforeState)
   })


}

function getBordersButtons(country){
    if (country.borders) {
        return country.borders.map(border => {
            const borderCountry = data.find(country => country.alpha3Code == border)
            return `<button class='country-btn ${getCurrentMode() == 'dark' ? 'bg-dark' : 'bg-light'}' data-country='${borderCountry.name}'>${borderCountry.name}</button>`
        }).join('')
    }
    
    return `${country.name} does not have border countries`
}

function setScrollPosition(){
    scrollPosition = window.scrollY
    // return scrollPosition
}

function goBack() {
    // Remove the current country from visited countries
    visitedCountries.pop()
    if (visitedCountries.length === 0) {
        searchCountryForm.classList.remove('hidden')
        countriesSection.classList.remove('hidden')
        countryInfo.innerHTML = ''
        renderCountries(lastCountriesSectionState)
    } else {
        console.log(visitedCountries);
        console.log(findCountry(visitedCountries[visitedCountries.length - 1].name));
        renderCountryInfo(findCountry(visitedCountries[visitedCountries.length - 1].name))
    }

}

function findCountry(countryName, validate=false){
    if (validate) console.log(countryName);
    return data.find(country => country.name == countryName)
}

renderCountries(data.slice(0, 20))