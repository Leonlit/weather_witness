
function showForecast () {
	let footer = document.getElementsByTagName("footer")[0];
	let place = document.getElementById("mainSearchBox").value;
	let query = `request.php?city=${place}&type=1`;
	
	footer.style.position = "relative";

	
}