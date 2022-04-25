
// LEAFLET JS MAPPING
const map = L.map('map').setView([45.5152, -122.6784], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const marker = L.marker([45.5152, -122.6784]).addTo(map)


// FETCH DATA FROM IPIFY
const getIPData = async (query = '') => {

  // FETCH IP DATA
  const url = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_DQhSqa4uEqJdnl52jscR9RssODepB'
  const response = await fetch(url + query);
  // THROW ERROR
  if(response.status !== 200){
    throw new Error('Cannot fetch the data')
  }
  // RETURN DATA
  const data = await response.json()
  return data

}


// DISPLAY IP DATA
const updateDOM = data => {

  // DESTRUCTURE DATA
  const { ip, isp } = data
  const { city, region, postalCode, timezone, lat, lng } = data.location
  // UPDATE TEXT
  document.querySelector('#ip-address').textContent = ip
  document.querySelector('#ip-city').textContent = `${city}, ${region} ${postalCode}`
  document.querySelector('#ip-timezone').textContent = `UTC ${timezone}`
  document.querySelector('#ip-isp').textContent = isp
  // UPDATE MAP
  map.setView([lat, lng], 5)
  marker.setLatLng([lat, lng])

}

// SET TEXT TO 'LOADING' IN BETWEEN REQUESTS
const loading = () => {
  document.querySelector('#ip-address').textContent = 'Loading...'
  document.querySelector('#ip-city').textContent = 'Loading...'
  document.querySelector('#ip-timezone').textContent = 'Loading...'
  document.querySelector('#ip-isp').textContent = 'Loading...'
}

// FORM CONTROL
const form = document.querySelector('form')

form.addEventListener('submit', e => {

  // PREVENT DEFAULT BEHAVIOR AND RESET ANY STYLING CHANGES
  e.preventDefault()
  form.ip.classList.remove('error')
  form.ip.placeholder = "Search for any IP address or domain"
  // SEARCH IP & DISPLAY DATA
  let ip = `&ipAddress=${form.ip.value.trim()}`
  getIPData(ip)
    .then(data => updateDOM(data))
    .catch(err => handleError(err))
  loading()
  form.reset()

})

const handleError = (err) => {

  // DISPLAY ERROR MESSAGE
  form.ip.classList.add('error')
  form.ip.placeholder = 'Invalid input. Please try again...'
  // RESET DATA WITH DEFAULT
  getIPData()
    .then(data => updateDOM(data))

}

// SEARCH FOR USER IP AS DEFAULT
getIPData()
  .then(data => updateDOM(data))
  .catch(err => handleError(err))

// HANDLE MODAL
const modal = document.querySelector('.modal')
const closeBtn = document.querySelector('.close')
const infoBtn = document.querySelector('#info-btn')
const actionBtn = document.querySelector('#call-to-action')

closeBtn.addEventListener('click', () => {modal.classList.toggle('hidden')})
infoBtn.addEventListener('click', () => {modal.classList.toggle('hidden')})
actionBtn.addEventListener('click', () => {modal.classList.toggle('hidden')})