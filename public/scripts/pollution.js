'use strict'

let pollutionData;  

async function getPollutionData (coord) {
    await getJson(2, coord).then((data)=> {
        pollutionData = data;
        showPollutionData();
        //showForecastData(true);
    });
}

function showPollutionData () {
    const data = pollutionData["list"][0];
    const pollutionContainer = document.getElementById("pollutionData");
    const pollutionFields = pollutionContainer.getElementsByClassName("pollutionData");
    pollutionFields[0].innerHTML = limitSignificantShown(data["main"]["aqi"]);
    pollutionFields[1].innerHTML = limitSignificantShown(data["components"]["co"]);
    pollutionFields[2].innerHTML = limitSignificantShown(data["components"]["no"]);
    pollutionFields[3].innerHTML = limitSignificantShown(data["components"]["no2"]);
    pollutionFields[4].innerHTML = limitSignificantShown(data["components"]["o3"]);
    pollutionFields[5].innerHTML = limitSignificantShown(data["components"]["so2"]);
    pollutionFields[6].innerHTML = limitSignificantShown(data["components"]["nh3"]);
    pollutionFields[7].innerHTML = limitSignificantShown(data["components"]["pm2_5"]);
    pollutionFields[8].innerHTML = limitSignificantShown(data["components"]["pm10"]);
}

