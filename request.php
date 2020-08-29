<?php
	define("URL", "https://api.openweathermap.org/data/2.5/weather");
	define("FURL", "https://api.openweathermap.org/data/2.5/forecast");
	$query = "";
	//if city is set with values, construct and request the API URL and pass it to client

	if (isset($_GET["city"]) && isset($_GET["type"]) && $_GET["city"] != "" && $_GET["type"] != "") {
		$city = filterData($_GET["city"]);
		$key = "";
		try {
			//$key = getenv('weatherAPI');
			$key = file_get_contents("secret/apikey.txt");
		}catch (Exception $err) {
			throw new Exception("1");
		}
		fetchData($city, $key);
	}

	function fetchData ($city, $key) {
		$URLType = (filterData($_GET["type"]) == 0) ? URL : FURL;
		$query = $URLType."?q=".$city."&appid=".$key;

		$currSeconds = time();
		$expireTime = $currSeconds + 30;
		$resetTime = time() - 30;

		//constructing the url for getting the API data 
		if ($key != "") {
			try {
				cookieManaging($currSeconds, $expireTime);
				//getting the text printed on that url as string
				$json = file_get_contents($query, false, stream_context_create(['http' => ['ignore_errors' => true]]));
				//echoing the variable so that data could be passed to the client script
				echo $json;
			}catch (Exception $err) {
				if (($err->getMessage()) == "2") {
					//rate limiting to 1 request per minute.
					echo "2";
				}else {
					//server down
					echo "1";
					//resettting request as the request failed
					setcookie("lastTimeStamp", $resetTime);
					setcookie("requestCount", $resetTime);
					setcookie("delayCount", $resetTime);
				}
			}
		}
	}

	//filtering data
	function filterData ($string) {
		return htmlspecialchars(filter_var($string, FILTER_SANITIZE_STRING), ENT_QUOTES);
	}

	//function for managing cookies
	function cookieManaging ($currSeconds, $expireTime) {
		//if any of the cookie is not set, reset all cookie value
		if (!isset($_COOKIE["lastTimeStamp"]) || !isset($_COOKIE["requestCount"]) || !isset($_COOKIE["delayCount"])) {
			setcookie("lastTimeStamp", $currSeconds, $expireTime);
			setcookie("requestCount", 1, $expireTime);
			setcookie("delayCount", 0, $expireTime);
		}else{
			//if all three cookies 
			$lastTimestamp = $_COOKIE["lastTimeStamp"];
			$requestCount = $_COOKIE["requestCount"];
			$delayCount = $_COOKIE["requestCount"];
			//if the last timestamp compared to the current timestamp is less than 30 second and 
			//the request counted is equal to 10 -> used API request for 5 times , throw error with message 2
			//which indicates rate limits reached.
			//The app request the data from API server twice for every city search.
			//odds numbered request is for current weather, while the even numbered request is for requesting 
			//weather forecast data.
			if ($currSeconds - $lastTimestamp < 30000 && $requestCount == 10) {
				throw new Exception("2");
			}else if ($requestCount < 10) {
				//while if the request count is is less than 10 and the last request time is less than 30 seconds
				//update the two cookies requestCount and delayCount value
				//delayCount is used to increase the timeout time for user to request new API data from the server
				setcookie("requestCount", ++$requestCount, $expireTime);
				setcookie("delayCount", ++$delayCount, $expireTime);
			}else{
				//if the last timestamp exceeded 30 seconds, then it means that our app will need to reset the value for 
				//the cookies as the time window has been resetted.
				setcookie("lastTimeStamp", $currSeconds, $expireTime);
				setcookie("delayCount", 0, $expireTime);
			}
		}
	}
?>