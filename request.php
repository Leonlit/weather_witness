<?php
	define("URL", "https://api.openweathermap.org/data/2.5/weather");
	define("FURL", "https://api.openweathermap.org/data/2.5/forecast");
	$query = "";
	//if city is set with values, construct and request the API URL and pass it to client
	//$lastTimestamp = $_COOKIE["lastTimeStamp"];

	if (isset($_GET["city"]) && isset($_GET["type"])) {
		$city = filter_var($_GET["city"], FILTER_SANITIZE_STRING);
		$key = "";
		try {
			$key = getenv('weatherAPI');
		}catch (Exception $err) {
			throw new Exception("1");
		}
		$URLType = ($_GET["type"] == 0) ? URL : FURL;
		$query = $URLType."?q=".$city."&appid=".$key;
		//constructing the url for getting the API data 
		if ($key != "") {
			try {
				//if ($lastTimestamp)
				//getting the text printed on that url as string
				$json = file_get_contents($query, false, stream_context_create(['http' => ['ignore_errors' => true]]));

				//setcookie("lastTimeStamp", round(microtime(true) * 1000), time() * 60 * 2);
				//echoing the variable so that data could be passed to the client script
				echo $json;
			}catch (Exception $err) {
				//server down
				echo "1";
			}
	}
	}
?>