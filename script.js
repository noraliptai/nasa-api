//const todayUrl = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
//const yesterdayUrl = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2023-12-04"

const api_key = "OojOOr2igq1E24EJMmISesTbq8pyc1baO5vY9QJE"

const todaysDate = new Date().toJSON().slice(0, 10)

const dateUrl = (date) => {
    return `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${date}`
}

const fetchUrl = async (url) => {
    const response = await fetch(url)
    return response.json()
}

console.log(fetchUrl(dateUrl(todaysDate)))
console.log(fetchUrl(dateUrl("2023-12-04")))

const apodComponent = ({title, date, url, explanation}) => `
        <h2>${date}</h2>
        <h3>${title}</h3>
        ${url.includes("embed") ? `<iframe src=${url}></iframe>` : `<img src=${url} />`}
        <p>${explanation}</p>
`

const inputComponent = () => `
    <input id="inputDate" type="date" value=${todaysDate} />
`

const buttonComponent = (id, name) => `
    <button id=${id}>${name}</button>
`

const makeDomSkeleton = () => {
    const rootElement = document.getElementById("root")
    
    rootElement.insertAdjacentHTML("beforeend", `<div id="header"></div>`)
    const headerDiv = document.getElementById("header")
    
    headerDiv.insertAdjacentHTML("beforeend", buttonComponent("prev", "Previous day"))
    headerDiv.insertAdjacentHTML("beforeend", inputComponent())
    headerDiv.insertAdjacentHTML("beforeend", buttonComponent("next", "Next day"))
    
    rootElement.insertAdjacentHTML("beforeend", `<div id="apodContainer"></div>`)
}

const dateChangeEvent = async (inputElement, apodContainer, nextButton) => {
    const inputDate = await fetchUrl(dateUrl(inputElement.value))
        apodContainer.innerHTML = apodComponent(inputDate)
        inputElement.value === todaysDate ? nextButton.disabled = true : nextButton.disabled = false
}

const buttonEvent = async (button, inputElement, apodContainer, nextButton) => {
    const inputDateObject = new Date(inputElement.value)
    button === "prev" ? inputDateObject.setDate(inputDateObject.getDate() - 1) : inputDateObject.setDate(inputDateObject.getDate() + 1)
    inputElement.value = inputDateObject.toJSON().slice(0, 10)
    
    const inputDate = await fetchUrl(dateUrl(inputElement.value))
    apodContainer.innerHTML = apodComponent(inputDate)
    inputElement.value === todaysDate ? nextButton.disabled = true : nextButton.disabled = false
}

async function init() {
    const todayDate = await fetchUrl(dateUrl(todaysDate))
    
    makeDomSkeleton()
    
    const apodContainer = document.getElementById("apodContainer")
    apodContainer.insertAdjacentHTML("beforeend", apodComponent(todayDate))

    const inputElement = document.getElementById("inputDate")
    inputElement.addEventListener("input", () => dateChangeEvent(inputElement, apodContainer, nextButton))

    const prevButton = document.getElementById("prev")
    const nextButton = document.getElementById("next")
    nextButton.disabled = true

    prevButton.addEventListener("click", () => buttonEvent("prev", inputElement, apodContainer, nextButton))
    nextButton.addEventListener("click", () => buttonEvent("next", inputElement, apodContainer, nextButton))
}

init()