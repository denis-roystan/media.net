window.onload = () => {
    main.domListeners();
    apiMovie.getPopularMovies();
}

var main = {
    sortBy: 'title',
    sortOrder: 'asc',

    executeSortBy: (type) => {
        main.sortBy = type ? type : main.sortBy;
        main.executeSortOrder(main.sortOrder);
    },

    executeSortOrder: (order) => {
        main.sortOrder = order;
        switch (order) {
            case 'asc':
                if(main.sortBy === 'title')
                    apiMovie.movies.sort((curr, next) => { return (curr[main.sortBy].charAt(0).toLowerCase() < next[main.sortBy].charAt(0).toLowerCase()) && -1 });
                else
                    apiMovie.movies.sort((curr, next) => { return (new Date(curr[main.sortBy]).getFullYear() < new Date(next[main.sortBy]).getFullYear()) && -1 });
                break;
            case 'desc':
                if(main.sortBy === 'title')
                    apiMovie.movies.sort((curr, next) => { return (curr[main.sortBy].charAt(0).toLowerCase() > next[main.sortBy].charAt(0).toLowerCase()) && -1 });
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
    }
}