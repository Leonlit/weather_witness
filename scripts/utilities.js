'use strict'
//formating time from unix milisecond time to readable time for user in 12 hour format
function timeFormater (unixTimestamp) {
    //buiding the time
    let date = new Date(unixTimestamp*1000),
        hour = getHour(unixTimestamp),
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
    return (hour >= 19 || hour <= 6) ? "N": "D";
}

//determine if its pm or am
function getDayOrNight (hour) {
    return (hour>=12.00) ? "PM" : "AM";
}

//generating the icon url
function iconrURL (unix, id) {
	const currHour = getHour(unix)
    const dayOrNight = getDayType(currHour);
    return`icons/${getIconsName(id, dayOrNight)}.png`;
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

const cityCont = document.getElementById("cityList"),
    smallCityCont = document.getElementById("cityListSmall");

//construct the autocomplete list for the appropriate search box
function constructOptions (names) {
    founded = [];
    const theCont = (isSearchMain) ? cityCont : smallCityCont;
    //clearing the autocomplete item for both search box so that the screen 
    //wont be so messy
    clearBoth();
    //getting the search box that initiated the search
    const searchBox = (isSearchMain) ? "mainSearchBox" : "secondarySearch";
    const value = document.getElementById(searchBox).value ;
    
    //if the value of the search box became empty, make the element transparent
    if (value == "") {
        makeSearchTransparent(theCont);
        return false;
    }
    generateList(names, value, theCont);
}

//generating the city list for character provided
function generateList(names, value, theCont) {
    let found = 0;
    const size = names.length;
    for (let i = 0; i < size; i++) {
        //if the number of result found is 30 break the loop (limiting the value to loop through)
        if (found == 30) {
            break;
        }
        if  ( ((names[i].toLowerCase()).indexOf(value.toLowerCase())) > -1) { 
            found++;
            const node = document.createElement("option");
            const currName = names[i];

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

//using the icon code provided by OpenWeatherMap API, use the appropriate icon for the weather condition
function getIconsName (id, DON) {
	let icon;
	if (id <300 && id>=200) {
		icon = "thunderstorm_" + DON;
	}else if (id>=300 && id<400) {
		icon = "drizzle";
	}else if (id>=500 && id<600) {
		icon = "rain_" + DON;
	}else if (id>=600 && id <700) {
		icon = "snow";
	}else if (id >700 && id<800) {
		icon = "atmosphere";
	}else if (id == 800) {
		icon = "clear_" + DON;
	}else if (id==801) {
		icon = "broken_clouds_"+DON;
	}else if (id>801) {
		icon = "cloud_scattered";
	}
	return icon;
}

//getting cookies value
function getCookieValue(value) {
    const cookieStrings = document.cookie.match('(^|;)\\s*' + value + '\\s*=\\s*([^;]+)');
    return cookieStrings ? cookieStrings.pop() : '';
}

//checking if the value is an integer 
function isInteger(value) {
    if (isNaN(value)) {
      return false;
    }
    // 3.01 | 0 = 3
    // 3 != 3.01 
    const x = parseFloat(value);
    return (x | 0) === x;
}

//adjusting navigation box shadow
function adjustNavShadowOnSetup () {
    if (window.innerWidth < 800) {
		const navShadow = document.getElementById("navContainer");
		navShadow.style.boxShadow = `0px 1px 10px rgba(128, 128, 128 , 0)`;
	}
}