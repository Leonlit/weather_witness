let navOpen = false;
let pageOpen = false;
let navDisabled = false;
let pageDisabled = false;

window.onscroll = () => {
	if (screen.width < 700) adjustNavCont();
}

function openClosePage () {
	let page = document.getElementById("aboutPage");
	if (!pageDisabled) {
		if (pageOpen) {
			pageOpen = false;
			page.classList.remove("fade-in-left-03");
			page.classList.add("fade-out-03");
			lockPage(300);
			setTimeout(() => {
				page.style.display = "none";
			}, 300);
		}else {
			if (navOpen) openCloseNav();
			pageOpen = true;
			lockPage(300);
			page.style.display = "block";
			page.classList.remove("fade-out-03");
			page.classList.add("fade-in-left-03");
		}
	}
}

function lockNav (time) {
	navDisabled = true;
	setTimeout(() => {
		navDisabled = false;
	}, time);
}

function lockPage (time) {
	pageDisabled = true;
	setTimeout(() => {
		pageDisabled = false;
	}, time);
}

function adjustNavCont () {
	if (!navOpen) {
		let navCont = document.getElementById("navBg");
		let windowViewTop = window.scrollY;
		if (windowViewTop <= 160) {
			navCont.style.backgroundColor = `rgba(255,255,255 , ${windowViewTop/160})`;
		}
		if (windowViewTop >= 160) {
			navCont.style.backgroundColor = `rgba(255,255,255, 1)`;
		}
	}
}

function openCloseNav() {
	let navItems = document.getElementById("navItems");
	let navTitle = document.getElementById("mainTitle");
	let dropDown = document.getElementById("dropDown");
	let navBar = dropDown.getElementsByTagName("div");
	let shader = document.getElementById("shader");

	if (!navDisabled) {
		if (navOpen){
			adjustNavCont();
			navTitle.className = "turn-black";
			navBar[1].className = "appear";
			navBar[0].className = "rotateBackNav45";
			navBar[2].className = "rotateBackNav-45";
			shader.classList.remove("appear");
			shader.classList.add("hidden")
			navItems.classList.add("fade-out-up");
			navItems.classList.remove("fade-in-down");
			navOpen = false;

			lockNav(400);

			setTimeout(()=>{
				navBar[0].style.transform = "translate(0, 0) rotate(0deg)";
				navBar[2].style.transform = "translate(0, 0) rotate(0deg)";
				navBar[0].style.backgroundColor = "black";
				navBar[2].style.backgroundColor = "black";
				navBar[1].style.opacity = 1;
				shader.style.display = "none";
				shader.style.opacity = "0";
				navTitle.style.color = "black";
			}, 400);
			
			setTimeout(()=>{
				navItems.style.top = "-260px";
			}, 500);
		
		}else {
			navTitle.className = "turn-white";
			navBar[1].className = "hidden";
			navBar[0].className = "rotateNav45";
			navBar[2].className = "rotateNav-45";
			navItems.classList.add("fade-in-down");
			navItems.classList.remove("fade-out-up");
			navOpen = true;
			shader.style.opacity = "0";
			shader.style.display = "block";
			shader.classList.remove("hidden");
			shader.classList.add("appear");

			lockNav(400);

			setTimeout(()=> {
				navBar[1].style.opacity = 0;
			},200)

			setTimeout(()=>{
				navBar[0].style.transform = "translate(0, 10px) rotate(45deg)";
				navBar[2].style.transform = "translate(0, -5px) rotate(-45deg)";
				navBar[0].style.backgroundColor = "white";
				navBar[2].style.backgroundColor = "white";
				shader.style.opacity = "1";
				navTitle.style.color = "white";
			}, 400);
			setTimeout(()=>{
				navItems.style.top = "0px";
			}, 500);
		}
	}
}