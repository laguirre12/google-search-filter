/**
 * Here is the code that specifies the actions of the popup.
 */

$(document).ready(() => {
  $('#add-to-filters').click(addCurrentTabToFilters);
});

/**
 * Adds the current tab's domain to the list of filtered search sites.
 */
function addCurrentTabToFilters() {
  const addToFilters = function(url, callback) {
    chrome.storage.sync.get('filteredSites', data => {
      const domain = domainFromUrl(url).toLowerCase();
      const sites = data.filteredSites == null ? {} : data.filteredSites;
      const active = sites.activeSites == null ? [] : sites.activeSites;
      const inactive = sites.inactiveSites == null ? [] : sites.inactiveSites;
      // add new domain to active list
      if (!active.includes(domain)) {
        active.push(domain);
      }

      // remove domain from inactive list in case it's present
      if (inactive.includes(domain)) {
        inactive.splice(inactive.indexOf(domain), 1);
      }

      // save and update sites
      sites.activeSites = active;
      sites.inactiveSites = inactive;
      chrome.storage.sync.set({'filteredSites' : sites }, () => {
        callback(domain);
      });
    });
  }


  // get current tab
  const queryInfo = { 'active' : true };
  chrome.tabs.query(queryInfo, tabs => {
    if (tabs.length > 0) {
      addToFilters(tabs[0].url.toLowerCase(), updatePopupSuccesText);
    }
  });
}

/**
 * Updates the text on the popup signaling success of addition.
 */
function updatePopupSuccesText(domain) {
  $('#add-text').text(domain + ' successfully added to filtered sites!');
}
