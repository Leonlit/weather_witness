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

function  getDayType (hour) {
    console.log(hour)
    return (hour >= 19 || hour <= 6) ? "N": "D";
}

function getDayOrNight (hour) {
    return (hour>=12.00) ? "PM" : "AM";
}
