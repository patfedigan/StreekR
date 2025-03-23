function getUsername(id, title, url, selection) {
  var username = false;
  $.ajax({url:"http://streekr.com/api/getusername.php",
      type: "GET",
      success: function(response) {
        username = response;
        console.log("Retrieved username:" + username);
        sendToDatabase(id, title, url, selection, username);
      },
      error: function() {
        username = false;
        console.log("Couldn't retrieve username");
        sendToDatabase(id, title, url, selection, username);
      }
  });
}

function sendToDatabase(id, title, url, selection, username) {
  console.log("test");
  if (username != false) {
   toSend = {URL: url, Title: title, HighlightedText: selection, Username: username}
  } else {
    toSend = {URL: url, Title: title, HighlightedText: selection}
  }
  $.ajax({url:"http://streekr.com/api/new.php",
      type: "POST",
      data: toSend, 
      success: function(response) {
        console.log(response);
      },
      error: function() {
        console.log("error in sending to database");
      }
  });
}
