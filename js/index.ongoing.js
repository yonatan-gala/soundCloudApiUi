"use strict";

let view = function () {
    const results = document.getElementById('results');
    const search = document.createElement('search');
    const input = document.createElement('input');
    const submit = document.createElement('button');
    return {
        clearSearch: () => {
            results.remove();
            console.log("search removed");
        },
        renderSearch: () => {
            search.setAttribute('id', 'search');
            input.setAttribute('id', 'input');
            input.setAttribute('placeholder', "search some shit");
            input.className = "form-control";
            submit.setAttribute('id', 'submit');
            submit.classList.add("btn", "btn--primary");
            submit.innerText = "search";
            document.getElementById('app').appendChild(search);
            document.getElementById('search').appendChild(input);
            document.getElementById('search').appendChild(submit);

            // todo: create setters.
        },
        renderResults: (arg) => {
            let resultsContainer = document.createElement('results');
            resultsContainer.setAttribute('id', 'results')
            document.getElementById('app').appendChild(resultsContainer);
            if (arg.length > 0) {
                for (let i = 0; i < arg.length; i++) {
                    let result = document.createElement('results__item');
                    resultsContainer.appendChild(result);
                    result.innerText = arg[i].title;
                }
            } else {
                let message = document.createElement('message');
                resultsContainer.appendChild(message);
                message.innerText = "shit face";
            }
        },
        renderPreview: "TBD"
    }
};

let model = function () {
    const songsLength = 6;
    const recentSearch = [];
    let songs = {};
    let searchState, searchValue;

    return {
        get searchValue() {
            return searchValue;
        },
        getSongs: (arg) => {
            if (searchState === true) {
                view.clearSearch();
                searchState = "";
            }
            SC.get('/tracks', {
                limit: songsLength,
                linked_partitioning: 1,
                q: arg
            }).then(function (tracks) {
                songs.collection = tracks;
                // print using view
                // todo: change soon
                view.renderResults(songs.collection);
                recentSearch.push(searchValue);
                searchState = true;
                console.log(recentSearch);
            });
            console.log(searchState, "got songs, changed state, pushed value, promise event");
        },
        navigateSongs: (arg) => {
        }
    }

}

let controller = function () {
    let searchInput;
    let searchSubmitButton;
    const userId = 'EBquMMXE2x5ZxNs9UElOfb4HbvZK95rc';
    let view, model;
    return {
        init: () => {
            SC.initialize({
                client_id: userId
            });
            view = new View();
            model = new Model();
            view.renderSearch();

            searchInput = document.getElementById("input");
            searchSubmitButton = document.getElementById("submit");

            searchSubmitButton.onclick = this.submitSearch;
            searchInput.onkeypress = this.keySearch;
        },
        submitSearch: () => {
            if (model.searchValue !== searchInput.value) {
                model.searchValue = searchInput.value;
                model.getSongs(model.searchValue);
            }
        },
        keySearch: (e) => {
            if (e.keyCode === 13) {
                this.submitSearch();
                return false;
            }
        },
        navigateSongs: () => {
        }
    }
};

// Breaking into functions
// CONTROLLER
let contollerInit = () => {
    SC.initialize({
        client_id: userId
    });
    view = new View();
    model = new Model();
    view.renderSearch();

    searchInput = document.getElementById("input");
    searchSubmitButton = document.getElementById("submit");

    searchSubmitButton.onclick = this.submitSearch;
    searchInput.onkeypress = this.keySearch;
};
let controllerSubmitSearch = () => {
    if (model.searchValue !== searchInput.value) {
        model.searchValue = searchInput.value;
        model.getSongs(model.searchValue);
    }
};

// MODEL
let modelGetSongs = (array, resultsLength) => {
    //todo: set or pass 'resultsLength' searchState or access it via getter or globally defined;
    //todo: need access to: searchState
    //todo: set searchState or access it via getter or globally defined;
    if (searchState === true) {
        //todo: activates viewClearSearch
        view.clearSearch();
        //todo: clear 'searchState' variable.
        searchState = "";
    }
    SC.get('/tracks', {
        limit: length,
        linked_partitioning: 1,
        q: arg
    }).then(function (tracks) {
        //todo: set 'tracksApiResults' or access it via getter or globally defined;
        tracksApiResults.collection = tracks;
        // print using view
        viewRenderResults(tracksApiResults.collection);
        //
        recentSearch.push(searchValue);
        searchState = true;
        console.log(recentSearch);
    });
    console.log(searchState, "got songs, changed state, pushed value, promise event");
};
let modelRecentSearch =()=>{};
let modelRecentTrackApiResults =()=>{};
let modelNavigateSongs = (arg) => {
};

// VIEW
let viewClearSearchFn = () => {
    results.remove();
    console.log("search removed");
};
let viewRenderSearchFn = () => {
    search.setAttribute('id', 'search');
    input.setAttribute('id', 'input');
    input.setAttribute('placeholder', "search some shit");
    input.className = "form-control";
    submit.setAttribute('id', 'submit');
    submit.classList.add("btn", "btn--primary");
    submit.innerText = "search";
    document.getElementById('app').appendChild(search);
    document.getElementById('search').appendChild(input);
    document.getElementById('search').appendChild(submit);

    // todo: create setters.
};
let viewRenderResultsFn = (arg) => {
    let resultsContainer = document.createElement('results');
    resultsContainer.setAttribute('id', 'results')
    document.getElementById('app').appendChild(resultsContainer);
    if (arg.length > 0) {
        for (let i = 0; i < arg.length; i++) {
            let result = document.createElement('results__item');
            resultsContainer.appendChild(result);
            result.innerText = arg[i].title;
        }
    } else {
        let message = document.createElement('message');
        resultsContainer.appendChild(message);
        message.innerText = "shit face";
    }
};
let viewRenderPreviewFn = "TBD";
let viewRenderTrackImage = "TBD";
let viewRenderTrackPlayer = "TBD";
