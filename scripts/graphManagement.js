//function that's triggered when an option is changed in the graph section
//as well as setting up the dropdown items value during set up
// 0 means draw out all the data to the chart
let selectedBatch = [0];
function changeGraph(batch) {
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
        if (selectedBatch.includes(0)) {
            let index = selectedBatch.indexOf(0);
            selectedBatch.splice(index, 1);
        }
        //if the provided batch number is in the array, it means that user want to remove it from
        //displaying the batch data to the chart
        //batch meaning - since this API can provide forecast data for 5 days,
        //I divided the data into 5 batch according to days
        if (selectedBatch.includes(getBatch)) {
            let index = selectedBatch.indexOf(getBatch);
            selectedBatch.splice(index, 1);
        }else {
            //if its not in the array, add it into the array
            selectedBatch.push(getBatch);
        }
        //toggle the clicked button (change its color)
        toggleSelectedButton(batch - 1);
    }
    //getting the type of the chart to draw out (temperature or precipitation)
    const type = document.getElementById("graphType").value;
    //forecastJson is a global variable from forecast.js
    compileData(forecastJson, selectedBatch, type);
}

//toggling the buttons background color to indicate which button is selected
function toggleSelectedButton (index) {
    let buttons = document.getElementById("graphDay").getElementsByTagName("button");
    let initialBg = buttons[index].style;
    console.log(initialBg.backgroundColor);
    if (initialBg.backgroundColor === "rgb(106, 133, 210)") {
        initialBg.backgroundColor = "rgb(136,161,230)";
    }else {
        initialBg.backgroundColor = "rgb(106, 133, 210)";
        console.log("test");
    }

}

//setting up the data for the chart
function compileData (json, batch, type) {
    let data = [], labels = [];
    let title = getTitle(type);;
    let start, end;

    batch.sort();
    if (batch.length == 0 ) {
        batch = [0]
    }
    
    for (let batches = 0; batches < batch.length; batches++) {
        let currBatch = batch[batches];
        console.log(typeof currBatch);
        if (currBatch != 0) {
            start = (currBatch - 1) * 8;
            end = 8 * currBatch;
        }else {
            start = 0;
            end = json.length;
        }

        console.log(start, end)

        //extracting the forecast data 
        for (let index = start; index < end ;index++) {
            let currJSON = json[index];
            

            data.push(extractData(currJSON, type));
            //getting the time for which this data is predicted for
            let time = currJSON["dt"];
            //the time final format is hh: mm pm/am-dd/m
            labels.push(getDataDay(time));
        }
    }
    setTimeout(() => {
        drawGraph(data, title, labels);
    }, 300);
}

//base on the selected chart type, return the title of the chart
function getTitle (type) {
    if (type === "1") {
        return "Temperature";
    }else if (type === "2"){
        return "Precipitation";
    }else {
        return false;
    }
}

//get the day for the labels in the chart
function getDataDay (time) {
    let date = new Date(time * 1000);
    //getting the date and month for the time
    let day = `${date.getUTCDate()}/${1+date.getUTCMonth()}`;
    //formatting the time to hh:mm pm/am
    time = timeFormater(time);
    return `${time}-${day}`;
}

function extractData(json, type) {
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
function drawGraph (dataGave, title,labels) {
    let graph = document.getElementById("graph");
    graph.innerHTML = "";
    let ctx = graph.getContext('2d');
    ctx.clearRect(0, 0, graph.width, graph.height);
    setTimeout(() => {
        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    borderColor: "#e69e88",
                    data: dataGave,
                    label: title
                },
            ]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
            }
            
        });
    }, 100);
}