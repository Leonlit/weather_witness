//function that's triggered when an option is changed in the graph section
//as well as setting up the dropdown items value during set up
// 0 means draw out all the data to the chart
let forecastSelectedBatch = [0];
function changeForecastGraph(batch) {
    let getBatch;
    //Since if this method is called from the forecast.js,
    //the provided data is in json form so its not an Integer
    //that's when the system will need to pass the array [0] 
    //to the compileForecastData function. 
    //If the provided batch is an integer (from the html element onclick event)
    if (isInteger(batch)) {
        getBatch = batch;
        //check if there's a zero in the array , if its in it 
        //then we need to remove it
        if (forecastSelectedBatch.includes(0)) {
            let index = forecastSelectedBatch.indexOf(0);
            forecastSelectedBatch.splice(index, 1);
        }
        //if the provided batch number is in the array, it means that user want to remove it from
        //displaying the batch data to the chart
        //batch meaning - since this API can provide forecast data for 5 days,
        //I divided the data into 5 batch according to days
        if (forecastSelectedBatch.includes(getBatch)) {
            let index = forecastSelectedBatch.indexOf(getBatch);
            forecastSelectedBatch.splice(index, 1);
        }else {
            //if its not in the array, add it into the array
            forecastSelectedBatch.push(getBatch);
        }
        //toggle the clicked button (change its color)
        toggleSelectedButton(batch - 1, "forecastGraphDay");
    }
    //getting the type of the chart to draw out (temperature or precipitation)
    const type = document.getElementById("forecastGraphType").value;
    //forecastJson is a global variable from forecast.js
    compileForecastData(forecastJson, forecastSelectedBatch, type);
}

//toggling the buttons background color to indicate which button is selected
function toggleSelectedButton (index, element) {
    const buttons = document.getElementById(element).getElementsByTagName("button");
    let initialBg = buttons[index].style;
    if (initialBg.backgroundColor === "rgb(159, 137, 230)") {
        initialBg.backgroundColor = "rgb(185, 173, 225)";
    }else {
        initialBg.backgroundColor = "rgb(159, 137, 230)";
    }
}

//setting up the data for the chart
function compileForecastData (json, batch, type) {
    let data = [], labels = [];
    const title = getForecastTitle(type);;
    let start, end;
    const batchSize = 8;
    batch.sort();
    if (batch.length == 0 ) {
        batch = [0]
    }
    
    for (let batches = 0; batches < batch.length; batches++) {
        const currBatch = batch[batches];
        if (currBatch != 0) {
            start = (currBatch - 1) * batchSize;
            end = batchSize * currBatch;
        }else {
            start = 0;
            end = json.length;
        }

        //extracting the forecast data 
        for (let index = start; index < end ;index++) {
            const currJSON = json[index];
            data.push(extractForecastData(currJSON, type));
            //getting the time for which this data is predicted for
            let time = currJSON["dt"];
            //the time final format is hh: mm pm/am-dd/m
            labels.push(getDataDay(time));
        }
    }
    setTimeout(() => {
        drawGraph(data, title, labels, "forecastChartContainer", "forecastGraph");
    }, 300);
}

//base on the selected chart type, return the title of the chart
function getForecastTitle (type) {
    if (type === "1") {
        return "Temperature";
    }else if (type === "2"){
        return "Precipitation";
    }else {
        return false;
    }
}

//get the day for the labels in the chart
function getDataDay (timestamp) {
    const date = new Date(timestamp * 1000);
    //getting the date and month for the time
    const day = `${date.getUTCDate()}/${1+date.getUTCMonth()}`;
    //formatting the time to hh:mm pm/am
    timestamp = timeFormater(timestamp);
    return `${timestamp}-${day}`;
}

function extractForecastData(json, type) {
    //there's two major option for the chart, temperature and precipitation (rain)
    // 1 means the option choosed is temperature while 2 means precipitation is choosed
    if (type === "1") {
        try {
            //just in case the json data is corrupted
            let currTemp = json["main"]["temp"] - 273.15;
            return currTemp.toFixed(2);
        }catch {
            //substitute the corrupted section with 0 value instead
            return 0.00;
        }
    }else if (type === "2") {
        try {
            let currRain = json["rain"]["3h"];
            return currRain;
        }catch {
            return 0.00;
        }
    }
}

//drawing out the chart using chart.js
function drawGraph (dataGiven, title, labels, containerID, graphID) {
    const container = document.getElementById(containerID);
    //There's a bug where the cleared canvas graph will sometimes flickling around the newly drawed graph
    //That's why the app will need to remove an re-add the canvas element into the container
    const graph = document.getElementById(graphID);
    graph.remove();
    const newGraph = document.createElement("canvas");
    newGraph.setAttribute("id", graphID);
    container.appendChild(newGraph);
    let ctx = newGraph.getContext('2d');
    setTimeout(() => {
        let chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    borderColor: "#e69e88",
                    data: dataGiven,
                    label: title
                },
            ]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
            }
            
        });
    }, 200);
}