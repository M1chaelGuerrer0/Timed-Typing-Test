const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
let originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

let timer = [0, 0, 0]; // minutes, seconds, hundredths
let interval;
let timerRunning = false;

const paragraphs = [
    "I am one with the force and the force is with me.",
    "Somehow the emperor returned and they fly now.",
    "Where we are going we do not need roads.",
    "What will you have after five hundred years?",
    "How do we know when the hug is done?"
];

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

        saveScore(); // save the score to localStorage
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
    
    setNewText(); // load a new random text for the next test
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck);
resetButton.addEventListener("click", reset, false);


// other functions:
function getTotalTime() { // returns total time in seconds to compare
    return timer[0] * 60 + timer[1] + timer[2] / 100;
}

function saveScore() {
    let score = getTotalTime();
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    // prevent duplicate scores (with small tolerance for floating point)
    const isDuplicate = scores.some(s => Math.abs(s - score) < 0.01);

    if (!isDuplicate) {
        scores.push(score);
    }
    
    scores.sort((a, b) => a - b); // sort scores in ascending order

    scores = scores.slice(0, 3); // keep only top 3 scores
    
    localStorage.setItem("scores", JSON.stringify(scores));
    displayScores(); // refresh the displayed scores
}

function displayScores() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    let scoreList = document.getElementById("score-list");

    scoreList.innerHTML = ""; // clear the list

    scores.forEach(score => {
        let li = document.createElement("li");
        li.textContent = score.toFixed(2) + " seconds";
        scoreList.appendChild(li);
    });
}

let lastIndex = 0; // to track the last used index for random text
function getRandomText() {
    let randomIndex;
    
    do {
        randomIndex = Math.floor(Math.random() * paragraphs.length);
    } while (randomIndex === lastIndex); // ensure a different text is selected
    
    lastIndex = randomIndex; // update last index

    return paragraphs[randomIndex];
}

function setNewText() {
    let newText = getRandomText();
    document.querySelector("#origin-text p").innerHTML = newText;
    originText = newText;
}

displayScores(); // display scores on page load