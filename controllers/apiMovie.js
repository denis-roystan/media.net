var apiMovie = {
    movies: [],

    loadMovies: () => {
        let html = '';
        apiMovie.movies.forEach((element) => {
                html = html +   
                `<div class="card">
                    <img src="` + config.imageBaseUrl + element.poster_path + `" alt="Poster" class="poster">
                    <div class="container">
                        <p title="` + element.title + `"><b>` + element.title + `</b></p> 
                        <p>` + new Date(element.release_date).getFullYear() + `</p> 
                    </div>
                </div>`;
        });
        document.getElementById("cards-wrapper").innerHTML = html;
    },

    getPopularMovies: () => {
        let requestPath = config.apiUrl + '/movie/popular?api_key=' + config.apiKey;
        httpClient.get(requestPath, 
        (response)=> {
            response = JSON.parse(response);
            apiMovie.movies = response.results.slice(0, 10);
            apiMovie.movies.sort((curr, next) => { return (curr.title.charAt(0).toLowerCase() < next.title.charAt(0).toLowerCase()) && -1 });
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
            // apiMovie.movies.sort((curr, next) => { return (curr.title.charAt(0).toLowerCase() < next.title.charAt(0).toLowerCase()) && -1 });
            main.executeSortBy();
            apiMovie.loadMovies();
        }, (error) => {
        });
    }
    
}