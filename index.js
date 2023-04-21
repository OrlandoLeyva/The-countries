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
console.log(countryInfo.innerText = 'country info here');
selectMode.addEventListener('click', changeMode)
filterInput.addEventListener('change', filterByRegion)
searchIcon.addEventListener('click', searchCountry)

function changeMode(e){
    console.log('changing mode')
    const currentMode = selectMode.getAttribute('data-mode').toLocaleLowerCase()
    if (currentMode == 'dark'){
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

    } else if (currentMode == 'light'){
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
    console.log('rendering countries ')
    let countryItems = '';
    countriesToRender.forEach( country => {
        countryItems += `
            <div class="country-item flex bg-dark" data-country='${country.name}'>
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
    document.querySelectorAll('.country-item').forEach(countryItem => countryItem.addEventListener('click', (e)=>{
        e.stopPropagation()
        // The currentTarget property refers to the element to which the event listener was attached, which in your case is the father container.
        renderCountryInfo(e.currentTarget.getAttribute('data-country'), countriesToRender)
    }))
}

function filterByRegion(){
    console.log(filterInput.value);
    const filteredCountries = data.filter( country => country.region == filterInput.value)
    renderCountries(filteredCountries)
}

function searchCountry(){
    console.log(searchInput.value.trim().toLocaleLowerCase());
    const foundCountry = data.find(country => country.name.toLocaleLowerCase() == searchInput.value.trim().toLocaleLowerCase())
    if (foundCountry) renderCountries([foundCountry])
    else anyResultFount()
}

function anyResultFount() {
    countriesSection.innerHTML = '<h3 class="not-found">Not Results Found</h3>'
}


function renderCountryInfo(countryName, beforeState){
    const country = data.find(country => country.name == countryName)
    countryInfo.innerHTML = `
    
        <button id='back' class="back flex bg-dark">
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

                    ${country.borders.map(border => {
                        const borderCountry = data.find(country => country.alpha3Code == border)
                        return `<button class='country-btn bg-dark'>${borderCountry.name}</button>`
                    }).join('')}
                </div>
            </div>
        </div>
    
   `
   searchCountryForm.classList.add('hidden')
   countriesSection.classList.add('hidden')

   document.getElementById('back').addEventListener('click', ()=>{
    searchCountryForm.classList.remove('hidden')
    countriesSection.classList.remove('hidden')
    countryInfo.innerHTML = ''
    renderCountries(beforeState)
   })


}

renderCountries(data.slice(0, 20))