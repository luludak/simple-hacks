// ==UserScript==
// @name         Ad banners blocking script
// @description  Remove "Deactivate Ad Blocker" banners showing in pages, while using Ad Blocker.
// @version      1.2.0
// @include      /^https:\/\/www.[^\.]*.gr/*/
// @run-at       document-end
// @grant        none
// ==/UserScript==

// Disclaimer: No guarantees are provided with the script.
// The purpose of it usage is for legal and fair purposes only.
// The author is not responsible for any unfair of malicious usage.
// Use at your own risk.

'use strict';

// Classes and Ids of all elements that the page is going to be cleared of.
var classes = ['adman_root', 'ad-widget', 'fc-ab-root'];
var ids = ['google_ads_iframe', 'adman-display-fallback'];

// Mutate objects so that in case an ad-blocking removal banner is found,
// you remove it.
var adDeletionObserver = new MutationObserver(
  function (mutations) {
    for (var i = 0; i < mutations.length; ++i) {
      var mutation = mutations[i];
      for (var j = 0; j < mutation.addedNodes.length; ++j) {
        // Check if class or id of the added node contains any of the ones
        // eligible for deletion.
        var addedNode = mutation.addedNodes[j];
        var anyClassFound = classes.some(function (element) {
          // Minor hack to avoid implicit conversion to another type.
          return addedNode.className && (addedNode.className + '').indexOf(element) !== -1;
        });
        var anyIdFound = ids.some(function(element) {
          return addedNode.id && addedNode.id.indexOf(element) !== -1;
        });

        if(anyClassFound || anyIdFound) {
          // Remove node, in relation to its parent.
          addedNode.parentNode.removeChild(addedNode);
          // Banners usually set an inline, grey shadow on body as background.
          // This is unwanted, therefore removed style from document body.
          // Caveat: previously set inline CSS on body will be removed,
          // might irrelevant to the banner.
          if (document.body.style) {
            document.body.removeAttribute('style');
          }
        }
      }
    }
  }
);

// Monitor document body for changes.
adDeletionObserver.observe(document.body, {
  childList: true,
  subtree: true
});
