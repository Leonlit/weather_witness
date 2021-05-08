'use strict'

let pollutionData;  

async function getPollutionData (coord) {
    await getJson(2, coord).then((data)=> {
        pollutionData = data;
        showPollutionData(true);
    });
}

function showPollutionData (initial=false) {
    if (initial) {
       {date, month} = getstartDate();
        setPollutionsOptions();
    }
    
}

function setPollutionsOptions (date, month) {
    month++;
	const cont = document.getElementById("pollutionGraphDay");
	const option = cont.getElementsByTagName("option");
	for (let x = 0; x< option.length; x++) {
		const template = `${date++} / ${month}`;
		option[x].innerHTML = template;
	}
}

function getstartDate () {
    
    return {};
}