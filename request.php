<?php
	define("URL", "https://api.openweathermap.org/data/2.5/weather");
	define("FURL", "https://api.openweathermap.org/data/2.5/forecast");
	$query = "";
	//if both city and getProcess is set with values, construct and request the API URL and pass it to client 
	if (isset($_GET["city"]) && isset($_GET["type"])) {
		$city = filter_var($_GET["city"], FILTER_SANITIZE_STRING);
		$key = "";
		try {
			$key = getenv('weatherAPI');
		}catch (Exception $err) {
			echo $err->getMessage();
		}
		$URLType = ($_GET["type"] == 0) ? URL : FURL;
		$query = $URLType."?q=".$city."&appid=".$key;
		//constructing the url for getting the API data 
		if ($key != "") {
			try {
				//getting the text printed on that url as string
				$json = file_get_contents($query);
				//if failed request due to wrong input
				if (!$json) {
					throw new Exception();
				}
				//echoing the variable so that data could be passed to the client script
				echo $json;
			}catch (Exception $err) {
				showError("Cannot find the provided city name. Please retry!!!");
			}
	}
	}
?>