function getJson (param) {
	let requestQuery, place;

	if (param === undefined) {
		place = document.getElementById("mainSearchBox").value;
	}else {
		place = param;
	}
	requestQuery = `request.php?city=${place}`;

	try {
		fetch(requestQuery, {
			method: 'get', 
		}).then((response) => {
			//if  the response status isn't ok, don't do anything
			if (response.status >= 200 && response.status < 300) {
				//return data in JSON form
				return response.json();
			}else { 
				throw new Error(response.statusText);
			}
		}).then(JSON => {
			//pass the data to a function to store the json data globally
			try {
				log(JSON);	
				displayData(JSON);
			}catch (err) {
				log(`${err}\n\ncannot parse JSON data`);
			}
		});
	}catch {
		//customAlert("something went wrong!!! Please make sure you enter your city name correctly or simply try again")
		clientLog("Something went wrong when the server send an request to the API, Try again later");
	}
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
	visibilityCont = document.getElementById("visibility");

function displayData (data) {
	let icon,
		city = data["name"],
		country = data["sys"]["country"],
		weather = data["weather"][0]["description"],
		temp = data["main"]["temp"] - 273.15,
		maxTemp = data["main"]["temp_max"] - 273.15,
		minTemp = data["main"]["temp_min"] - 273.15,
		id = data["weather"][0]["id"],
		unix = data["dt"], 
		humidity = data["main"]["humidity"], 
		pressure = data["main"]["pressure"],
		feelsLike = data["main"]["feels_like"] - 273.15,
		visibility = data["visibility"] /1000,
		clouds = data["clouds"]["all"];

	let time = timeFormater(unix);
	
	refreshPage();

	temp = temp.toFixed(1);
	maxTemp = maxTemp.toFixed(1);
	minTemp = minTemp.toFixed(1);
	feelsLike = feelsLike.toFixed(1);
	visibility = visibility.toFixed(2);

	temperatureCont.innerHTML = `${temp} &#8451;`;
	weatherCont.innerHTML = weather;
	locationCont.innerHTML = city + ", " + country;

	feelsLikeCont.innerHTML = `${feelsLike} &#8451;`;
	maxTempCont.innerHTML = `${maxTemp} &#8451;`;
	minTempCont.innerHTML = `${minTemp} &#8451;`;
	pressureCont.innerHTML = pressure;
	humidityCont.innerHTML = `${humidity} %`;
	cloudinessCont.innerHTML = `${clouds} %`;
	visibilityCont.innerHTML = `${visibility} km`;
}

let mainPage = document.getElementById("mainPage")
	weatherDetails = document.getElementById("weatherDisplay");

function refreshPage () {
	mainPage.classList.remove("fade-in-left");
	mainPage.classList.add("fade-out");
	setTimeout(()=>{
		mainPage.style.display = "none";
	},1000);
	weatherDetails.style.display = "block";
	weatherDetails.classList.add("fade-in-left");
}