'use strict'

let forecastPollutionData;
let pollutionData;

async function getPollutionData (coord) {
    await getJson(2, coord).then((data)=> {
        showPollutionData(data["list"][0]);
        pollutionData = data;
        showPollutionForecastData(true);
    });
}

function showPollutionData (data) {
    const unit = " μg/m<sup>3</sup>";
    const pollutionContainer = document.getElementById("pollutionDataContainer");
    const pollutionFields = pollutionContainer.getElementsByClassName("pollutionData");
    pollutionFields[0].innerHTML = limitSignificantShown(data["main"]["aqi"], 2) + unit;
    pollutionFields[1].innerHTML = limitSignificantShown(data["components"]["co"], 2) + unit;
    pollutionFields[2].innerHTML = limitSignificantShown(data["components"]["no"], 2) + unit;
    pollutionFields[3].innerHTML = limitSignificantShown(data["components"]["no2"], 2) + unit;
    pollutionFields[4].innerHTML = limitSignificantShown(data["components"]["o3"], 2) + unit;
    pollutionFields[5].innerHTML = limitSignificantShown(data["components"]["so2"], 2) + unit;
    pollutionFields[6].innerHTML = limitSignificantShown(data["components"]["nh3"], 2) + unit;
    pollutionFields[7].innerHTML = limitSignificantShown(data["components"]["pm2_5"], 2) + unit;
    pollutionFields[8].innerHTML = limitSignificantShown(data["components"]["pm10"], 2) + unit;
}

function showPollutionForecastData(initial=false) {
    if (initial) {
        let coord = pollutionData["coord"]["lat"] + "," + pollutionData["coord"]["lon"];
        getJson(3, coord).then ((data) => {
            console.log(data);
			let dateObj = getStartDateObj(data["list"][0]["dt"]);
            setPollutionsOptions(dateObj);
            forecastPollutionData = data;
            changePollutionGraph(data);
		}).catch ((err)=>{
			console.log(err);
		})
        
    }
}

//setting up the values for the options for pollution
function setPollutionsOptions (dateObj) {
    let date = dateObj.getUTCDate();
	let month = dateObj.getUTCMonth() + 1; //the dateObj.getUTCMonth() provide value starts from 0 to 11 like array element's index
    var dt = new Date();
	var year = dt. getFullYear();
	var numOfDay = new Date(year, month, 0).getDate();
	const cont = document.getElementById("pollutionGraphDay");
	const buttons = cont.getElementsByTagName("button");
	for (let x = 0; x < buttons.length; x++) {
		let [newDate, newMonth, nextDay, nextMonth] = generateDate(date, month, numOfDay);
		date = newDate;
		month = newMonth;
		const template = `${date++} / ${month} - ${nextDay} / ${nextMonth}`;
		buttons[x].innerHTML = template;
	}
}

function getStartDateObj (time) {
	let dateObj = new Date(time * 1000);
    return dateObj;
}