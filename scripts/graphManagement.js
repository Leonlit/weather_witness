    function changeGraph() {
        const getBatch = document.getElementById("graphDay").value;
        const type = document.getElementById("graphType").value;

        console.log(forecastJson[0]["main"]["temp"]);
        compileData(forecastJson, getBatch, type);
    }

    function compileData (json, batch, type) {
        let data = [], labels = [];
        let title = "";

        for (let index = (batch - 1) * 8; index < 8 * batch ;index++) {
            let currJSON = json[index];
            if (type === "1") {
                title= "Temperature";
                try {
                    let currTemp = currJSON["main"]["temp"] - 273.15;
                    data.push(currTemp.toFixed(2));
                }catch {
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
            let time = currJSON["dt"];
            let date = new Date(time * 1000);
            day = `${date.getUTCDate()}/${date.getUTCMonth()}`;
            
            time = timeFormater(time);
            labels.push(`${time}-${day}`);
        }
        drawGraph(data, title, labels);
    }
    
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