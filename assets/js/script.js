let city="";
let citySearch = $("#search-city");
let btnSearch = $("#search-button");
let btnClear = $("#clear-history");
let cities=[];
let foreCasts = document.querySelector("#foreCasts")
let currentWeather = document.querySelector("#current-weather")
//API key
const APIkey = "78b9ad515dca05a6cf7e5d876a98f14b";



// Search city to check if it exists from storage
find = (city) => {
    for (var i=0; i<cities.length; i++) {
        if(city.toUpperCase()===cities[i]){
            return false;
        }
    }
    return true;
}



// Display current weather and future weather 
showWeather = (event) => {
    event.preventDefault();
    if(citySearch.val().trim()!==""){
        city=citySearch.val().trim();
        weatherCurrent(city);
    }
}

// Fetch the API
weatherCurrent = (city) => {

    const queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIkey+"&units=imperial";
    fetch(queryURL).then(function(response){
        return response.json();}).then(data => { 
        console.log(data);
        currentWeather.innerHTML = "";
        //Call icon from data
        const weathericon= data.weather[0].icon;
        const iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        
        //Format the date
        const date=new Date(data.dt*1000).toLocaleDateString();
        const cTemp = data.main.temp
        const cHumidity = data.main.humidity
        const cWspeed = data.wind.speed
        const cCityName = data.name
       
        // Display UVIndex.
        UVIndex(data.coord.lon,data.coord.lat);
        forecast(data.id);
        
        const currentCityContainer = document.createElement("div")
        currentCityContainer.classList.add("col-sm-12", "#current-weather")
        
        const cityName = document.createElement("h2")
            cityName.textContent = cCityName

        const currentDateElement = document.createElement("p")
            currentDateElement.textContent = date
        const currentIconElement = document.createElement("img")
            currentIconElement.src = iconurl
        const currentTempElement = document.createElement("p")
            currentTempElement.innerHTML = "Temp: " + cTemp + "F"
        const currentHumidityElement = document.createElement("p")
            currentHumidityElement.innerHTML = "Humidity: " + cHumidity + "%"
        const currentWsElement = document.createElement("p")
            currentWsElement.innerHTML = "Windspeed: " + cWspeed + "mph"


        currentCityContainer.appendChild(cityName);
        currentCityContainer.appendChild(currentDateElement);
        currentCityContainer.appendChild(currentIconElement);
        currentCityContainer.appendChild(currentTempElement);
        currentCityContainer.appendChild(currentHumidityElement);
        currentCityContainer.appendChild(currentWsElement);

        currentWeather.appendChild(currentCityContainer)



        if(data.cod==200){
            cities=JSON.parse(localStorage.getItem("cityname"));
            console.log(cities);
            if (cities==null){
                cities=[];
                cities.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(cities));
                addToList(city);
            }
            else {
                if(find(city)){
                    cities.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(cities));
                    addToList(city);
                }
            }
        }

    });

}

//Fetch UVindex data
UVIndex = (ln,lt) => {
    const uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIkey+"&lat="+lt+"&lon="+ln;
    fetch(uvqURL).then(function(response){
        return response.json();}).then(data => {
            
            const currentCityContainer = document.createElement("div")
            currentCityContainer.classList.add("col-sm-12", "#current-weather")
            const currentUvElement = document.createElement("p")
            currentUvElement.innerHTML = "UV Index : " + data.value
            currentWeather.appendChild(currentUvElement)

            if (data.value < 6) {
                currentUvElement.classList = "bg-success"
            } else if (data.value < 8) {
                currentUvElement.classList = "bg-warning"
            } else {
                currentUvElement.classList = "bg-danger"
            }



        })
}
        
// Dynamically create 5 day forecast cards in HTML
forecast = (cityid) => {
    foreCasts.innerHTML = "";
    const queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIkey+"&units=imperial";
    fetch(queryforcastURL).then(function(response){
        return response.json();}).then(data => {
            console.log(data)
            for (i=0;i<40;i+=8){
                console.log(data.list[i])
            const date= new Date((data.list[i].dt)*1000).toLocaleDateString();
            const iconcode= data.list[i].weather[0].icon;
            const iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            const temp= data.list[i].main.temp;
            const humidity= data.list[i].main.humidity;
            const windSpeed = data.list[i].wind.speed.toFixed(0);
            
            //Parent div with class
            const parentContainer = document.createElement("div");
            parentContainer.classList.add("col-sm-2", "bg-primary", "forecast", "text-white", "ml-2", "mb-3", "p-2", "mt-2", "rounded")
            //Date, Icon, Temp, Humidity, Windspeed in card form
            const dateElement = document.createElement("p");
                dateElement.textContent = date
            const iconElement = document.createElement("img");
                iconElement.src = iconurl     
            const tempElement = document.createElement("p");
                tempElement.innerHTML = "Temp: " + temp + "°F";         
            const humidityElement = document.createElement("p");
                humidityElement.innerHTML = "Humidity: " + humidity + "%"
            const windElement = document.createElement("p");
                windElement.innerHTML = "Windspeed: " + windSpeed + "mph"
            
            //Append to parent container
            parentContainer.appendChild(dateElement);
            parentContainer.appendChild(iconElement);
            parentContainer.appendChild(tempElement);
            parentContainer.appendChild(humidityElement);
            parentContainer.appendChild(windElement);
            console.log(parentContainer)
            
            //Append parent container to forecast
            
            foreCasts.appendChild(parentContainer)


        }    
    })
}
    
//Dynamically add searched city to history
addToList = (city) => {
    const listEl= $("<li>"+city.toUpperCase()+"</li>");
    $(listEl).attr("class","recentSearch-item");
    $(listEl).attr("data-value",city.toUpperCase());
    $(".recentSearch").append(listEl);
}
    
//Reselect and display city from history when clicked
invokePastSearch = (event) => {
    const liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        weatherCurrent(city);
    }
}
    
// render function
loadlastCity = () => {
    $("ul").empty();
    var cities = JSON.parse(localStorage.getItem("cityname"));
    if(cities!==null){
        cities=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<cities.length;i++){
            addToList(cities[i]);
        }
        city=cities[i-1];
        weatherCurrent(city);
    }
}
    
//Clear history function
clearHistory = (event) => {
    event.preventDefault();
    cities=[];
    localStorage.removeItem("cityname");
    document.location.reload();
}
    
//Click Handlers
$("#search-button").on("click",showWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);