var apiMovie = {
    movies: [],
    userWatchList: [],

    loadMovies: () => {
        let html = '';
        apiMovie.movies.forEach((element, index) => {
                html = html +   
                `<div class="card">
                    <div class="overlay">
                        <i class="material-icons add-to-watchlist" data-index="`+ index +`">add_circle_outline</i>
                    </div>
                    <img src="` + config.imageBaseUrl + element.poster_path + `" alt="Poster" class="poster">
                    <div class="container">
                        <p title="` + element.title + `"><b>` + element.title + `</b></p> 
                        <p>` + new Date(element.release_date).getFullYear() + `</p> 
                    </div>
                </div>`;
        });
        document.getElementById("cards-wrapper").innerHTML = html;
        main.addToWatchListListener();
    },

    getPopularMovies: () => {
        let requestPath = config.apiUrl + '/movie/popular?api_key=' + config.apiKey;
        httpClient.get(requestPath, 
        (response)=> {
            response = JSON.parse(response);
            apiMovie.movies = response.results.slice(0, 10);
            apiMovie.movies.sort((curr, next) => { return (curr.title.toLowerCase() < next.title.toLowerCase()) && -1 });
            apiMovie.loadMovies();
        }, (error) => {
        });
    }, 
    
    searchMovie: (query) => {
        let requestPath = config.apiUrl + '/search/movie?api_key=' + config.apiKey + '&query=' + query;
        httpClient.get(requestPath, 
        (response)=> {
            response = JSON.parse(response);
            apiMovie.movies = response.results.slice(0, 10);

            if(apiMovie.movies.length === 0) {
                (document.getElementById('cards-wrapper').innerText = 'No results found');
            } else {
                main.executeSortBy();
                apiMovie.loadMovies();
            }            
        }, (error) => {
        });
    },

    userWatchListRefresh: () => {
        (apiMovie.userWatchList.length > 0) ? document.getElementById("users-list-body").classList.add('no-after') : document.getElementById("users-list-body").classList.remove('no-after');
        let html = '';
        apiMovie.userWatchList.forEach((element, index) => {
                html = html +   
                `<div class="card">
                    <i class="material-icons cancel" data-index="`+ index +`">cancel</i>
                    <img src="` + config.imageBaseUrl + element.poster_path + `" alt="Poster" class="poster">
                    <div class="container">
                        <p title="` + element.title + `"><b>` + element.title + `</b></p> 
                        <p>` + new Date(element.release_date).getFullYear() + `</p> 
                    </div>
                </div>`;
        });
        document.getElementById("users-list-body").innerHTML = html;
        apiMovie.removeFromWatchList();
    },

    removeFromWatchList: () => {
        let elements = document.querySelectorAll('.users-list .card .cancel');
        elements.forEach((element, index) => {
            element.addEventListener('click', (event) => {
                apiMovie.userWatchList.splice(parseInt(event.target.getAttribute('data-index')), 1);
                showSnackBar('Removed one item from Default Watchlist..');
                apiMovie.userWatchListRefresh();
            });
        });
    }
    
}