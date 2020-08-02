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

//getting the list of city namese available
async function getCityJSON (callback) {
    try {
        await fetch ("cityObject.json")
        .then(result => result.json())
        .then(json=> {
            //return a json data to the checkCityList method
            callback(json);
        })
    }catch (err) {
        console.log(err.message);
    }
}

let gottenName = false;
let cityNames = [];
let founded = [];

//get city names from file, but only if the cityNames is empty
//If its not empty use the list of city in it and pass the value
//into constructOptions
function checkCityList () {
    if (!gottenName) {
        gottenName = true;
        getCityJSON((data)=>{
            data.forEach(ele => {
                cityNames.push(ele.name);
            });
            constructOptions (cityNames) 
        });
    }else {
        constructOptions(cityNames);
    }
}

let cityCont = document.getElementById("cityList"),
    smallCityCont = document.getElementById("cityListSmall");

//construct the autocomplete list for the appropriate search box
function constructOptions (names) {
    founded = [];
    let theCont = (isSearchMain) ? cityCont : smallCityCont;

    //clearing the autocomplete item for both search box so that the screen 
    //wont be so messy
    clearBoth();

    //getting the search box that initiated the search
    let searchBox = (isSearchMain) ? "mainSearchBox" : "secondarySearch";
    let value = document.getElementById(searchBox).value ;
    
    let size = names.length;
    let found = 0;

    //if the value of the search box became empty, make the element transparent
    if (value == "") {
        makeSearchTransparent(theCont);
        return false;
    }

    for (let i = 0; i < size; i++) {
        //if the number of result found is 30 break the loop (limiting the value to loop through)
        if (found == 30) {
            break;
        }
        if  ( ((names[i].toLowerCase()).indexOf(value.toLowerCase())) > -1) { 
            found++;
            let node = document.createElement("option");
            let currName = names[i];

            founded.push(currName);
            //add a event when the option node is clicked, insert the clicked value into the 
            //appropriate search box
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
        //because the search box for mobile version is different, therefore need a way
        //to customize its style
        theCont.style.backgroundColor = "white"; 
        if (!isSearchMain && screen.width <= 800.0) {
            theCont.style.backgroundColor = "rgb(64,64,64)";
            theCont.style.marginTop = "10px";
            theCont.style.color = "white";
            theCont.style.borderTop = "2px solid rgb(100,100, 100)"
        }
    }else {
        //if no names found to match the string provided by the user, make the
        //search transparent and remove all style in the datalist element
        makeSearchTransparent(theCont)
        theCont.style = "";
    }
}

//insert text into the container
function insertValue (name) {
    let ele = (isSearchMain) ? 
            document.getElementById("mainSearchBox") :
            document.getElementById("secondarySearch") ;
    
    ele.value = name;
    clearBoth();
}

//making the autocomplete item list to go transparent
function makeSearchTransparent (cont) {
    cont.style.backgroundColor = "transparent";
}

//clearing both search box 
function clearBoth () {
    makeSearchTransparent(cityCont)
    makeSearchTransparent(smallCityCont)
    cityCont.innerHTML = "";
    smallCityCont.innerHTML = "";
}