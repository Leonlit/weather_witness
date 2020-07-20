let forecastJson,
	forecastShown = false;

let forecast = document.getElementById("forecast");
	forecastEle = document.getElementById("forecastData"),
	forecastDataCont = document.getElementById("forecastDataCont");

//Get the data from the API server
function getForecastData (city) {
	//when the data haven't been fetched
	getJson(1, city).then ((message) => {
		changeForecastData(message);
		console.log(message)
	}).catch ((err)=>{
		console.log(err);
	})
}

//updating the date of the forecast option section
function setOptionDate (date, month) {
	month++;
	let cont = document.getElementById("forecastDay");
	let option = cont.getElementsByTagName("option");
	for (let x = 0; x< 5;x++) {
		option[x].innerHTML = `${date++} / ${month} - ${date} / ${month}`
	}
}

//replace the forecast data when a new option is choosed
function changeForecastData (initialData) {
	if (initialData != undefined) {
		forecastJson = initialData;
		forecastJson = forecastJson["list"];

		let time = forecastJson[0]["dt"];
		let date = new Date(time * 1000);
		setOptionDate(date.getUTCDate(), date.getUTCMonth());
	}

	let type = document.getElementById("forecastType").value;
	let batch = document.getElementById("forecastDay").value;

	switch (type) {
		case "temperature":
			setForecastTemperature(batch);
			break;
		case "percipitation":
			setForecastPrecipitation(batch);
			break;
		case "wind":
			setForecastWind(batch);
			break;
		default:
			console.log("something wrong in determining forecast type");
			console.log(type, typeof(type))
	}
}

//will be using temperature, weather id, time, percipitation, winds for forecast data presentation.
function setForecastTemperature (batch) {
	let resultElement = "";
	//batch means the batch of the data, the forecast is devided to 5 days
	for (let index = (batch - 1) * 8; index< 8 * batch; index++) {
		let currJSON = forecastJson[index];
		let temp, weatherId, time, pressure;
		temp = currJSON["main"]["temp"] - 273.15;
		temp = temp.toFixed(1);
		weatherId = currJSON["weather"][0]["id"];
		time = currJSON["dt"];
		
		pressure = currJSON["main"]["pressure"];

		let currHour = getHour(time),
			dayOrNight = getDayType(currHour),
			iconName = getIconsName(weatherId, dayOrNight),
			iconUrl = `icons/${iconName}.png`;

		console.log( dayOrNight, currHour, iconName);
		time = timeFormater(time);

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
	for (let index = (batch - 1) * 8; index< 8 * batch; index++) {
		let rain, logo, time, rainOrNot, addClass;
		let currJSON = forecastJson[index];
		time = currJSON["dt"];
		time = timeFormater(time);

		try {
			rain = currJSON["rain"]["3h"];
			logo = "icons/waterDrop.png";
			rainOrNot = `<div style="margin-top:5px;">${rain} mm</div>`;
			addClass = "forecastIcon";
		}catch { 
			logo = "icons/noWaterDrop.png";
			rainOrNot = "";
			addClass = `noRainImg`
		}

		let ele = `
			<div class="forecastItems">
				<div>${time}</div>
				<img class="${addClass}" src="${logo}"/>
				${rainOrNot}
			</div> 
		`
		resultElement += ele;
	}
	forecastDataCont.innerHTML = "";
	forecastDataCont.innerHTML = resultElement;
}

function setForecastWind (batch) {
	let resultElement = "";
	for (let index = (batch - 1) * 8; index< 8 * batch; index++) {
		let windSpd, windDeg, time;
		let currJSON = forecastJson[index];
		windSpd = currJSON["wind"]["speed"];
		windDeg = currJSON["wind"]["deg"];
		time = currJSON["dt"];
		time = timeFormater(time);

		logo = "icons/arrow.png";

		let ele = `
			<div class="forecastItems">
				<div>${time}</div>
				<img class="forecastIcon" style="transform:rotate(${windDeg}deg);" src="${logo}"/>
				<div style="margin-top:5px;">${windSpd} mps</div>
			</div>
		`
		resultElement += ele;
	}
	forecastDataCont.innerHTML = "";
	forecastDataCont.innerHTML = resultElement;
}