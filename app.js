// Interação
const citySearchInput = document.getElementById('city-search-input')
const citySearchButton = document.getElementById('city-search-button')

// Exibição
const currentDate = document.getElementById('current-date')
const cityName = document.getElementById('city-name')
const weatherIcon = document.getElementById('weather-icon')
const weatherDescription = document.getElementById('weather-description')
const currentTemperature = document.getElementById('current-temperature')
const windSpeed = document.getElementById('wind-speed')
const feelsLikeTemperature = document.getElementById('feels-like-temperature')
const currentHumidity = document.getElementById('current-humidity')
const sunriseTime = document.getElementById('sunrise-time')
const sunsetTime = document.getElementById('sunset-time')

// API key -> chave de acesso
const api_key = "dc535d901b1e17fc5a94eab1a3a80355";

// Adicionando uma escuta ao evento 'click' do meu botão e passando uma função anônima para capturar a cidade que o usuário pesquisou e jogar na nossa função
citySearchButton.addEventListener('click', () => {
    let cityName = citySearchInput.value
    getCityWeather(cityName)
})

// Buscando a localização atual do usuário
// A função getCurrentPosition vai me retornar a posição se tudo der certo, caso contrário ela vai me retornar um erro
navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude // Pegando o valor latitude e passando para a minha variável
    let lon = position.coords.longitude // Pegando o valor longitude e passando para a minha variável

    getCurrentLocationWeather(lat, lon); // Executando a função
},
    (err) => {
        if(err.code === 1) { // Estrutura condicional para exibição do meu alert somente em caso de negação da geolocalização
            alert('Geolocalização negada pelo usuário, busque manualmente por uma cidade através da barra de pesquisa.')
        } else {
            console.log(err)
        }
    })

// Função para buscar a temperatura com base na localização do usuário -> delegação para buscar os dados na API
function getCurrentLocationWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${api_key}`)
    .then((response) => response.json())
    .then((data) => displayWeather(data))
}

// https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${api_key} -> API Open Weather Map

// Função para buscar a temperatura com base na cidade que o usuário escolher -> acessando dados da API
function getCityWeather(cityName) {

    weatherIcon.src = `./assets/loading-icon.svg`; // Colocando o nosso ícone de pesquisa enquanto aguarda a resposta da API

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${api_key}`) // Buscando os dados da API
    .then((response) => response.json()) // Convertendo os dados da API para um arquivo JSON
    .then((data) => displayWeather(data)) // Executando uma nova função mandando essas informações que recebi
}

// Função para atualizar os dados com base na resposta obtida pela API
function displayWeather(data) {
    let {
        dt,
        name,
        weather: [{icon, description}],
        main: {temp, feels_like, humidity},
        wind: {speed},
        sys: {sunrise, sunset},
    } = data // Desestruturação de objeto -> separando apenas aquilo que eu vou utilizar

    // Atribuindo a resposta obtida pela API para as variáveis
    currentDate.textContent = formatDate(dt)
    cityName.textContent = name
    weatherIcon.src = `./assets/${icon}.svg`
    weatherDescription.textContent = description
    currentTemperature.textContent = `${Math.round(temp)}ºC` // Arredondando com Math.round
    windSpeed.textContent = `${Math.round(speed * 3.6)}km/h` // Convertendo para km
    feelsLikeTemperature.textContent = `${Math.round(feels_like)}ºC`
    currentHumidity.textContent = `${humidity}%`
    sunriseTime.textContent = formatTime(sunrise)
    sunsetTime.textContent = formatTime(sunset)

}

// Funções para a formatação dos dados
// Função para formatação da data
function formatDate(epochTime) {
    let date = new Date(epochTime * 1000) // Transformação
    let formattedDate = date.toLocaleDateString('pt-BR', { // Transformador de data -> Parâmetros: idioma, objeto e dentro dele vamos ter outras opções de formatação
        month: 'long', // Mês por escrito
        day: 'numeric', // Dia tipo numérico
    }) 
    return `Hoje, ${formattedDate}` // Retornando nossa data formatada
}

// Função para formatação do tempo
function formatTime(epochTime) {
    let date = new Date(epochTime * 1000) // Transformação
    let hours = date.getHours() // Pegando as horas
    let minutes = date.getMinutes() // Pegando os minutos
    return `${hours}:${minutes}` // Retornando as horas e minutos
}


