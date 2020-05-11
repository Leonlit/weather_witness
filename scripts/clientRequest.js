function getJson (param) {
	let requestQuery, place;

	if (param === undefined) {
		place = document.getElementById("city").value;
	}else {
		place = param;
	}
	requestQuery = `request.php?city=${place}`;

	try {
		fetch(requestQuery, {
			method: 'get', 
		}).then((response) => {
			//if  the response status isn't ok, don't do anything
			if (response.status >= 200 && response.status < 300) {
				//return data in JSON form
				return response.json();
			}else { 
				throw new Error(response.statusText);
			}
		}).then(JSON => {
			//pass the data to a function to store the json data globally
			try {
				log(JSON);	
				displayData(parsedJSON);
			}catch (err) {
				log(`${err}\n\ncannot parse JSON data`);
			}
		});
	}catch {
		//customAlert("something went wrong!!! Please make sure you enter your city name correctly or simply try again")
		clientLog("Something went wrong when the server send an request to the API, Try again later");
	}
}

function displayData (data) {
	let icon,
		city = data["name"],
		country = data["sys"]["country"],
		weather = data["weather"][0]["description"],
		temp = data["main"]["temp_max"] - 273.15,
		id = data["weather"][0]["id"],
		unix = data["dt"], 
		humidity = data["main"]["humidity"], 
		pressure = data["main"]["pressure"],
		feelsLike = data["main"]["feels_like"];

	let time = timeFormater(unix);
	
}

let log = msg => console.log(msg);