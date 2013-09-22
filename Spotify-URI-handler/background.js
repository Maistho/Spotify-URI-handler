/*
             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
 */

var RequestMatcher = chrome.declarativeWebRequest.RequestMatcher;
var RedirectByRegEx = chrome.declarativeWebRequest.RedirectByRegEx;
  function registerRules() {
  var redirectRule = {
    conditions: [
      // If any of these conditions is fulfilled, the actions are executed.
      new RequestMatcher({
        url: {urlContains: 'open.spotify.com'}
      }),
    ],
    actions: [
      new RedirectByRegEx({from: ".*open\.spotify\.com\/(.*)\/(.*)", to: "spotify:$1:$2"})
    ]
  };

  var callback = function() {
    if (chrome.runtime.lastError) {
      console.error('Error adding rules: ' + chrome.runtime.lastError);
    } else {
      console.info('Rules successfully installed');
      chrome.declarativeWebRequest.onRequest.getRules(null,
          function(rules) {
            console.info('Now the following rules are registered: ' +
                         JSON.stringify(rules, null, 2));
          });
    }
  };

  chrome.declarativeWebRequest.onRequest.addRules(
      [redirectRule], callback);
}

function setup() {
  // This function is also called when the extension has been updated.  Because
  // registered rules are persisted beyond browser restarts, we remove
  // previously registered rules before registering new ones.
  chrome.declarativeWebRequest.onRequest.removeRules(
    null,
    function() {
      if (chrome.runtime.lastError) {
        console.error('Error clearing rules: ' + chrome.runtime.lastError);
      } else {
        registerRules();
      }
    });
}

// This is triggered when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(setup);
