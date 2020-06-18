<!DOCTYPE html>
<html>
    <head>
        <title>Weather Viewer - created by leonlit</title>
        <meta charset="UTF-8">
        <meta name="author" content="leonlit">
        <meta name="description" content="A simple weather app with forecast functionality using third-party API">
        <meta name="keywords" content="HTMl, CSS, JS, OpenWeatherMapAPI, HobbyProject">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/menuMobile.css"/>
        <link rel="stylesheet" href="css/menuTablet.css"/>
        <link rel="stylesheet" href="css/dataStructuring.css"/>
    </head>
    <body>
        <!--Navigation Section-->
        
        <div id="navItems" class="fixedEle ">
            <li><a class="navLink" onclick="openClosePage()">About</a></li>
            <li><a class="navLink" targt="_blank" href="https://github.com/Leonlit/weather_viewer">Source Code</a></li>
            <li><input type="text" placeholder="city name" id="secondarySearch"/></li><span id="searchIcon">Go</span>
        </div>
        <div id="navBg" class="fixedEle absolutePointEle"></div>
        <nav id="navContainer" class="fixedEle absolutePointEle">
            <span id="mainTitle">Weather Viewer</span>
            <div id="dropDown" onclick="openCloseNav()">
                <div></div>
                <div></div>
                <div></div>
            </div>
            
        </nav>
        <div id="shader" class="fixedEle absolutePointEle" onclick="openCloseNav()"></div>
        
        <!--Weather Info-->
        <div id="weatherDisplay">
            <div id="mainInfo" class="textCenter dataContainer">
                <div id="temperature">28 &#8451;</div>
                <img src="icons/thunderstorm_N.png" id="weatherIcon">
                <div id="weather">raining</div>
                <div id="location">Seremban, MY</div>
            </div>

            <div id="additionalInfo" class="dataContainer">
                <div>Feels like <span id="feels_like">29.5 &#8451;</span></div>
                <div>Maximun Temperature <span id="maxTemperature">31 &#8451;</span></div>
                <div>Minimum Temperature <span id="minTemperature">28 &#8451;</span></div>
                <div>Pressure <span id="pressure">124</span></div>
                <div>Humidity <span id="humidity">78%</span></div>
                <div>Cloudiness <span id="cloudiness">40%</span></div>
                <div>Visibility <span id="visibility">12.3km</span></div>
            </div>
            
            <div id="forecast" class="dataContainer">
                <div id="forecastData" class="dataSection">
                    <select id="forecastType" name="forecastChoose" class="forecastConfigure"  onchange="changeForecastData()">
                        <option value="temperature">Temperature</option>
                        <option value="percipitation">Percipitation</option>
                        <option value="wind">Wind</option>
                    </select>
                    <select id="forecastDay" name="forecastDay" class="forecastConfigure"  onchange="changeForecastData()">
                        <option value="1">12/5</option>
                        <option value="2">13/5</option>
                        <option value="3">14/5</option>
                    </select>
                    <div class="scrollable">
                        <div id="forecastDataCont">
                            <div class="forecastItems">
                                <div>12AM</div>
                                <img class="forecastIcon" src="icons/thunderstorm_N.png"/>
                                <div>32 &#8451;</div>
                                <div>3212 hpa</div>
                            </div>
                            
                            <div class="forecastItems">
                                <div class="forecastTime">12AM</div>
                                <img class="forecastIcon" src="icons/thunderstorm_N.png"/>
                                <div class="forecastTemp">32 &#8451;</div>
                                <div class="forecastTemp">32 hpa</div>
                            </div>

                            <div class="forecastItems">
                                <div class="forecastTime">12AM</div>
                                <img class="forecastIcon" src="icons/thunderstorm_N.png"/>
                                <div class="forecastTemp">32 &#8451;</div>
                                <div class="forecastTemp">32 hpa</div>
                            </div>
                            <div class="forecastItems">
                                <div class="forecastTime">12AM</div>
                                <img class="forecastIcon" src="icons/thunderstorm_N.png"/>
                                <div class="forecastTemp">32 &#8451;</div>
                                <div class="forecastTemp">32 hpa</div>
                            </div>

                            <div class="forecastItems">
                                <div class="forecastTime">12AM</div>
                                <img class="forecastIcon" src="icons/thunderstorm_N.png"/>
                                <div class="forecastTemp">32 &#8451;</div>
                                <div class="forecastTemp">32 hpa</div>
                            </div>

                            <div class="forecastItems">
                                <div class="forecastTime">12AM</div>
                                <img class="forecastIcon" src="icons/thunderstorm_N.png"/>
                                <div class="forecastTemp">32 &#8451;</div>
                                <div class="forecastTemp">32 hpa</div>
                            </div>

                            <div class="forecastItems">
                                <div class="forecastTime">12AM</div>
                                <img class="forecastIcon" src="icons/thunderstorm_N.png"/>
                                <div class="forecastTemp">32 &#8451;</div>
                                <div class="forecastTemp">32 hpa</div>
                            </div>

                            <div class="forecastItems">
                                <div class="forecastTime">12AM</div>
                                <img class="forecastIcon" src="icons/thunderstorm_N.png"/>
                                <div class="forecastTemp">32 &#8451;</div>
                                <div class="forecastTemp">32 hpa</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        
        </div>

        <div id="mainPage" class="fade-in-left fixedCenter">
            <div class="fixedCenter">
                <input id="mainSearchBox" class="textCenter" placeholder="City name"/>
                <input type="submit" value="Go" class="mainBtn" onclick="triggerData()"/>
            </div>
        </div>

        <div id="aboutPage" class="fixedEle absolutePointEle">
            <span id="close" onclick="openClosePage()">X</span>
            <h2>About Page</h2><hr/>
            <p>
                Welcome to my weather app (weather_viewer). It uses the weather API from <a href="https://openweathermap.org/" target="_blank" class="pageLink">OpenWeatherMap </a>, 
                and is built with HTML, CSS and JS. <br/><br/>This app allow you to check for the current weather of a location (city or country name), as well as the forecast weather for 
                that location. The forecast data is separated using three section: <br>
                <ul>
                    <li>Temperature - which also shows the weather and pressure reading</li>
                    <li>Percipitation - shows the rain volume for a particular time</li>
                    <li>Wind - shows the wind direction and speed</li>
                </ul><br>
                The data are also separated by date of 3 different days.
            </p>

            <h2>Contact Me</h2>
            <p>if you have any suggestion, critics or you found out a bug, please be kindly to let me know through any of the following methods.</p>
            <br>
            <ul>
                <li><a class="pageLink" href="mailto:leonlit123@gmail.com" target="_blank">Email</a></li>
                <li><a class="pageLink" href="https://www.reddit.com/user/scrolion" target="_blank">Reddit</a></li>
                <li><a class="pageLink" href="https://twitter.com/leonlit" target="_blank">Twitter</a></li>
            </ul>
        </div>

        <footer>Developed by Leonlit</footer>
    </body>
</html>

<script src="scripts/clientRequest.js"></script>
<script src="scripts/utility.js"></script>
<script src="scripts/forecast.js"></script>
<script src="scripts/userInteraction.js"></script>