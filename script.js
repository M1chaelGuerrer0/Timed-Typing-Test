const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

let timer = [0, 0, 0]; // minutes, seconds, hundredths
let interval;
let timerRunning = false;

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    return (time <= 9 ? "0" : "") + time;
}
// Run a standard minute/second/hundredths timer:
function runTimer() {
    let currentTime = 
        leadingZero(timer[0]) + ":" +
        leadingZero(timer[1]) + ":" +
        leadingZero(timer[2]);

    theTimer.innerHTML = currentTime;
    timer[2]++; // hundredths

    if (timer[2] == 100) {
        timer[2] = 0;
        timer[1]++; // seconds
    }
    if (timer[1] == 60) {
        timer[1] = 0;
        timer[0]++; // minutes
    }
}
// Match the text entered with the provided text on the page:
function spellCheck() {
    let textEntered = testArea.value;
    let originTextMatch = originText.substring(0, textEntered.length);

    if (textEntered === originText) {
        testWrapper.style.borderColor = "green"; // correct finish
        clearInterval(interval); // stop the timer
    }
    else if (textEntered === originTextMatch) {
        testWrapper.style.borderColor = "blue"; // correct so far
    }
    else {
        testWrapper.style.borderColor = "red"; // incorrect
    }
}
// Start the timer:
function start() {
    if (!timerRunning) {
        timerRunning = true;
        // Start the timer at 0.01 second intervals:
        interval = setInterval(runTimer, 10);
    }
}
// Reset everything:
function reset() {
    clearInterval(interval);
    interval = null;
    timer = [0, 0, 0];
    timerRunning = false;
    
    testArea.value = "";
    theTimer.innerHTML = "00:00:00";

    testWrapper.style.borderColor = "grey";
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck);
resetButton.addEventListener("click", reset, false);