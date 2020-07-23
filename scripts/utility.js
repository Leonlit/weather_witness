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

let errorShown = false;
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