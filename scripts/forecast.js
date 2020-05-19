let forecastJson,
	forecastShown = false;

let forecast = document.getElementById("forecast");
	forecastEle = document.getElementById("forecastData"),
	forecastDataCont = document.getElementById("forecastDataCont");

function openCloseForecast () {
	//when the data haven't been fetched
	if (!catchedForecastData) {	

		forecastJson = getJson(1);
		forecastJson = forecastJson["list"];
		console.log(forecastJson);
		if (forecastJson != undefined) {
			setForecastTemperature(1);
			catchedForecastData = true;
		}
	}

	if (forecastShown) {
		forecast.style.display = "block";
		forecastEle.classList.remove("fade-out");
		forecastEle.classList.add("fade-in-left"); 
	}else {
		forecast.style.display = "block";
		forecastEle.classList.remove("fade-out");
		forecastEle.classList.add("fade-in-left");
	}
}

//will be using temperature, weater id, time, percipitation, winds
function setForecastTemperature (batch) {
	let resultElement = "";
	//batch means the batch of the data, the forecast is devided to 3 days
	//it's according to the day (batch 1 = current day forecast).
	for (let index = (batch - 1) * 8; index< 8 * batch; index++) {
		let temp, weatherId, time, pressure;
		temp = forecastJson["main"]["temp"];
		weatherId = forecastJson["weather"]["id"];
		time = forecastJson["dt"];
		time = timeFormater(time);
		pressure = forecastJson["main"]["pressure"];

		let currHour = getHour(time),
			dayOrNight = getDayOrNight(currHour),
			iconName = getIconsName(weatherId, dayOrNight),
			iconUrl = `icons/${iconName}.png`;

		let ele = `
			<div class="forecastItems">
				<div>${time}</div>
				<img class="forecastIcon" src="${iconUrl}"/>
				<div>${temp} &#8451;</div>
				<div>${pressure} hpa</div>
			</div>
		`
		resultElement += ele;
	}
	forecastDataCont.innerHTML = "";
	forecastDataCont.innerHTML = resultElement;
}

function setForecastPrecipitation (batch) {
	let resultElement = "";
	//batch means the batch of the data, the forecast is devided to 3 days
	//it's according to the day (batch 1 = current day forecast).
	for (let index = (batch - 1) * 8; index< 8 * batch; index++) {
		let rain, logo, time;
		rain = forecastJson["rain"]["3h"];
		weatherId = forecastJson["weather"]["id"];
		time = forecastJson["dt"];
		time = timeFormater(time);

		if (rain != undefined) 
			logo = "icons/waterDrop.png";
		else 
			logo = "icons/noWaterDrop.png";

		let ele = `
			<div class="forecastItems">
				<div>${time}</div>
				<img class="forecastIcon" src="${logo}"/>
				<div>${rain} &#8451;</div>
			</div>
		`
		resultElement += ele;
	}
	forecastDataCont.innerHTML = "";
	forecastDataCont.innerHTML = resultElement;
}