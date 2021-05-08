'use strict'
function showForecastData(initial=false) {
    if (initial) {
        let {date, month} = getstartDate();
         setPollutionsOptions(date, month);
     }
}

function setPollutionsOptions (date, month) {
    month++;
	const cont = document.getElementById("pollutionGraphDay");
	const option = cont.getElementsByTagName("option");
	for (let x = 0; x< option.length; x++) {
		const text = `${date++} / ${month}`;
		option[x].innerHTML = text;
	}
}

function getStartDate () {
    let time = pollutionData["list"][0]["dt"];
	let dateObj = new Date(time * 1000);
    let date = dateObj.getUTCDate();
    let month =  date.getUTCMonth();
    return {date, month};
}