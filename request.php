<?php
	define("URL", "https://api.openweathermap.org/data/2.5/weather");
	define("FURL", "https://api.openweathermap.org/data/2.5/forecast");
	$query = "";
	//if city is set with values, construct and request the API URL and pass it to client

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
				$ms = round(microtime(true) * 1000);
				if (!isset($_COOKIE["lastTimeStamp"]) || !isset($_COOKIE["requestCount"]) || !isset($_COOKIE["delayCount"])) {
					setcookie("lastTimeStamp", $ms, time() + 30);
					setcookie("requestCount", 1, time() + 30);
					setcookie("delayCount", 0, time() + 30);
				}else{
					$lastTimestamp = $_COOKIE["lastTimeStamp"];
					$requestCount = $_COOKIE["requestCount"];
					$delayCount = $_COOKIE["requestCount"];
					if ($ms - $lastTimestamp < 10000 && $requestCount == 10) {
						throw new Exception("2");
					}else if ($requestCount < 10) {
						setcookie("requestCount", ++$requestCount, time() + 30);
						setcookie("delayCount", ++$delayCount, time() + 30);
					}else{
						setcookie("lastTimeStamp", $ms, time() + 30);
						setcookie("delayCount", 0, time() + 30);
					}
				}
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
				}
			}
		}
	}
?>