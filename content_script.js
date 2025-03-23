// Copyright (c) 2014 Streekr


// Add bubble to the top of the page.
var bubbleDOM = document.createElement('a');
bubbleDOM.setAttribute('id', 'streekr-diolog');
bubbleDOM.setAttribute('href', '#');
bubbleDOM.setAttribute('class', 'selection_bubble');
bubbleDOM.onclick=function(){
  chrome.runtime.connect().postMessage({
    "title": document.title,
    "selection": window.getSelection().toString()
  });
}
bubbleDOM.innerHTML = ' ';
//document.body.appendChild(bubbleDOM);

// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', function (e) {
  var selection = window.getSelection().toString();
  if (selection.length > 0) {
    renderBubble(e.clientX, e.clientY, selection);
  }
}, false);


document.addEventListener('scroll', function (e) {
  bubbleDOM.style.visibility = 'hidden';
}, false);


// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, selection) {
  document.body.appendChild(bubbleDOM);
  //bubbleDOM.innerHTML = selection;
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
}

//var streekr = "Highlighted with StreekR.com";

