window.onload = () => {
    main.domListeners();
    apiMovie.getPopularMovies();
}

var main = {
    sortBy: 'title',
    sortOrder: 'asc',
    usersListOpen: false,

    executeSortBy: (type) => {
        main.sortBy = type ? type : main.sortBy;
        main.executeSortOrder(main.sortOrder);
    },

    executeSortOrder: (order) => {
        main.sortOrder = order;
        switch (order) {
            case 'asc':
                if(main.sortBy === 'title')
                    apiMovie.movies.sort((curr, next) => { return (curr[main.sortBy].toLowerCase() < next[main.sortBy].toLowerCase()) && -1 });
                else
                    apiMovie.movies.sort((curr, next) => { return (new Date(curr[main.sortBy]).getFullYear() < new Date(next[main.sortBy]).getFullYear()) && -1 });
                break;
            case 'desc':
                if(main.sortBy === 'title')
                    apiMovie.movies.sort((curr, next) => { return (curr[main.sortBy].toLowerCase() > next[main.sortBy].toLowerCase()) && -1 });
                else
                    apiMovie.movies.sort((curr, next) => { return (new Date(curr[main.sortBy]).getFullYear() > new Date(next[main.sortBy]).getFullYear()) && -1 });
                break;
            default:
                break;
        }

        apiMovie.loadMovies();
    },

    search: (value) => {
        console.log(value);
        apiMovie.searchMovie(value);
    },

    addToWatchListListener: () => {
        let elements = document.querySelectorAll('.add-to-watchlist');
        elements.forEach((element) => {
            element.addEventListener('click', (event) => {
                let movie = apiMovie.movies.find((obj, index) => { return  index == event.target.getAttribute('data-index')})
                if(!apiMovie.userWatchList.includes(movie)) {
                    apiMovie.userWatchList.push(movie);
                    showSnackBar('Saved to Default Watchlist..');
                    apiMovie.userWatchListRefresh();
                } else {
                    showSnackBar('Already Added..');
                }
            });
        });
    },

    domListeners: () => {
        // Search Listener
        let searchInput = document.getElementById('searchbar');

        var onSearch = debounce(function(event) {
            main.search(event.target.value);
        }, 250);

        searchInput.addEventListener('input', onSearch);

        //SortBy Listener
        let sortBy = document.querySelectorAll('.sort-type');
        for (let element of sortBy) {
            element.addEventListener('click', (event) => {
                sortBy.forEach(function(el) {
                    el.classList.remove("selected");
                });
                event.target.classList.add('selected');
                main.executeSortBy(event.target.getAttribute('data-type'));
            });
        }

        //SortOrder Listener
        let sortOrder = document.querySelectorAll('.sort-order');
        for (let element of sortOrder) {
            element.addEventListener('click', (event) => {
                sortOrder.forEach(function(el) {
                    el.classList.remove("selected");
                });   
                event.target.classList.add('selected');               
                main.executeSortOrder(event.target.getAttribute('data-order'));
            });
        }

        //User WatchList Listeners
        let watchlistOpen = document.getElementById('users-list-toggle');
        watchlistOpen.addEventListener('click', (event) => {
            let listWrapper = document.getElementById('users-list');
            if(main.usersListOpen) {
                main.usersListOpen = !main.usersListOpen;
                listWrapper.style.bottom = "-187px";
            } else {
                main.usersListOpen = !main.usersListOpen;
                listWrapper.style.bottom = 0 + "px";
            }
        })
    }
}