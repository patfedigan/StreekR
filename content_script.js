/**
 * Copyright (c) 2014 Streekr
 * Content Script for StreekR Chrome Extension
 * This script handles text selection and displays a floating bubble interface
 */

/**
 * Create and configure the selection bubble element
 * The bubble appears when text is selected and serves as a clickable interface
 */
const bubbleDOM = document.createElement('a');
bubbleDOM.setAttribute('id', 'streekr-diolog');
bubbleDOM.setAttribute('href', '#');
bubbleDOM.setAttribute('class', 'selection_bubble');

/**
 * Handle bubble click event
 * Sends selected text and page title to the extension background script
 */
bubbleDOM.onclick = function() {
  chrome.runtime.connect().postMessage({
    "title": document.title,
    "selection": window.getSelection().toString()
  });
}
bubbleDOM.innerHTML = ' ';

// Note: Bubble append is currently disabled
// document.body.appendChild(bubbleDOM);

/**
 * Event Listeners
 */

// Listen for text selection events
document.addEventListener('mouseup', function (e) {
  const selection = window.getSelection().toString();
  if (selection.length > 0) {
    renderBubble(e.clientX, e.clientY, selection);
  }
}, false);

// Hide bubble when page is scrolled
document.addEventListener('scroll', function () {
  bubbleDOM.style.visibility = 'hidden';
}, false);

/**
 * Position and display the selection bubble
 * @param {number} mouseX - X coordinate of the mouse position
 * @param {number} mouseY - Y coordinate of the mouse position
 * @param {string} selection - Selected text content
 */
function renderBubble(mouseX, mouseY, selection) {
  document.body.appendChild(bubbleDOM);
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
}

// Removed unused variable
// var streekr = "Highlighted with StreekR.com";

