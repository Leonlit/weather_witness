function timeFormater (unixTimestamp) {
    //buiding the time
    let symbol,
        day = "D",
        date = new Date(unix*1000),
        hour = date.getHours(),
        minute = "0" + date.getMinutes();
    
    minute = minute.substr(-2);

    if (hour>12.00) {
        if (hour > 19) {
            day = "N"
        }
        hour -= 12;
        symbol = "pm";
    }else {
        if (hour < 6) {
            day = "N"
        }
        symbol = "am"
    }

    return `${hour}:${minute} ${symbol}`;
}