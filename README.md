# Google Search Filter
A Google Chrome extension that filters Google Search results based on domain name.

## Description
Filter websites based on website domain name from Goole Search Results, ignoring the top level domain (.org, .com, .gov, .edu, etc.). Domains can be added through the options page of the extension or by the browser popup, and they will fade away and be removed from Google Search results.

## Examples
For example, Wikipedia could be filtered from search results by adding Wikipedia to the list of filtered sites. Then search results from Wikipedia.org, Wikipedia.com, Wikipedia.gov, etc. would be filtered and would be filtered from the search results.
![Adding an element to filters](images/demo/adding.png?raw=true "Wikipedia Added to Filters")

#### Before And After:
![Wikipedia Result filtered from search Results](images/demo/before_and_after.png?raw=true "Wikipedia filtered from search results")


## Technologies Used
* Javascript
* Chrome Storage API
* Chrome Tabs API
* JQuery
* HTML/CSS

## Install

### Unpacked Extension
* Download the code, unzip
* Open (chrome://extensions/) or select the menu 'More Tools > Extensions.'
* Enable developer mode at top right.
* Click 'Load unpacked extension...' and select the unzipped folder.
* Search with Google
