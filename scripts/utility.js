//formating time from unix milisecond time to readable time for user in 12 hour format
function timeFormater (unixTimestamp) {
    //buiding the time
    let date = new Date(unixTimestamp*1000),
        hour = getHour(unixTimestamp);
        minute = "0" + date.getMinutes(),
        symbol = "";
    
    minute = minute.substr(-2);

    symbol = getDayOrNight(hour);
    
    if (hour != 12) 
        hour %= 12;

    return `${hour}:${minute} ${symbol}`;
}

//seperate function as needed for icon url construction
function getHour (unixTime) {
    let dateObj = new Date (unixTime*1000);
    return dateObj.getUTCHours();
}

//check if the current time is night or day
function  getDayType (hour) {
    console.log(hour)
    return (hour >= 19 || hour <= 6) ? "N": "D";
}

//determine if its pm or am
function getDayOrNight (hour) {
    return (hour>=12.00) ? "PM" : "AM";
}

let errorShown = false, invalidCity = false;
function openCloseError (message) {
    
    let container = document.getElementById("errorPopUp");
    let msgCont = document.getElementById("message");
    let shader = document.getElementById("shader2");

    if (!errorShown) {
        errorShown = true;
        msgCont.innerHTML = message;

        container.style.opacity = "0";
        container.style.display = "block";
        container.classList.remove("hidden");
        container.classList.add("appear");
        

        shader.style.opacity = "0";
        shader.style.display = "block";
        shader.classList.remove("hidden");
        shader.classList.add("appear");
    
        setTimeout(() => {
            shader.style.opacity = "1";
            container.style.opacity = "1";
        }, 400);
        
    }else {
        errorShown = false; 
        
        container.classList.remove("appear");
        container.classList.add("hidden");

        shader.classList.remove("appear");
        shader.classList.add("hidden");
        
        setTimeout(()=>{
            shader.style.display = "none";
            shader.style.opacity = "0";
            container.style.display = "none";
            container.style.opacity = "0";
        }, 400);
    }
}

function getCityJSON (callback) {
    try {
        fetch ("cityObject.json")
        .then(result => result.text())
        .then(json=> {
            callback(json);
        })
        
    }catch (err) {
        console.log(err.message);
    }
}

let cityArr = null;
let cityNames = [];

function checkCityList () {
    if (cityArr == null || cityArr == undefined) {
        getCityJSON((data)=>{

            let names = JSON.parse(data);
            cityArr = names;
            console.log("test")
            names.forEach(ele => {
                cityNames.push(ele.name);
            });
            console.log(names[0].name);
            constructOptions (cityNames) 
        });
    }else {
        constructOptions (cityNames);
        console.log("test2")
    }
}

let cityCont = document.getElementById('cityList')
function constructOptions (cityNames) {

    cityCont.innerHTML = ''; 
    let value = document.getElementById("mainSearchBox").value;
    
    let size = cityNames.length;
    let found = 0;

    cityCont.style.backgroundColor = "transparent";

    if (value == "") return false;

    for (let i = 0; i < size; i++) {
        if (found == 20 || value == "") {
            break;
        }

        if  ( ((cityNames[i].toLowerCase()).indexOf(value.toLowerCase())) > -1) { 
            console.log(cityNames[i])
            found++;
            let node = document.createElement("option");
            node.value = cityNames[i];
            node.addEventListener("click", ()=> {
                insertValue(cityNames[i]);
            });
            let text = document.createTextNode(cityNames[i]); 
            node.appendChild(text);
            cityCont.appendChild(node); 
        }
        if (found > 0) {
            cityCont.style.backgroundColor = "white"; 
        }
    }
}

function insertValue (name) {
    document.getElementById("mainSearchBox").value = name;
    cityCont.innerHTML = ''; 
}