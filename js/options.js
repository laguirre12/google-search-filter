/**
 * Here is the code that handles user interactions with the options.html
 * page and calls chrome.storage for access to the saved user data.
 *
 * data storage type:
 *  filteredSites = {
 *    activeSites = [],      // sites currently being filtered
 *    inactiveSites = []     // sites currently (temp) not being filtered
 *  }
 */


/* global copy of chrome storage filteredSites */
const filteredSites = {
  'activeSites' : null,
  'inactiveSites' : null
}

$(document).ready(() => {
  createFilteredList();

  $('#add-domain').click(() => {
    const domain = $('#domain-input').val();
    addToFilters(domain, addSiteCallback);
    $('#domain-input').val('');
  });

  $('#add-url').click(() => {
    const domain = domainFromUrl($('#url-input').val());
    addToFilters(domain, addSiteCallback);
    $('#url-input').val('');
  });
});


/**
 * Inserts the specified domain into the list of filtered websites
 * in the DOM.
 * @param {string} domain - the domain that was successfully added.
 * @param {object} data - an object containing data received from the
 *  data storage, the filtered sites.
 */
function addSiteCallback(domain, data) {
  const $listItem = $(createFilteredListItem(domain));
  $listItem.children().children('.filtered-check').prop('checked', true);
  $('#filtered-sites').append($listItem);
  $('.remove').unbind('click');
  $('.remove').click(removeFilteredItem);
  $('.filtered-check').change(changeFilteredStatus);
}

/**
 * Adds a domain to the filtered website list, the success callback is
 * not called if the domain being added already exists in the data.
 *
 * @param {string} domain
 * @param {function(string, object)} callback - a function to be called on
 *  success of the addition, with an object of the filtered sites, and the
 *  newly added domain.
 */
function addToFilters(domain, callback) {
  domain = domain.toLowerCase();
  if (!isValidDomain(domain)) {
    return;
  }
  
  const addFilter = function() {
    // domain being added already exists
    if (filteredSites.activeSites.includes(domain)
      || filteredSites.inactiveSites.includes(domain)) {
      return;
    }

    // add site, update storgae, callback
    filteredSites.activeSites.push(domain);
    chrome.storage.sync.set({ 'filteredSites' : filteredSites }, () => {
      callback(domain, filteredSites);
    });
  };

  // if our global data is undefined,
  // retrieve from storage then proceed
  if (filteredSites.activeSites == null
   || filteredSites.inactiveSites == null) {
    chrome.storage.sync.get('filteredsites', data => {
      const sites = data.filteredSites;
      const active = sites.activeSites;
      const inactive = sites.inactiveSites;

      // global reference
      filteredSites.activeSites = active instanceof Array ? active : [];
      filteredSites.inactiveSites = inactive instanceof Array ? inactive : [];
      addFilter();
    });
  } else {
    addFilter();
  }
}

/**
 * Creates a list of sites being filtered in the DOM.
 */
function createFilteredList() {
  chrome.storage.sync.get('filteredSites', data => {
    const sites = data.filteredSites;
    if (sites instanceof Object
      && sites.activeSites instanceof Array
      && sites.inactiveSites instanceof Array) {

      filteredSites.activeSites = sites.activeSites;     // global reference
      filteredSites.inactiveSites = sites.inactiveSites;

      $('#filtered-sites').empty();
      filteredSites.activeSites.forEach(site => {
        const $listItem = $(createFilteredListItem(site));
        $listItem.children().children('.filtered-check').prop('checked', true);
        $('#filtered-sites').append($listItem);
      });

      filteredSites.inactiveSites.forEach(site => {
        const listItem = createFilteredListItem(site);
        $('#filtered-sites').append(listItem);
      });

      $('.remove').click(removeFilteredItem);
      $('.filtered-check').change(changeFilteredStatus);
    }
  });
}

/**
 * Creates an HTML string for a filtered list-item with the specified
 * domain.
 *
 * @return {string} a string of HTML for a list-item in the filtered list.
 */
function createFilteredListItem(domain) {
  return `<li class="filtered-list-item">
    <div>
    <input class="filtered-check"
      data-domain="${domain}"
      type="checkbox">${domain}
    <span><img class="remove" data-domain="${domain}" src='images/trash.png'>
    </span>
    </div>
    </li>`;
}

/**
 * Deletes a website from the filtered list, deletes listItem from DOM
 * on success.
 */
function removeFilteredItem() {
  const $this = $(this);
  deleteFromFilters($this.data('domain'), data => {   // sucess callback
    $this.parents('li.filtered-list-item').remove();
  });
}

/**
 * Deletes a Website from the filtered list and updates Chrome storage, the
 * success callback is called if the domain doesn't exist in the filtered
 * list.
 *
 * @param {string} domain - the domain to be removed from the filtered
 *  site list.
 * @param {function(object)} callback - a function to be called on
 *  success of the deletion, with an object of the filtered sites.
 */
function deleteFromFilters(domain, callback) {
  domain = domain.toLowerCase();
  let index = filteredSites.activeSites.indexOf(domain);
  if (index > -1) {
    filteredSites.activeSites.splice(index, 1);
  } else if ((index = filteredSites.inactiveSites.indexOf(domain)) > -1){
    filteredSites.inactiveSites.splice(index, 1);
  } else {
    callback(filteredSites);   // nothing to delete, still call callback
    return;
  }

  chrome.storage.sync.set({ 'filteredSites' : filteredSites }, () => {
    callback(filteredSites);
  });
}


/**
 *
 */
function changeFilteredStatus() {
  const $this = $(this);
  const domain = $(this).data('domain');
  let index = filteredSites.activeSites.indexOf(domain);
  if (index > -1) {
    filteredSites.activeSites.splice(index, 1);
    filteredSites.inactiveSites.push(domain);
  } else if ((index = filteredSites.inactiveSites.indexOf(domain)) > -1) {
    filteredSites.inactiveSites.splice(index, 1);
    filteredSites.activeSites.push(domain);
  } else {
    return;         // item not found
  }

  chrome.storage.sync.set({ 'filteredSites' : filteredSites }, () => {
    console.log('filteredSites successfully saved on changeFilteredStatus');
  });
}


/**
 * Reports whether the specified string is a valid domain.
 * @param {string} domain
 * @return {boolean} - True if the input is a valid domain False otherwise.
 */
function isValidDomain(domain) {
  const domainRegex = /^(?:[a-z0-9]*|[a-z0-9]+-[a-z0-9]+)*$/i;
  if (!(typeof domain === "string")) {
    return false;
  }

  const correctLength = domain.length >= 3 && domain.length <= 63;
  const parts = domain.match(domainRegex);
  return correctLength
      && parts instanceof Array
      && parts.length > 0
      && parts[0].length === domain.length;
}


/**
 * Retrieves a domain from a valid url string.
 * @param {string} url
 * @return {string} - A string representing the domain of the url input.
 */
function domainFromUrl(url) {
  console.assert(typeof url === 'string');
  const temp = document.createElement('a');
  temp.href = url;
  let hostname = temp.hostname.split('.');
  hostname = hostname[hostname.length - 2];
  return hostname;
}
