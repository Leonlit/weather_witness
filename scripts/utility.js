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

async function getCityJSON (callback) {
    try {
        await fetch ("cityObject.json")
        .then(result => result.json())
        .then(json=> {
            callback(json);
        })
        
    }catch (err) {
        console.log(err.message);
    }
}

let gottenName = false;
let cityNames = [];
let founded = [];

function checkCityList () {
    if (!gottenName) {
        gottenName = true;
        getCityJSON((data)=>{
            console.log("test")
            data.forEach(ele => {
                cityNames.push(ele.name);
            });
            constructOptions (cityNames) 
        });
    }else {
        constructOptions(cityNames);
        console.log("test2")
    }
}

let cityCont = document.getElementById("cityList"),
    smallCityCont = document.getElementById("cityListSmall");

function constructOptions (names) {
    founded = [];
    let theCont = (isSearchMain) ? cityCont : smallCityCont;

    clearBoth();
    let value = (isSearchMain) ? 
                document.getElementById("mainSearchBox").value :
                document.getElementById("secondarySearch").value ;
    
    let size = names.length;
    let found = 0;

    if (value == "") {
        makeSearchTransparent(theCont);
        return false;
    }

    for (let i = 0; i < size; i++) {
        if (found == 20 || value == "") {
            break;
        }
        if  ( ((names[i].toLowerCase()).indexOf(value.toLowerCase())) > -1) { 
            found++;
            let node = document.createElement("option");
            let currName = names[i];

            founded.push(currName);
            node.addEventListener("click", ()=> {
                makeSearchTransparent(theCont)
                insertValue(currName);
            });

            let text = document.createTextNode(currName); 
            node.appendChild(text);
            theCont.appendChild(node); 
        }
    }
    if (found > 0) {
        theCont.style.backgroundColor = "white"; 
        if (!isSearchMain && screen.width <= 800.0) {
            theCont.style.backgroundColor = "rgb(64,64,64)";
            theCont.style.marginTop = "10px";
            theCont.style.color = "white";
            theCont.style.borderTop = "2px solid rgb(100,100, 100)"
        }
    }else {
        makeSearchTransparent(theCont)
        theCont.style = "";
    }
}

function insertValue (name) {
    let ele = (isSearchMain) ? 
            document.getElementById("mainSearchBox") :
            document.getElementById("secondarySearch") ;
    
    ele.value = name;
    clearBoth();
}

function makeSearchTransparent (cont) {
    cont.style.backgroundColor = "transparent";
}

function clearBoth () {
    makeSearchTransparent(cityCont)
    makeSearchTransparent(smallCityCont)
    cityCont.innerHTML = "";
    smallCityCont.innerHTML = "";
}