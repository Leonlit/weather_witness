'use strict'
var time = 100, cityObj ={};
var mainSearchBox = document.getElementById("mainSearchBox"),
	secondarySearchBox = document.getElementById("secondarySearch");

mainSearchBox.addEventListener("keyup", isEnterMain);
secondarySearchBox.addEventListener("keyup", isEnterSecondary);

//get json data
function getJson (type, city) {
	return new Promise ((resolve, reject)=> {
		let requestQuery;
		const cacheData = checkCache(city, type);
		if (cacheData != false) {
			resolve(JSON.parse(cacheData));
		}else {
			if (type == 0) {
				requestQuery = `request.php?city=${city}&type=0`;
			}else {
				requestQuery = `request.php?city=${city}&type=1`;
			}
			try {
				fetch(requestQuery, {
					method: 'get', 
				})
				.then(data=>data.text())
				.then((response) => {
					resolve(parseResponse(city, type, response));
				}).catch(err=>{
					reject("unable to request data from server!!!");
					console.log(err);
				});
			}catch (err){
				reject("unexpected error occured!!!");
				console.log(err);
			}
		}
	});	
}

//parsing the response and displaying error or setting up data onto the app
function parseResponse(city, type, response) {
	if (response == "1") {
		openCloseError("The API server is down <br> Please try again later.");
	}else if (response == "2"){
		openCloseError("You're too fast, slow down!");
	}else if (response == "3") {
		openCloseError("An unexpected error occured!!!");
	}else {
		try {
			response = JSON.parse(response);
			//return data in JSON form
			if (response["cod"] == "401") {
				openCloseError("Invalid operation");
			}else if (response["cod"] == "404") {
				openCloseError("Invalid City Name");
			}else {
				saveCache (city, type, JSON.stringify(response));
				return response;
			}
		}catch(err) {
			openCloseError("Unable to parse response!!!");
		}
	}
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
	document.getElementById("mainSearchBox").value = "";
	triggerData();
	insertValue ("");
	if (navOpen) openCloseNav();
}

function triggerData () {
	disableMultiRequest();
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
	if (city == "") {
		openCloseError("The city name is empty");
		allowRequestAgain();
	}else {
		let delays = 0;
		//to prevent heavy spam request
		if (delays = getCookieValue("delayCount")) {
			delays = 500 *(Number.parseInt(delays) / 2);
		}
		setTimeout(() => {
			getJson(0, city).then ((message) => {
				setupData(message);
				getForecastData(city);
			}).catch ((err)=>{
				invalidCity = true;
			}).finally(()=>{
				allowRequestAgain();
			})
		}, delays);
	}
}

function disableMultiRequest () {
	console.log("disabled");
	const mainPageContainer = document.getElementById("mainPage");
	const mainSearchBtn = mainPageContainer.getElementsByTagName("input")[1];
	
	mainSearchBtn.disabled = true;
	mainSearchBox.removeEventListener("keyup", isEnterMain);
	secondarySearchBox.removeEventListener("keyup", isEnterSecondary);
}

function allowRequestAgain () {
	secondarySearchBox.addEventListener("keyup", isEnterSecondary);
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
		weatherId = data["weather"][0]["id"],
		humidity = data["main"]["humidity"], 
		pressure = data["main"]["pressure"],
		feelsLike = data["main"]["feels_like"] - 273.15,
		visibility = data["visibility"] / 1000,
		clouds = data["clouds"]["all"],
		unix = data["dt"];

	adjustNavShadowOnSetup ();

	(mainPage.style.display != "none") ? refreshPage() : refreshSearch();

	setTimeout(() => {
		let currHour = getHour(unix),
			dayOrNight = getDayType(currHour),
			iconName = getIconsName(weatherId, dayOrNight),
			iconUrl = `/asset/${iconName}.png`;
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
		if (time != 800) {
			time = 800;
		}
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