/**
 * StreekR Chrome Extension Background Script
 * Handles email functionality and browser action events
 * @copyright 2014 Streekr
 */

/**
 * Retrieves the custom mailto URL from localStorage
 * @returns {string} The custom mailto URL or empty string if not set
 */
function customMailtoUrl() {
  if (window.localStorage == null)
    return "";
  if (window.localStorage.customMailtoUrl == null)
    return "";
  return window.localStorage.customMailtoUrl;
}

// Listen for tab updates to handle page load completion
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    console.log("Hello, background!")
  }
})

/**
 * Executes the mailto action with the provided parameters
 * @param {number} tab_id - The ID of the current tab
 * @param {string} subject - Email subject
 * @param {string} body - Email body content
 * @param {string} selection - Selected text from the page
 */
function executeMailto(tab_id, subject, body, selection) {
  var default_handler = customMailtoUrl().length == 0;
  //alert(subject); //for testing
  getUsername(tab_id, subject, body, selection);
  //alert(selection); //for more testing.. I think it works!
  var streekr = "StreekR : ";
  var action_url = "mailto:?"
  if (subject.length > 0) 
	action_url += "subject=" + streekr + encodeURIComponent(subject) + "&";
  if (body.length > 0) {
    action_url += "body=" + encodeURIComponent(selection)  + "\n\nHighlighted with StreekR.com" + "\n\nLink to source document on the web: \n" + encodeURIComponent(body);

    // Append the current selection to the end of the text message.
    
  }

  if (!default_handler) {
    // Custom URL's (such as opening mailto in Gmail tab) should have a
    // separate tab to avoid clobbering the page you are on.
    var custom_url = customMailtoUrl();
    action_url = custom_url.replace("%s", encodeURIComponent(action_url));
    console.log('Custom url: ' + action_url);
    chrome.tabs.create({ url: action_url });
  } else {
    // Plain vanilla mailto links open up in the same tab to prevent
    // blank tabs being left behind.
    console.log('Action url: ' + action_url);
    chrome.tabs.update(tab_id, { url: action_url });
  }
}

/**
 * Handles the extension installation process
 * Opens the options page on first installation
 */
function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "options.html"});
}
install_notice();

//mouseup listener to make popup 
/*window.addEventListener("mouseup", function(event) { 
    var selection = getSelected();

    if (selection) {
        alert(selection);
    }
});*/

// Listen for messages from content scripts
chrome.runtime.onConnect.addListener(function(port) {
  var tab = port.sender.tab;

  // This will get called by the content script we execute in
  // the tab as a result of the user pressing the browser action.
  port.onMessage.addListener(function(info) {
    var max_length = 1024;
    if (info.selection.length > max_length)
      info.selection = info.selection.substring(0, max_length);
    executeMailto(tab.id, info.title, tab.url, info.selection);
  });
});

/**
 * Handles browser action click events
 * Injects content script for HTTP/HTTPS pages or executes mailto directly
 */
chrome.browserAction.onClicked.addListener(function(tab) {
	//Little cool code to check if the scpript ran
	//chrome.tabs.executeScript({
    //code: 'document.body.style.backgroundColor="orange"'
  //}); 
  // We can only inject scripts to find the title on pages loaded with http
  // and https so for all other pages, we don't ask for the title.
  if (tab.url.indexOf("http:") != 0 &&
      tab.url.indexOf("https:") != 0) {
    executeMailto(tab.id, "", tab.url, "");
  } else {
    chrome.tabs.executeScript(null, {file: "content_script.js"});
  }
});
  
  

/*function getSelected() {
    if (window.getSelection) {
        return window.getSelection();
    }
    else if (document.getSelection) {
        return document.getSelection();
    }
    else {
        var selection = document.selection && document.selection.createRange();
        if (selection.text) {
            return selection.text;
        }
        return false;
    }
    return false;
}*/

