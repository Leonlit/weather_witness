<?php
	//feature
	/*
		- JSON data caching
		- Spam prevention using cookie (not foul proof)
		- user input sanitized
		- Api key not exposed in 
		
	*/
	require(__DIR__."/startup.php");

	$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
	$dotenv->load();

	define("URL", "https://api.openweathermap.org/data/2.5/weather");
	define("FURL", "https://api.openweathermap.org/data/2.5/forecast");
	define("ROOT_DiR", "/");
	define("DOMAIN_NAME", $_SERVER['HTTP_HOST']);
	$query = "";
	//if city is set with values, construct and request the API URL and pass it to client

	if (isset($_GET["city"]) && isset($_GET["type"]) && $_GET["city"] != "" && $_GET["type"] != "") {
		$city = filterData($_GET["city"]);
		$key = "";
		try {
			$key = $_ENV['WEATEHR_API'];;
			if (!$key) {
				throw new Exception();
			}
			fetchData($city, $key);
		}catch (Exception $err) {
			//An unexpected error occured
			echo "3";
		}
	}else {
		//echo "The API needs two arguments to be able to function. Please use the website instead.";
	}

	function fetchData ($city, $key) {
		$requestType = filterData($_GET["type"]);
		$URLType =  $requestType === "0" ? URL : (
				$requestType === "1" ? FURL : ""
		);
		//constructing the url for getting the API data 
		if ($URLType != "" && $key != "") {
			$query = $URLType."?q=".$city."&appid=".$key;

			$currSeconds = time();
			$expireTime = $currSeconds + 30;
			$resetTime = time() - 30;

			try {
				cookieManaging($currSeconds, $expireTime);
				$contents = managingCacheFile($city, $currSeconds, $requestType);
				if (!empty($contents)) {
					echo htmlspecialchars_decode($contents);
				}else {
					//getting the text printed on that url as string
					$json = htmlspecialchars(file_get_contents(filterData($query), false, stream_context_create(['http' => ['ignore_errors' => true]])));
					//saving the file for cache
					saveCacheFile($city, $currSeconds, $json, $requestType);
					//echoing the variable so that data could be passed to the client script
					header("Content-Type: application/json; charset=UTF-8");
					echo htmlspecialchars_decode($json);
				}
			}catch (Exception $err) {
				if (($err->getMessage()) == "2") {
					//rate limiting to 1 request per minute.
					echo "2";
				}else {
					//server down
					echo "1";
					//resettting request as the request failed
					setcookie("lastTimeStamp", $resetTime, null, ROOT_DiR, DOMAIN_NAME, true, true);
					setcookie("requestCount", $resetTime, null, ROOT_DiR, DOMAIN_NAME, true, true);
					setcookie("delayCount", $resetTime, null, ROOT_DiR, DOMAIN_NAME, true, true);
				}
			}
		}
	}

	//filtering data
	function filterData ($string) {
		return filter_var($string, FILTER_SANITIZE_STRING);
	}

	//function for managing cookies
	function cookieManaging ($currSeconds, $expireTime) {
		//if any of the cookie is not set, reset all cookie value
		if (!isset($_COOKIE["lastTimeStamp"]) || !isset($_COOKIE["requestCount"]) || !isset($_COOKIE["delayCount"])) {
			setcookie("lastTimeStamp", $currSeconds, $expireTime, ROOT_DiR, DOMAIN_NAME, true, true);
			setcookie("requestCount", 1, $expireTime, ROOT_DiR, DOMAIN_NAME, true, true);
			setcookie("delayCount", 0, $expireTime, ROOT_DiR, DOMAIN_NAME, true, true);
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
			if ($currSeconds - $lastTimestamp < 30 && $requestCount == 10) {
				echo "2";
			}else if ($requestCount < 10) {
				//while if the request count is is less than 10 and the last request time is less than 30 seconds
				//update the two cookies requestCount and delayCount value
				//delayCount is used to increase the timeout time for user to request new API data from the server
				setcookie("requestCount", ++$requestCount, $expireTime, ROOT_DiR, DOMAIN_NAME, true, true);
				setcookie("delayCount", ++$delayCount, $expireTime, ROOT_DiR, DOMAIN_NAME, true, true);
			}else{
				//if the last timestamp exceeded 30 seconds, then it means that our app will need to reset the value for 
				//the cookies as the time window has been resetted.
				setcookie("lastTimeStamp", $currSeconds, $expireTime, ROOT_DiR, DOMAIN_NAME, true, true);
				setcookie("delayCount", 0, $expireTime, ROOT_DiR, DOMAIN_NAME, true, true);
			}
		}
	}

	//managing cache file on weather data
	//the function takes in the location name, current time (in unix) and the type of request 
	//(current data or forecasted data)
	function managingCacheFile ($country, $time, $type) {
		//first check if there's a file saved for the location with the same type
		$cacheFileArray = checkCacheFile($country, $type);
		//if there's a cache file for it and the timestamp is in the range (within 100 seconds
		// from when the file is created), get the content of the file and return back to the fetchData function
		if (!empty($cacheFileArray)) {
			$cacheFile = $cacheFileArray[0];			//getting the first occurence of the data (glob returns an array)
			$tokens = explode("-", $cacheFile);			//Separate the filename into sections while using - as the delimiter
			$timeStamp = intval($tokens[2]);			//then get the timestamp of the file by getting the third item (need to take into account the folder name)
			if ($time - $timeStamp < 100) {				//if the timestamp is within the range of 100 second from the creation of the file
				return htmlspecialchars(file_get_contents($cacheFile));	// return the file content to the fetchData function
			}else {
				//else if the time range are over 100 seconds the system will need to refetch the data
				//from the api server
				return false;							
			}
		}else {
			//if there's no file found with the correct name, means the 
			//system need to fetch the data from the API server
			return false;
		}
	}

	//after checking and the system need to re-fetch the data from the api server, save the data into a file in the data-cache folder
	//the function takes in the location name, the time in unix, the json data and the type of the request
	function saveCacheFile ($country, $time, $text, $type) {
		//generating the filename with specified format foldername/location-timestamp-type-.txt
		$fileName = "data-cache/{$country}-{$time}-{$type}-.txt";	
		try {
			//check if there's a previously saved file of the same name
			$cached = checkCacheFile($country, $type);
			//the returned data is not an empty array, means that previously
			//there's data saved for that location with the same filename
			//but the timestamp is not valid anymore 
			if (!empty($cached)) {
				//for each item found, delete the files							
				foreach($cached as $item) {				
					unlink($item);
				}
			}
			//write the content of the fecth request into the file
			file_put_contents($fileName, $text);
			return true;
		}catch (Exception $ex) {
			//An unexpected error occured
			echo "3";
			return false;
		}
	}

	//check if there's a file for the location of the same type
	function checkCacheFile ($country, $type) {
		$file = glob("data-cache/{$country}*-{$type}-.txt");
		return !empty($file) ? $file : false;
	}
?>
