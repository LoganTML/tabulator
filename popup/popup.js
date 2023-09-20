// popup.js
document.addEventListener("DOMContentLoaded", function () {
    // Handle the "Delete duplicates" button click
    /*
    document.getElementById("print-tabs").addEventListener("click", function () {
        chrome.runtime.sendMessage({ action: "printTabs" });
    });
    */
    
    // Handle the "Group tabs" button click
    document.getElementById("group-tabs").addEventListener("click", function () {
        chrome.runtime.sendMessage({ action: "groupTabs" });
    });
  /*
    // Handle the "Delete duplicates" button click
    document.getElementById("delete-tabs").addEventListener("click", function () {
        chrome.runtime.sendMessage({ action: "deleteDuplicates" });
    });
  */
  
});