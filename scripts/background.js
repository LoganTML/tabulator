chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    /*if (message.action === "printTabs") {
        console.log("Printing tabs");
      
        // Create an object to store tab groups
            
        tabGroups = groupTabsHelper();
        
        // Now tabGroups contains groups of tabs with the same shortened URL
        console.log("Tab Groups:", tabGroups);

      } else*/ if (message.action === "groupTabs") {
            console.log("Grouping tabs");
        
            // Call groupTabsHelper, which returns a Promise
            groupTabsHelper().then((tabGroups) => {
                // Now tabGroups contains groups of tabs with the same shortened URL
                console.log("Tab Groups:", tabGroups);
        
                // Check vsb for testing only
                //console.log("Tab URL:", tabGroups['vsb.mcgill.ca'][0].url);
        
                // Loop through tab groups and take action based on the conditions
                /*
                for (const curTabUrl in tabGroups) {
                    const curTabGroup = tabGroups[curTabUrl];
                    console.log("URL:", curTabUrl);
                    console.log("Tabs:", curTabGroup);
                } */

                // Function to move tabs to the same window
                function moveTabsToSameWindow(tabs) {
                    if (tabs.length > 0) {
                        const tabIdsToMove = tabs.map((tab) => tab.id);
        
                        // Create a new window
                        chrome.windows.create({}, (newWindow) => {
                            const windowId = newWindow.id;
        
                            // Move tabs to the new window
                            chrome.tabs.move(tabIdsToMove, { windowId: windowId, index: -1 }, (movedTabs) => {
                                console.log("Moved tabs to a new window:", movedTabs);
                            });
                        });
                    }
                }

                // Loop through tab groups and move all tabs to the same window
                for (const curTabUrl in tabGroups) {
                    moveTabsToSameWindow(tabGroups[curTabUrl]);
                }

        
                function closeNewTabs() {
                    // Define the criteria for identifying "new tabs"
                    const criteria = {
                        // You can use a URL pattern to identify new tabs. For example, "chrome://newtab" is the URL for a new tab page.
                        url: "chrome://newtab/" // Change this URL pattern to match your definition of "new tabs"
                    };
                    // IT WORKS!!!
                
                    // Query tabs that meet the criteria
                    chrome.tabs.query(criteria, function (tabs) {
                        // Close the matching tabs
                        tabs.forEach(function (tab) {
                            chrome.tabs.remove(tab.id, function () {
                                console.log(`Closed tab with ID ${tab.id}`);
                            });
                        });
                    });
                }

                // Call deleteNewTabs to start listening for window removal events
                closeNewTabs();
            });
        } /*else if (message.action === "deleteDuplicates") {
            // Broadcast the "deleteDuplicates" message to all content scripts
            chrome.tabs.query({}, function (tabs) {
                tabs.forEach(function (tab) {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        function: function () {
                        // Implement duplicate tab deletion logic in the content script
                        },
                    });
                });
            });
            } */
        }); 
  
// No input; returns a Promise that resolves with an object containing tab groups
function groupTabsHelper() {
    console.log("Organizing tabs");

    // Create a Promise to handle the asynchronous chrome.tabs.query() call
    return new Promise((resolve) => {
        // Create an object to store tab groups
        const tabOrg = {};

        // Broadcast the "groupTabs" message to all content scripts
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                const tabUrl = extractHostFromUrl(tab.url);

                // Check if a group for this URL exists, if not, create one
                if (!tabOrg[tabUrl]) {
                    tabOrg[tabUrl] = [];
                }

                // Add the tab to the group
                tabOrg[tabUrl].push(tab);
            });

            // Move tabs with only one entry to "Unknown"
            for (const tabUrl in tabOrg) {
                if (tabOrg[tabUrl].length === 1) {
                    const tabToMove = tabOrg[tabUrl][0];
                    tabToMove.url = "Unknown";
                    if (!tabOrg["Unknown"]) {
                        tabOrg["Unknown"] = [];
                    }
                    tabOrg["Unknown"].push(tabToMove);
                    delete tabOrg[tabUrl];
                }
            }
            // Resolve the Promise with the fully populated tabOrg object
            resolve(tabOrg);
        });
    });
}


function extractHostFromUrl(url) {
    try {
        const urlObject = new URL(url);
        return urlObject.hostname;
    } catch (error) {
        console.error("Error parsing URL:", error);
        return "Unknown"; // Handle invalid URLs gracefully
    }
}
