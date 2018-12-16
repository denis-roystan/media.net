"use strict";

var apiMovie = {
  movies: [],
  loadMovies: function loadMovies() {
    var html = '';
    apiMovie.movies.forEach(function (element) {
      html = html + "<div class=\"card\">\n                    <img src=\"" + config.imageBaseUrl + element.poster_path + "\" alt=\"Poster\" class=\"poster\">\n                    <div class=\"container\">\n                        <p title=\"" + element.title + "\"><b>" + element.title + "</b></p> \n                        <p>" + new Date(element.release_date).getFullYear() + "</p> \n                    </div>\n                </div>";
    });
    document.getElementById("cards-wrapper").innerHTML = html;
  },
  getPopularMovies: function getPopularMovies() {
    var requestPath = config.apiUrl + '/movie/popular?api_key=' + config.apiKey;
    httpClient.get(requestPath, function (response) {
      response = JSON.parse(response);
      apiMovie.movies = response.results.slice(0, 10);
      apiMovie.movies.sort(function (curr, next) {
        return curr.title.charAt(0).toLowerCase() < next.title.charAt(0).toLowerCase() && -1;
      });
      apiMovie.loadMovies();
    }, function (error) {});
  },
  searchMovie: function searchMovie(query) {
    var requestPath = config.apiUrl + '/search/movie?api_key=' + config.apiKey + '&query=' + query;
    httpClient.get(requestPath, function (response) {
      response = JSON.parse(response);
      apiMovie.movies = response.results.slice(0, 10); // apiMovie.movies.sort((curr, next) => { return (curr.title.charAt(0).toLowerCase() < next.title.charAt(0).toLowerCase()) && -1 });

      main.executeSortBy();
      apiMovie.loadMovies();
    }, function (error) {});
  }
};
"use strict";

var httpClient = {
  post: function post(aUrl, reqBody, aCallback, eCallback) {
    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        aCallback(http.responseText, http.status);
      } else if (http.readyState == 4 && (http.status == 403 || http.status == 401 || http.status == 400)) {
        if (http.responseText) {
          if (eCallback) {
            eCallback(http);
          }

          var error = {
            '_body': http.responseText,
            'status': http.status
          };
          Events.publish('error', error);
        }
      }
    };

    http.open('POST', aUrl, true);
    http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    http.send(JSON.stringify(reqBody));
  },
  put: function put(aUrl, reqBody, aCallback) {
    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        aCallback(http.responseText);
      } else if (http.readyState == 4 && (http.status == 403 || http.status == 401 || http.status == 400)) {
        if (http.responseText) {
          var error = {
            '_body': http.responseText,
            'status': http.status
          };
          Events.publish('error', error);
        }
      }
    };

    http.open('PUT', aUrl, true);
    http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    http.send(JSON.stringify(reqBody));
  },
  get: function get(aUrl, aCallback, eCallback) {
    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        aCallback(http.responseText, {
          url: http.responseURL
        });
      } else if (http.readyState == 4 && (http.status == 403 || http.status == 401 || http.status == 400 || http.status == 500)) {
        if (http.responseText) {
          if (eCallback) {
            eCallback(http);
          } else {
            var error = {
              '_body': http.responseText,
              'status': http.status
            };
            Events.publish('error', error);
          }
        }
      }
    };

    http.open('GET', aUrl, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    http.send(null);
  },
  delete: function _delete(aUrl, aCallback) {
    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        aCallback(http.responseText);
      } else if (http.status == 403 || http.status == 401 || http.status == 400) {
        if (http.responseText) {
          var error = {
            '_body': http.responseText,
            'status': http.status
          };
          Events.publish('error', error);
        }
      }
    };

    http.open('DELETE', aUrl, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    http.send(null);
  }
};
"use strict";

window.onload = function () {
  main.domListeners();
  apiMovie.getPopularMovies();
};

var main = {
  sortBy: 'title',
  sortOrder: 'asc',
  executeSortBy: function executeSortBy(type) {
    main.sortBy = type ? type : main.sortBy;
    main.executeSortOrder(main.sortOrder);
  },
  executeSortOrder: function executeSortOrder(order) {
    main.sortOrder = order;

    switch (order) {
      case 'asc':
        if (main.sortBy === 'title') apiMovie.movies.sort(function (curr, next) {
          return curr[main.sortBy].charAt(0).toLowerCase() < next[main.sortBy].charAt(0).toLowerCase() && -1;
        });else apiMovie.movies.sort(function (curr, next) {
          return new Date(curr[main.sortBy]).getFullYear() < new Date(next[main.sortBy]).getFullYear() && -1;
        });
        break;

      case 'desc':
        if (main.sortBy === 'title') apiMovie.movies.sort(function (curr, next) {
          return curr[main.sortBy].charAt(0).toLowerCase() > next[main.sortBy].charAt(0).toLowerCase() && -1;
        });else apiMovie.movies.sort(function (curr, next) {
          return new Date(curr[main.sortBy]).getFullYear() > new Date(next[main.sortBy]).getFullYear() && -1;
        });
        break;

      default:
        break;
    }

    apiMovie.loadMovies();
  },
  search: function search(value) {
    console.log(value);
    apiMovie.searchMovie(value);
  },
  domListeners: function domListeners() {
    // Search Listener
    var searchInput = document.getElementById('searchbar');
    var onSearch = debounce(function (event) {
      main.search(event.target.value);
    }, 250);
    searchInput.addEventListener('input', onSearch); //SortBy Listener

    var sortBy = document.querySelectorAll('.sort-type');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = sortBy[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var element = _step.value;
        element.addEventListener('click', function (event) {
          sortBy.forEach(function (el) {
            el.classList.remove("selected");
          });
          event.target.classList.add('selected');
          main.executeSortBy(event.target.getAttribute('data-type'));
        });
      } //SortOrder Listener

    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var sortOrder = document.querySelectorAll('.sort-order');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = sortOrder[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _element = _step2.value;

        _element.addEventListener('click', function (event) {
          sortOrder.forEach(function (el) {
            el.classList.remove("selected");
          });
          event.target.classList.add('selected');
          main.executeSortOrder(event.target.getAttribute('data-order'));
        });
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
};
"use strict";

var config = {
  apiUrl: 'https://api.themoviedb.org/3',
  apiKey: "699aa1f6bb0b3f6a60e074824770ac61",
  imageBaseUrl: "https://image.tmdb.org/t/p/w200"
};
"use strict";

function debounce(func, wait, immediate) {
  var timeout;
  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

;