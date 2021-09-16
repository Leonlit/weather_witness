
let pollutionSelectedBatch = [0];
function changePollutionGraph(batch) {
    let getBatch;

    //Since if this method is called from the forecast.js,
    //the provided data is in json form so its not an Integer
    //that's when the system will need to pass the array [0] 
    //to the compileData function. 
    //If the provided batch is an integer (from the html element onclick event)
    if (isInteger(batch)) {
        getBatch = batch;
        //check if there's a zero in the array , if its in it 
        //then we need to remove it
        if (pollutionSelectedBatch.includes(0)) {
            let index = pollutionSelectedBatch.indexOf(0);
            pollutionSelectedBatch.splice(index, 1);
        }
        //if the provided batch number is in the array, it means that user want to remove it from
        //displaying the batch data to the chart
        //batch meaning - since this API can provide forecast data for 10 days,
        //I divided the data into 10 batch according to days
        if (pollutionSelectedBatch.includes(getBatch)) {
            let index = pollutionSelectedBatch.indexOf(getBatch);
            pollutionSelectedBatch.splice(index, 1);
        }else {
            //if its not in the array, add it into the array
            pollutionSelectedBatch.push(getBatch);
        }
        //toggle the clicked button (change its color)
        toggleSelectedButton(batch - 1, "pollutionGraphDay");
    }
    //getting the type of the chart to draw out (temperature or precipitation)
    const type = document.getElementById("pollutionType").value;
    //forecastPollutionData is a global variable from pollution.js storing the json data for the pollution forecast
    compileData(forecastPollutionData["list"], pollutionSelectedBatch, type);
}

//setting up the data for the chart
function compileData (json, batch, type) {
    let data = [], labels = [];
    const title = getPollutionTitle(type - 1);;
    let start, end;
    const batchSize = 24;

    batch.sort();
    if (batch.length == 0 ) {
        batch = [0]
    }
    
    for (let batches = 0; batches < batch.length; batches++) {
        const currBatch = batch[batches];
        if (currBatch != 0) {
            start = (currBatch - 1) * batchSize;
            end = batchSize * currBatch;
            if (currBatch == 5) {
                end = json.length;
            }
        }else {
            start = 0;
            end = json.length;
        }

        //extracting the forecast data 
        for (let index = start; index < end ;index++) {
            const currJSON = json[index];
            if (currJSON == undefined) {
                continue;
            }
            data.push(extractPollutionData(currJSON, type));
            //getting the time for which this data is predicted for
            let time = currJSON["dt"];
            //the time final format is hh: mm pm/am-dd/m
            labels.push(getDataDay(time));
        }
        console.log(data);
    }
    setTimeout(() => {
        drawGraph(data, title, labels, "pollutionChartContainer", "pollutionGraph");
    }, 300);
}

function getPollutionTitle (type) {
    const title = [
        "Air Quality Index",
        "Carbon monoxide",
        "Nitric oxide",
        "Nitrogen dioxide",
        "Ozone",
        "Sulfur dioxide",
        "Ammonia",
        "Particulates Matter 2.5",
        "Particulates Matter 10"
    ]
    return title[parseInt(type)];
}

function extractPollutionData (json, type) {
    const labels = ["", "co", "no", "no2", "o3", "so2", "nh3", "pm2_5", "pm10"];
    let value;
    try {
        if (type == 1) {
            //just in case the json data is corrupted
            let currTemp = json["main"]["aqi"];
            value = currTemp;
        }else {
            let currValue = json["components"][labels[type - 1]];
            value = currValue;
        }
    }catch {    
        //substitute the corrupted section with 0 value instead
        return 0.00;
    }
    return value;
}