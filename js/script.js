/**
 * Here will be the code that manipulates the DOM elements on google 
 * search pages, and does the actual filtering. storage.js will be called
 * to retrieve the domains that should be removed.
 */

/**
 * To check the domain name of a url is to get the hostname and remove the
 * extension
 *  ex:
 *    let temp = document.createElement('a');
 *    temp.href = "https://example.com/etc";
 *    temp.hostname; // => "example.com"
 */

$(document).ready(() => {
  removeFilteredLinks();
});


/**
 * Filters google search results with the filteredSites in storage.
 */
function removeFilteredLinks() {
  chrome.storage.sync.get('filteredSites', data => {
    const sites = data.filteredSites;
    if (sites instanceof Object && sites.activeSites instanceof Array) {
      removeFilteredSearchResults(getAllSearchResults(), sites.activeSites);
    }
  });
}

/**
 * Returns an array of DOM <a> elements that were google search results.
 * @return {object[]} - an array of DOM <a> element objects.
 */
function getAllSearchResults() {
  const searchResults = [];
  $('h3.r a').each(function() {
    searchResults.push(this);
  });

  return searchResults;
}

/**
 * Removes the searchResults that have a matching domain in filteredSites
 *  from the DOM.
 * @param searchResults {object[]} - An array of <a> DOM objects.
 * @param filteredSites {string[]} - An array of string domains.
 */
function removeFilteredSearchResults(searchResults, filteredSites) {
  searchResults.forEach(result => {
    for (let i = 0; i < filteredSites.length; i++) {
      if (matchesDomain(result.href, filteredSites[i])) {
        $(result).parents('.g').fadeOut(1200, function() {
          $(this).remove();
        });
      }
    }
  });
}


/**
 * Reports whether the url is from the same website as the specified domain.
 * @param url {string} - A string representing a valid url, https://ex.com/ab
 * @param domain {string} - A string containing a domain to match the url
 */
function matchesDomain(url, domain) {
  const temp = document.createElement('a');
  temp.href = url;
  let hostname = temp.hostname.split('.');
  hostname = hostname[hostname.length - 2];
  if (hostname === domain) {
    return true;
  }

  return false;
}
