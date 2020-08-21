'use strict'
let lockInitialAPI = false, 
	initial = true,
	cityObj ={};

function getJson (type, city) {
	return new Promise ((resolve, reject)=> {
		let requestQuery;
		let cacheData = checkCache(city, type);
		if (cacheData != false) {
			let json = JSON.parse(cacheData);
			resolve(json);
		}else {
			if (type == 0) {
				requestQuery = `request.php?city=${city}&type=0`;
			}else {
				requestQuery = `request.php?city=${city}&type=1`;
			}
			try {
				fetch(requestQuery, {
					method: 'get', 
				}).then(data=>data.text())
				.then((response) => {
					if (response == "1") {
						openCloseError("The API server is down <br> Please try again later.");
					}else if (response == "2"){
						openCloseError("You're too fast, slow down!");
					}else {
						response = JSON.parse(response);
						//return data in JSON form
						if (response["cod"] == "401") {
							openCloseError("Invalid operation");
						}else if (response["cod"] == "404") {
							openCloseError("Invalid City Name");
						}else {
							saveCache (city, type, JSON.stringify(response));
							resolve(response);
						}
					}
				})
			}catch (err){
				reject("unexpected error occured!!!")
				console.log(err);
			}
		}
	});	
}

const temperatureCont = document.getElementById("temperature"),
	weatherCont = document.getElementById("weather"),
	locationCont = document.getElementById("location"),
	feelsLikeCont = document.getElementById("feels_like"),
	maxTempCont = document.getElementById("maxTemperature"),
	minTempCont = document.getElementById("minTemperature"),
	pressureCont = document.getElementById("pressure"),
	humidityCont = document.getElementById("humidity"),
	cloudinessCont = document.getElementById("cloudiness"),
	visibilityCont = document.getElementById("visibility"),
	mainWeatherIcon = document.getElementById("weatherIcon"),
	footer = document.getElementsByTagName("footer")[0];

//used when the secondary search field is used
function getNewData () {
	lockInitialAPI = false;
	document.getElementById("mainSearchBox").value = "";
	triggerData();
	insertValue ("");
	if (navOpen) openCloseNav();
}

function triggerData () {
	invalidCity = false;
	let city = document.getElementById("mainSearchBox").value;
	setTimeout(()=> {
		document.getElementById("mainSearchBox").value = "";
	}, 2000);
	if (city == "" || city == null) {
		city = document.getElementById("secondarySearch").value;
		document.getElementById("secondarySearch").value = "";
	}else {
		document.getElementById("secondarySearch").value = "";
	}
	if (!lockInitialAPI) {
		if (city == "") {
			openCloseError("The city name is empty");
		}else {
			let delays = 0;
			
			if (delays = getCookieValue("delayCount")) {
				delays = 500 *(Number.parseInt(delays) / 2);
			}
			setTimeout(() => {
				getJson(0, city).then ((message) => {
					setupData(message);
					getForecastData(city);
					lockInitialAPI = true;
				}).catch ((err)=>{
					invalidCity = true;
				})
			}, delays);
		}
	}
}

//stting up the data into their appropriate location
function setupData (data) {
	
	document.getElementsByTagName("body")[0].style.paddingTop = "60px";
	let city = data["name"],
		country = data["sys"]["country"],
		weather = data["weather"][0]["description"],
		temp = data["main"]["temp"] - 273.15,
		maxTemp = data["main"]["temp_max"] - 273.15,
		minTemp = data["main"]["temp_min"] - 273.15,
		id = data["weather"][0]["id"],
		humidity = data["main"]["humidity"], 
		pressure = data["main"]["pressure"],
		feelsLike = data["main"]["feels_like"] - 273.15,
		visibility = data["visibility"] / 1000,
		clouds = data["clouds"]["all"],
		unix = data["dt"];

	let iconUrl, dayOrNight, currHour, time, iconName;
	if (window.innerWidth < 800) {
		let navShadow = document.getElementById("navContainer");
		navShadow.style.boxShadow = `0px 1px 10px rgba(128, 128, 128 , 0)`;
	}
	if (mainPage.style.display != "none") {
		refreshPage();
	}else {
		refreshSearch();
	}

	
	if (!initial) {
		time = 800;
	}else {
		time = 100;
		initial = false;
	}
	setTimeout(() => {
		currHour = getHour(unix)
		dayOrNight = getDayType(currHour);
		iconName = getIconsName(id, dayOrNight);
		iconUrl = `icons/${iconName}.png`;
		
		temp = temp.toFixed(1);
		maxTemp = maxTemp.toFixed(1);
		minTemp = minTemp.toFixed(1);
		feelsLike = feelsLike.toFixed(1);
		visibility = visibility.toFixed(2);

		temperatureCont.innerHTML = `${temp} &#8451;`;
		weatherCont.innerHTML = weather;
		mainWeatherIcon.src=iconUrl;
		locationCont.innerHTML = city + ", " + country;

		feelsLikeCont.innerHTML = `${feelsLike} &#8451;`;
		maxTempCont.innerHTML = `${maxTemp} &#8451;`;
		minTempCont.innerHTML = `${minTemp} &#8451;`;
		pressureCont.innerHTML = `${pressure} hpa`;
		humidityCont.innerHTML = `${humidity} %`;
		cloudinessCont.innerHTML = `${clouds} %`;
		visibilityCont.innerHTML = `${visibility} km`;
		footer.style.position = "relative";

		document.getElementsByTagName("body")[0].style.height = "100%";
	}, time);
}

const mainPage = document.getElementById("mainPage"),
	weatherDetails = document.getElementById("weatherDisplay");

//animating the page translation from main page to the Weather details page
function refreshPage () {
	mainPage.classList.remove("fade-in-left");
	mainPage.classList.add("fade-out");
	setTimeout(()=>{
		mainPage.style.display = "none";
	}, 1000);
	weatherDetails.style.display = "block";
	weatherDetails.classList.add("fade-in-left");
}

//page refresh function when search is performed 
function refreshSearch() {
	weatherDetails.classList.remove("fade-in-left");
	weatherDetails.classList.add("fade-out");
	setTimeout(() => {
		weatherDetails.classList.remove("fade-out");
		weatherDetails.classList.add("fade-in-left");
		weatherDetails.style.display = "block";	
	}, 1000);
}