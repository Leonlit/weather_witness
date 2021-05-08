'use strict'
var time = 100, cityObj ={};
var mainSearchBox = document.getElementById("mainSearchBox"),
	secondarySearchBox = document.getElementById("secondarySearch");

mainSearchBox.addEventListener("keyup", isEnterMain);
secondarySearchBox.addEventListener("keyup", isEnterSecondary);

//get json data
async function getJson (type, city) {
	return await checkCache(city, type).then (async (data)=>{
		let requestQuery;
		if (data != false) {
			return JSON.parse(data);
		}else {
			requestQuery = `request.php?city=${city}&type=${type}`;
			try {
				return await fetch(requestQuery, {
					method: 'get', 
				})
				.then(data=>{
					const statsCode = data.status;
					if (statsCode == 200) {
						const text = data.text();
						return text;
					}else {
						throw statsCode;
					}
				})
				.then((response) => {
					return parseResponse(city, type, response);
				}).catch(err=>{
					checkResponseCode(err.message);
				});
			}catch (err){
				checkResponseCode(500);
			}
		}
	});
}

function checkResponseCode (code) {
	/*
		- 422 invalid request parameter
		- 429 rate limits reach
		- 500 unexpected error
		- 503 server down
	*/
	switch (Number(code)) {
		case 422:
			openCloseError("The API server is down <br> Please try again later.");
			break;
		case 429:
			openCloseError("You're too fast, slow down!!!");
			break;
		case 500:
			openCloseError("An unexpected error occured, please try again!!!");
			break;
		case 503:
			openCloseError("Server is down, please try again later!!!");
			break;
		default:
			openCloseError(`Unhandled error code (${code}), please contact the developer to resolve the issue!!!`);
	}
}

//parsing the response and displaying error or setting up data onto the app
function parseResponse(city, type, response) {
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
	triggerData(secondarySearchBox.value);
	if (navOpen) openCloseNav();
}

function triggerData (secondarySearch=null) {
	disableMultiRequest();
	let city = secondarySearch || mainSearchBox.value;
	
	if (city == "") {
		openCloseError("The city name is empty");
		allowRequestAgain();
	}else {
		let delays = 0;
		//to prevent heavy spam request
		if (delays = getCookieValue("delayCount")) {
			delays = 500 *(Number.parseInt(delays) / 2);
		}

		if (!secondarySearch) {
			delays+=100;
		}
		setTimeout(async () => {
			const data = await getJson(0, city).then ((message) => {
				if (message) {
					setupData(message);
					getForecastData(city);
					getPollutionData(getCoordFromJSON(message));
					document.getElementById("navItems").getElementsByTagName("li")[2].style.display = "initial";
				}else {
					throw "can't get json data";
				}
			}).catch ((err)=>{
				console.log(err);
				allowRequestAgain();
			})
		}, delays);
		
	}
}

const secondaryBtn = document.getElementById("searchIcon");
const mainPageContainer = document.getElementById("mainPage");
const mainSearchBtn = mainPageContainer.getElementsByTagName("input")[1];

function disableMultiRequest () {
	mainSearchBtn.disabled = true;
	secondaryBtn.disabled = true;
	secondarySearchBox.disabled = true;
	mainSearchBox.disabled = true;
	mainSearchBox.removeEventListener("keyup", isEnterMain);
	secondarySearchBox.removeEventListener("keyup", isEnterSecondary);
}

function allowRequestAgain () {
	mainSearchBtn.disabled = false;
	secondarySearchBox.disabled = false;
	secondaryBtn.disabled = false;
	mainSearchBox.disabled = false;
	mainSearchBox.addEventListener("keyup", isEnterMain);
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
		allowRequestAgain();
		clearSearchField();
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