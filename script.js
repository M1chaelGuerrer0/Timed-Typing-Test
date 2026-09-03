const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
let originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

let interval;
let timerRunning = false;
let startTime = 0;
let elapsedTime = 0;

const paragraphs = [
    "Learning to build software takes time, but every project is an opportunity to improve. Keep creating, keep experimenting, and use each mistake as a chance to learn.",

    "A good developer does not need to know everything. Researching problems, testing solutions, and learning from documentation are important parts of becoming a better programmer.",

    "Small projects can teach valuable lessons. Building something from beginning to end helps you understand how different parts of an application work together.",

    "Technology changes quickly, so developers are always learning new tools and techniques. Staying curious and practicing regularly makes it easier to adapt.",

    "The best way to improve at programming is to build things. Projects do not have to be perfect to be useful, because mistakes can show you what to learn next."
];

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    return (time <= 9 ? "0" : "") + time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
    elapsedTime = performance.now() - startTime;

    let totalHundredths = Math.floor(elapsedTime / 10);
    let minutes = Math.floor(totalHundredths / 6000);
    let seconds = Math.floor((totalHundredths % 6000) / 100);
    let hundredths = totalHundredths % 100;
    let currentTime =
        leadingZero(minutes) + ":" +
        leadingZero(seconds) + ":" +
        leadingZero(hundredths);

    theTimer.innerHTML = currentTime;
}

// Count the number of errors in the input compared to the target text:
let errorCount = 0;
let previousInputLength = 0;
let testFinished = false;

function countErrors(input, target) {
    let errors = 0;

    for (let i = 0; i < input.length; i++) {
        if (input[i] !== target[i]) {
            errors++;
        }
    }

    return errors;
}

// Handle typing, validation, and completion:
function handleInput() {
    // Don't allow the test to restart after it has finished
    if (testFinished) {
        return;
    }

    start();

    const textEntered = testArea.value;

    // Check newly typed characters for errors
    if (textEntered.length > previousInputLength) {
        for (let i = previousInputLength; i < textEntered.length; i++) {
            if (textEntered[i] !== originText[i]) {
                errorCount++;
            }
        }
    }

    previousInputLength = textEntered.length;

    document.getElementById("error-count").textContent = errorCount;

    updateAccuracy(textEntered);

    const originTextMatch = originText.substring(0, textEntered.length);

    if (textEntered === originTextMatch) {
        testWrapper.style.borderColor = "blue";
    } else {
        testWrapper.style.borderColor = "red";
    }

    calculateWPM();

    // Test is complete
    if (textEntered === originText) {
        finishTest();
    }
}

function finishTest() {
    testFinished = true;

    clearInterval(interval);
    timerRunning = false;

    // Get the final exact elapsed time
    elapsedTime = performance.now() - startTime;

    runTimer();

    testWrapper.style.borderColor = "green";

    calculateWPM();
    updateAccuracy(testArea.value);
    saveScore();

    // Prevent further editing
    testArea.readOnly = true;
}

function preventPaste(event) {
    event.preventDefault();
}

// Start the timer:
function start() {
    if (!timerRunning && !testFinished) {
        timerRunning = true;
        startTime = performance.now();
        interval = setInterval(runTimer, 10);
    }
}

// Reset everything:
function reset() {
    clearInterval(interval);
    interval = null;

    timerRunning = false;
    startTime = 0;
    elapsedTime = 0;

    testArea.value = "";
    testArea.readOnly = false;

    theTimer.innerHTML = "00:00:00";

    testWrapper.style.borderColor = "grey";

    errorCount = 0;
    previousInputLength = 0;
    testFinished = false;

    document.getElementById("error-count").textContent = 0;
    document.getElementById("accuracy").textContent = "0%";
    document.getElementById("wpm").textContent = 0;

    testArea.focus();

    setNewText();
}
// Event listeners for input and the reset button:
testArea.addEventListener("input", handleInput);
testArea.addEventListener("paste", preventPaste); // prevents pasting into the textarea
testArea.addEventListener("drop", preventPaste); // prevents dropping text into the textarea
resetButton.addEventListener("click", reset, false);


// other functions:
function getTotalTime() { // returns total time in seconds to compare
    return elapsedTime / 1000;
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

// to track the last used index for random text
let lastIndex = -1;
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

function calculateWPM() {
    let totalChars = testArea.value.length;
    let totalTime = getTotalTime();

    if (totalTime === 0) return; // prevent division by zero

    const wpm = (totalChars / 5) / (totalTime / 60);
    document.getElementById("wpm").textContent = Math.round(wpm);
}

function updateAccuracy(input) {
    if (input.length === 0) {
        document.getElementById("accuracy").textContent = "0%";
        return;
    }

    const accuracy = ((input.length - errorCount) / input.length) * 100;

    document.getElementById("accuracy").textContent =
        Math.max(0, accuracy).toFixed(1) + "%";
}

setNewText(); // load initial text on page load
displayScores(); // display scores on page load