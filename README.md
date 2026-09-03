# Timed Typing Test App

## Project Overview

This was a project for my COMP 484 course about web development.

The project was to create a typing test that measures how quickly and accurately a user can type a provided passage.

I expanded the original project by adding multiple typing passages, WPM and accuracy tracking, persistent error counting, and a top-three score system using LocalStorage.

## What I Built

Added five different typing passages that are randomly selected when starting a new test.

Created a timer that tracks minutes, seconds, and hundredths while the user types.

Added WPM, error, and accuracy statistics that update during the test.

Added visual feedback that changes the test border based on whether the user is typing correctly or has made an error.

Added a completion state that stops the timer and prevents the user from changing the completed test.

Added a top-three score system using LocalStorage so scores remain after refreshing the page.

Prevented pasting and drag-and-drop into the typing area.

## JavaScript Techniques

I practiced using:

- `performance.now()` to track elapsed time.
- Event listeners to respond to typing and button clicks.
- `localStorage` to save and retrieve scores.
- DOM manipulation to update the timer, statistics, and score list.

## What I Learned

This project helped me better understand how JavaScript can manage the state of an interactive application.

I learned how to connect user input with timers, statistics, visual feedback, and saved data.

I also learned that small details, such as accurately tracking elapsed time and preventing changes after completing a test, can make an application more reliable.

## Reflection

The most valuable part of this project was taking a simple typing test and expanding it into a more complete application. It gave me more experience thinking about how different parts of an application interact and how to handle edge cases that are not always obvious when first building a project.

## GitHub Pages Link

[https://m1chaelguerrer0.github.io/Timed-Typing-Test/](https://m1chaelguerrer0.github.io/Timed-Typing-Test/)