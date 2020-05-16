let forecastJson,
	forecastShown =false;

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
			setForecastTemperature(0);
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

//will be using temperature, weater id, time, percipitation, widns, clouds and pressure
function setForecastTemperature (batch) {
	/* need to follow this format
	
	<div class="forecastItems">
        <div class="forecastTime">12AM</div>
        <img class="forecastIcon" src="icons/thunderstorm_N.png"/>
        <div class="forecastTemp">32 &#8451;</div>
        <div class="forecastTemp">3212 hpa</div>
	</div>
	
	*/

	let resultElement = "";
	//batch means the batch of the data, the forecast is devided to 3 days
	//it's according to the day (batch 1 = current day forecast).
	for (let index = batch++; index< 8 * batch; index++) {
		let temp, weatherId, time, pressure;
		temp = forecastJson["main"]["temp"];
		weatherId = forecastJson["weather"]["id"];
		time = forecastJson["dt"];
		time = timeFormater(time);

		let currHour = getHour(time),
			dayOrNight = getDayOrNight(currHour),
			iconName = getIconsName(weatherId, dayOrNight),
			iconUrl = `icons/${iconName}.png`;

		let ele = `
			<div class="forecastItems">
				<div class="forecastTime">${time}</div>
				<img class="forecastIcon" src="${iconUrl}"/>
				<div class="forecastTemp">${temp} &#8451;</div>
				<div class="forecastTemp">${pressure} hpa</div>
			</div>
		`
		resultElement += ele;
	}
	forecastDataCont.innerHTML = "";
	forecastDataCont.innerHTML = resultElement;
}

function setForecastTemperature () {

}