function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to. 
  var copyFrom = document.createElement("textarea");

  let result = text.replace("/mail/id/", "/mail/deeplink/readconv/");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = result;

  //Append the textbox field into the body as a child. 
  //"execCommand()" only works when there exists selected text, and the text is inside 
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand('copy');

  //(Optional) De-select the text using blur(). 
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor 
  //other elements can get access to this.
  document.body.removeChild(copyFrom);

}

chrome.tabs.query({
  active: true,
  currentWindow: true
}, function(tabs) {
  console.log('active tab', tabs);
  var tabURL = tabs[0].url;
  var xid = tabs[0].id;
  console.log('active tab url', tabURL);
  console.log('active tab id', xid);
  console.log('active group id', tabs[0].groupId);
  copyTextToClipboard(tabURL)
});