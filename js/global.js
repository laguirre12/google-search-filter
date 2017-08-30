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
