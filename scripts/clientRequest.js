let lockInitialAPI = false, initial = true;

function getJson (type, city) {
	return new Promise ((resolve, reject)=> {
		let requestQuery;
			
		if (type == 0) 
			requestQuery = `request.php?city=${city}&type=0`;
		else 
			requestQuery = `request.php?city=${city}&type=1`;
		try {
			fetch(requestQuery, {
				method: 'get', 
			}).then((response) => {
				//if  the response status isn't ok, don't do anything
				if (response.status >= 200 && response.status < 300) {
					//return data in JSON form
					resolve(response.json());
					
				}else { 
					reject (response.statusText);
				}
			})
		}catch {
			reject("Something went wrong when the server send an request to the API, Try again later");
		}
	});	
}

let temperatureCont = document.getElementById("temperature"),
	weatherCont = document.getElementById("weather"),
	locationCont = document.getElementById("location"),
	feelsLikeCont = document.getElementById("feels_like"),
	maxTempCont = document.getElementById("maxTemperature"),
	minTempCont = document.getElementById("minTemperature"),
	pressureCont = document.getElementById("pressure"),
	humidityCont = document.getElementById("humidity"),
	cloudinessCont = document.getElementById("cloudiness"),
	visibilityCont = document.getElementById("visibility")
	mainWeatherIcon = document.getElementById("weatherIcon"),
	footer = document.getElementsByTagName("footer")[0];

//used when the secondary search field is used
function getNewData () {
	lockInitialAPI = false;
	document.getElementById("mainSearchBox").value = "";
	triggerData();
	if (navOpen) openCloseNav();
}

function triggerData () {

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
		getForecastData(city);
		getJson(0, city).then ((message) => {
			setupData(message);
			console.log(message)
		}).catch ((err)=>{
			console.log(err);
		})	
	}
	lockInitialAPI = true;
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
		unix = data["dt"], 
		iconUrl, dayOrNight, currHour;

	if (mainPage.style.display != "none") {
		refreshPage();
	}else {
		refreshSearch();
	}

	let time;
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

let mainPage = document.getElementById("mainPage")
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
	console.log("test");
	weatherDetails.classList.remove("fade-in-left");
	weatherDetails.classList.add("fade-out");
	setTimeout(() => {
		weatherDetails.classList.remove("fade-out");
		weatherDetails.classList.add("fade-in-left");
		weatherDetails.style.display = "block";	
	}, 1000);
}

//using the icon code provided by OpenWeatherMap API, use the appropriate icon for the weather condition
function getIconsName (id, DON) {
	let icon;
	if (id <300 && id>=200) {
		icon = "thunderstorm_" + DON;
	}else if (id>=300 && id<400) {
		icon = "drizzle";
	}else if (id>=500 && id<600) {
		icon = "rain_" + DON;
	}else if (id>=600 && id <700) {
		icon = "snow";
	}else if (id >700 && id<800) {
		icon = "atmosphere";
	}else if (id == 800) {
		icon = "clear_" + DON;
	}else if (id==801) {
		icon = "broken_clouds_"+DON;
	}else if (id>801) {
		icon = "cloud_scattered";
	}
	return icon;
}

function openPage () {
	openCloseNav();
}