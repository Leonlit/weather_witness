'use strict'

let pollutionData;  

async function getPollutionData (coord) {
    await getJson(2, coord).then((data)=> {
        pollutionData = data;
        showPollutionData();
        showForecastData(true);
    });
}

function showPollutionData () {
    
}

