(function () {
  function jsonP(url, callbackName, callback, errorCallback, errorArgs) {
    let script = document.createElement("script");
    if (typeof callback === "function")
      window[callbackName] = callback;
    script.src = `${url}${callbackName}`;
    script.onerror = function (error) {
      console.log(error);
      if (typeof errorCallback === "function")
        errorCallback(errorArgs);
    };
    document.head.appendChild(script);
    script.remove();
  }

  function showResults(response) {
    try {
      if (!response) 
        throw "New exception";
      if (response[1].length > 0)
        makeResults(response);
      else {
        let errorMsg = `Sorry, but there are no results for your search: ${response[0]}`;
        showError(errorMsg);
      }
    } catch (err) {
      let errorMsg = "We're sorry, but something seems to have gone wrong. Please try your search again later.";
      showError(errorMsg);
      console.log(err);
    }
  }

  function makeResults(resObj) {
    let results = document.getElementById("results");
    resObj[1].forEach(function (el, idx) {
      let titleLink = document.createElement("a");
      let desc = document.createElement("p");
      titleLink.href = resObj[3][idx];
      titleLink.textContent = el;
      titleLink.target = "_blank";
      desc.textContent = (resObj[2][idx]) ? resObj[2][idx] : "Description Unavailable";
      results.appendChild(titleLink);
      results.appendChild(desc);
    });
  }

  function clearResults() {
    let results = document.getElementById("results");
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
    document.getElementById("error").style.display = "none";
  }

  function scrubInput() {
    let searchTxt = document.getElementById("search_bar").value;
    let clean = searchTxt.replace(/[^A-Za-z0-9\s"']/g, "");
    clean = clean.replace(/[\s"']/g, (match) => {
      if (match === " ")
        return "%20";
      if (match === '"' || "'")
        return "%22";
    });
    console.log(clean);
    return clean;
  }

  function submitSearch() {
    let searchTerm = scrubInput();
    if (searchTerm) {
      let url = `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${searchTerm}&callback=`;
      let errorMsg = "We're sorry, but something seems to have gone wrong. Please try your search again later.";
      jsonP(url, "showResults", showResults, showError, errorMsg);
      clearResults();
    }
  }

  function showError(message) {
    let errorDiv = document.getElementById("error");
    errorDiv.getElementsByTagName("p")[0].textContent = message;
    errorDiv.style.display = "block";
  }

  function sizeSearchBtn() {
    let width = document.getElementById("search_bar").clientHeight * 0.8;
    document.getElementById("submit").style.width = `${width}px`;
  }

  function prepareButtons() {
    sizeSearchBtn();
    let searchBtn = document.getElementById("submit");
    searchBtn.onclick = () => submitSearch();
    document.getElementById("search_bar").onkeydown = (e) => {
      if (e.keyCode == 13)
        submitSearch();
    };
  }

  prepareButtons();

})();