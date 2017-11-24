// * Copyright (C) 2017 Anurag Banerjee
// * All rights reserved.
// * 
// * This file is part of 100-web-projects.
// * 
// *******************************************************

(function () {
	const timer = document.querySelector("#timer");
	let timeRemaining = 0;
	let isPaused = false;
	let ticking = false;

	const buzzSound = new Audio('clock-buzz.mp3');
	buzzSound.load();
	buzzSound.loop = true;
	buzzSound.preload = true;

	attachListeners();

	// 0) attach event handlers to UI elements
	function attachListeners() {
		// timer lifecycle functions
		document.querySelector("#start").addEventListener("click", createTimer);
		document.querySelector("form").addEventListener("submit", createTimer);
		document.querySelector("#pause").addEventListener("click", pauseTimer);
		document.querySelector("#dismiss").addEventListener("click", dismissTimer);
		document.querySelector("#reset").addEventListener("click", destroyTimer);

		// spacebar pauses timer if running, else dismisses sound
		document.addEventListener("keydown", (e) => {
			if (e.keyCode === 32) {
				if (ticking) {
					pauseTimer();
					updateTimer(timeRemaining);
				} else {
					dismissTimer();
				}
			}
		});
	}

	// *************************
	// Timer Lifecycle Functions
	// *************************

	// 1) consume input fields to begin a timer
	function createTimer(e) {
		// stop form request from loding
		if (e) {
			e.preventDefault();
		}

		// get input values
		let seconds = document.querySelector("input#seconds").value || 0;
		let minutes = document.querySelector("input#minutes").value || 0;
		let hours = document.querySelector("input#hours").value || 0;
		
		// convert target time into seconds
		timeRemaining = 0;
		timeRemaining += parseInt(seconds);
		timeRemaining += parseInt(minutes) * 60;
		timeRemaining += parseInt(hours) * 60 * 60;

		// handle invalid time
		if (timeRemaining === 0 || Number.isNaN(timeRemaining)) {
			// shake if invalid
			timer.animate([
				{transform: "translateX(0)"},
				{transform: "translateX(10px)"},
				{transform: "translateX(0)"},
				{transform: "translateX(-10px)"},
				{transform: "translateX(0)"}
			], {
				duration: 300,
				iterations: 2
			});
			return;
		}

		// set up UI for timer, 
		setLock(true);
		updateTimer(timeRemaining);
		document.querySelector("#start").style.display = "none";
		document.querySelector("#pause").style.display = "initial";

		// begin ticking
		ticking = setInterval(tickTimer, 1000);
	}

	// 2) triggers every second (aka "tick")
	function tickTimer () {
		// do not tick if paused
		if (isPaused) return;

		// tick and update UI
		timeRemaining -= 1;
		updateTimer(timeRemaining);

		// handle end of timer
		if (timeRemaining === 0) {
			finishTimer();
		}
	}

	// 2.5) toggles between paused/resumed and updates UI
	function pauseTimer() {
		isPaused = !isPaused;
		document.querySelector("#pause").innerText = isPaused? "resume" : "pause";
	}

	// 3) update UI based on param (new_time in seconds)
	function updateTimer(new_time) {
		const hours = Math.floor(new_time / 3600);
		new_time -= 3600 * hours;

		const minutes = Math.floor(new_time / 60);
		new_time -= 60 * minutes;

		const seconds = Math.floor(new_time);
		new_time -= seconds;

		document.querySelector("input#hours").value = hours == 0? '' : String(hours);
		document.querySelector("input#minutes").value = minutes == 0? '' : String(minutes);
		document.querySelector("input#seconds").value = seconds == 0? '' : String(seconds);
	}

	// 4) triggered when timeRemaining = 0
	function finishTimer() {
		// play finishing buzz
		buzzSound.play();

		// update UI to show dismiss button to stop sound
		document.querySelector("button#start").style.display = "none";
		document.querySelector("button#reset").style.display = "none";
		document.querySelector("button#pause").style.display = "none";
		document.querySelector("button#dismiss").style.display = "initial";

		stopTicking();
	}

	// 5) stop sound and resets using destroyTimer()
	function dismissTimer() {
		document.querySelector("button#start").style.display = "initial";
		document.querySelector("button#reset").style.display = "initial";
		document.querySelector("button#pause").style.display = "none";
		document.querySelector("button#dismiss").style.display = "none";
		destroyTimer();
	}


	// *************************
	// Helper Functions
	// *************************

	function stopTicking() {
		if (ticking) {
			clearInterval(ticking);
			ticking = false;
		}
	}

	function stopSound() {
		buzzSound.pause();
		buzzSound.currentTime = 0;
	}

	// reset to original state
	function destroyTimer() {
		stopTicking();
		stopSound();

		// reset pausing
		while (isPaused) {
			pauseTimer()
		}

		// update UI
		document.querySelector("#start").style.display = "initial";
		document.querySelector("#pause").style.display = "none";
		setLock(false);
		updateTimer(0);
	}

	// updates UI to make numbers read-only
	function setLock(locked) {
		[].map.call(document.querySelectorAll("input"), (el) => {
			el.disabled = locked;
		});
	}
})()