'use strict'

let pollutionData;  

async function getPollutionData (coord) {
    await getJson(2, coord).then((data)=> {
        console.log(data);
        pollutionData = data;
        showPollutionData();
        //showForecastData(true);
    });
}

function showPollutionData () {
    console.log(pollutionData);
    const data = pollutionData["list"][0];
    const pollutionContainer = document.getElementById("pollutionDataContainer");
    const pollutionFields = pollutionContainer.getElementsByClassName("pollutionData");
    pollutionFields[0].innerHTML = limitSignificantShown(data["main"]["aqi"], 2);
    pollutionFields[1].innerHTML = limitSignificantShown(data["components"]["co"], 2);
    pollutionFields[2].innerHTML = limitSignificantShown(data["components"]["no"], 2);
    pollutionFields[3].innerHTML = limitSignificantShown(data["components"]["no2"], 2);
    pollutionFields[4].innerHTML = limitSignificantShown(data["components"]["o3"], 2);
    pollutionFields[5].innerHTML = limitSignificantShown(data["components"]["so2"], 2);
    pollutionFields[6].innerHTML = limitSignificantShown(data["components"]["nh3"], 2);
    pollutionFields[7].innerHTML = limitSignificantShown(data["components"]["pm2_5"], 2);
    pollutionFields[8].innerHTML = limitSignificantShown(data["components"]["pm10"], 2);
}

