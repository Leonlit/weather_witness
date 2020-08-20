    //function that's triggered when an option is changed in the graph section
    //as well as setting up the dropdown items value during set up
    function changeGraph() {
        const getBatch = document.getElementById("graphDay").value;
        const type = document.getElementById("graphType").value;
        //forecastJson is a global variable from forecast.js
        compileData(forecastJson, getBatch, type);
    }

    function compileData (json, batch, type) {
        let data = [], labels = [];
        let title = "";
        
        //extracting the forecast data 
        for (let index = (batch - 1) * 8; index < 8 * batch ;index++) {
            let currJSON = json[index];
            //there's two major option for the chart, temperature and precipitation (rain)
            // 1 means the option choosed is temperature while 2 means precipitation is choosed
            if (type === "1") {
                title= "Temperature";
                try {
                    //just in case the json data is corrupted
                    let currTemp = currJSON["main"]["temp"] - 273.15;
                    data.push(currTemp.toFixed(2));
                }catch {
                    //substitute the corrupted section with 0 value instead
                    data.push(0.00);
                }
            }else if (type === "2") {
                title= "Precipitation";
                try {
                    let currRain = currJSON["rain"]["3h"];
                    data.push(currRain);
                }catch {
                    data.push(0.00);
                }
            }
            //getting the time for which this data is predicted for
            let time = currJSON["dt"];
            let date = new Date(time * 1000);
            //getting the date and month for the time
            day = `${date.getUTCDate()}/${date.getUTCMonth()}`;
            
            //formatting the time to hh:mm pm/am
            time = timeFormater(time);
            //the time final format is hh: mm pm/am-dd/m
            labels.push(`${time}-${day}`);
        }
        drawGraph(data, title, labels);
    }
    
    //drawing out the chart using chart.js
    function drawGraph (dataGave, title,labels) {
        let graph = document.getElementById("graph");
        let ctx = graph.getContext('2d');
        ctx.clearRect(0, 0, graph.width, graph.height);
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
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
            
        });
    }