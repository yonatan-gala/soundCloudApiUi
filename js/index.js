//"use strict";

const staticString = {
    SETTINGS: {
        RESULTS_NUM: 6,
        RECENT_RESULTS_NUM: 5
    },
    ELEMENT_HOOKS: {
        ID: {
            ROOT: 'app',
            SEARCH_INPUT: 'searchInput',
            SEARCH_BUTTON: 'searchButton',
            PAGINATE_NEXT: 'paginateNext',
            PAGINATE_PREV: 'paginatePrev',
            PLAYER_PLAY: 'PlayerPlay',
            PLAYER_STOP: 'PlayerStop',
        },
        CLASS: {
            RESULTS_ITEM: 'results__item',
        }
    },
    TEXT_STRINGS: {
        INPUT_PLACEHOLDER: 'Search a song..',
        MESSAGE_NO_RESULTS: 'No results found',
        SUBMIT_TEXT: "Go"
    },
    SC: {
        API_ID: 'E8IqLGTYxHll6SyaM7LKrMzKveWkcrjg',
    }
};

// controller Constructor
function Controller() {
    // the controller scope is:
    // 1. API initialization
    //   -  Id from constant string
    //   -  SC, sound cloud SDK init.
    // 2. Event management
    //   - input
    //   - submit
    //   - result click
    //   - preview image click
    //   - recent search click

    // controller -> model
    let myModel = new Model();
    let inputContainerValue = "";
    detectSearchHandler();

    // Handle Submit
    function detectSearchHandler() {
        let inputContainer = document.getElementById(staticString.ELEMENT_HOOKS.ID.SEARCH_INPUT);
        let submitContainer = document.getElementById(staticString.ELEMENT_HOOKS.ID.SEARCH_BUTTON);
        //inputContainer.addEventListener('focus', inputFocusHandler);
        inputContainer.addEventListener('keypress', handleKeyPress);
        submitContainer.addEventListener('click', handleSubmitButton);

        // function inputFocusHandler() {
        //     if (inputContainerValue === inputContainer.value || inputContainerValue === "") {
        //         console.log("no change");
        //         submitContainer.setAttribute('disabled', 'disabled');
        //     } else {
        //         console.log("change");
        //     }
        // }

        // Handle submit
        function handleSubmitButton() {
            if (inputContainerValue != inputContainer.value) {
                inputContainerValue = inputContainer.value;
                submitSearch(inputContainer.value);
            }
        }

        // Handle Key press
        function handleKeyPress(e) {
            if (e.keyCode === 13) {
                submitContainer.click();
            }
        }

        //staticString.ELEMENT_HOOKS.ID.SEARCH_INPUT.addEventListener('keypress',handleKeyPress(e));
    }

    // submit search
    function submitSearch(arg) {
        myModel.manageSearchState(arg);
    }

    // Handle Pagination
    function handlePaginateNext() {
    }

    function handlePaginatePrev() {
    }

    // Handle Results navigation
    function handleResultClick() {
    }

    // Handle PreviewClick
    function handlePreviewClick() {
    }

    // Handle PLayer
    function handlePlayerStop() {
    }

    function handlePlayerPlay() {
    }

}

// model Constructor
function Model() {
    let songsApiArray = [];
    let recentSearchArray = [];
    let activeSearch = false;
    let recentSearch = false;
    let searchValue;

    // API method
    SC.initialize({
        client_id: staticString.SC.API_ID
    });
    //calling model method
    let myView = new View();

    myView.detailView();

    //myView.removeResults();
    function manageSearchState(arg) {
        if (activeSearch === false) {
            getSongs(arg);
            activeSearch = true;
        }
        else {
            myView.removeResults();
            getSongs(arg);
            activeSearch = true;
        }
    }

    function getSongs(arg) {
        SC.get('/tracks', {
            limit: staticString.SETTINGS.RESULTS_NUM,
            q: arg
        }).then(function (tracks) {
            songsApiArray = tracks;
            // print using view
            myView.resultsView(songsApiArray);
            manageRecentSearch(arg);
        });
    }

    function getResultsPage(arg) {
        // should clear recent search first if active is true
        // if not , nothing to clear...

        // navigate to  collection page
        // this means calling with pagination ++ or -- in the linked  var

    }

    function storeRecentSong(arg) {
        // get last result and push to an array
    }

    function manageRecentSearch(arg) {
        if (recentSearch === false) {
            myView.recentSearchView(recentSearchArray);
            recentSearch = true;
        }
        else {

            activeSearch = true;
        }

        if (recentSearchArray.length < 6) {
            recentSearchArray.push(arg);
        } else {
            recentSearchArray.shift();
            recentSearchArray.push(arg);
        }
        myView.recentSearchView(recentSearchArray);

    }

    function getPreview(arg) {
        //prepare data for preview
        //call preview View
    }

    return {
        manageSearchState
    }
}

// view Constructor
function View() {
    let rootElementsIds = {
        root: staticString.ELEMENT_HOOKS.ID.ROOT,
        detail: 'detail',
        detailResults: 'detailResults',
        detailRecent: 'detailRecent',
        master: 'master',
        results: 'results',
        preview: 'preview',
        player: 'player'
    };

    function detailView(arg = null) {
        let template = {
            id: 'detail',
            element: 'detail',
            results:{
                id: 'detailResults',
                element: 'detail__results'
            },
            pagination:{
            },
            recent:{
                id: 'detailRecent',
                element: 'detail__recent'
            }
        };
        let container = document.createElement(template.element);
        let containerResults = document.createElement(template.results.element);
        let containerRecent = document.createElement(template.recent.element);

        container.setAttribute('id', template.id);
        containerResults.setAttribute('id', template.results.id);
        containerRecent.setAttribute('id', template.recent.id);

        document.getElementById(rootElementsIds.root).appendChild(container);

        searchView();

        document.getElementById(template.id).appendChild(containerResults);
        document.getElementById(template.id).appendChild(containerRecent);
    }

    function searchView() {
        let template = {
            id: 'search',
            element: 'search',
            input: {
                element: 'input',
                id: staticString.ELEMENT_HOOKS.ID.SEARCH_INPUT,
                class: "form-control",
                placeholderText: staticString.TEXT_STRINGS.INPUT_PLACEHOLDER
            },
            button: {
                element: 'button',
                id: staticString.ELEMENT_HOOKS.ID.SEARCH_BUTTON,
                class: "btn",
                text: staticString.TEXT_STRINGS.SUBMIT_TEXT
            }
        };
        let container = document.createElement(template.element);
        let containerInput = document.createElement(template.input.element);
        let containerButton = document.createElement(template.button.element);

        container.setAttribute('id', template.id);
        containerInput.setAttribute('id', template.input.id);
        containerInput.setAttribute('placeholder', template.input.placeholderText);
        containerInput.className = template.input.class;
        containerButton.setAttribute('id', template.button.id);
        containerButton.className = template.button.class;
        containerButton.innerText = template.button.text;

        document.getElementById(rootElementsIds.detail).appendChild(container);
        document.getElementById(template.id).appendChild(containerInput);
        document.getElementById(template.id).appendChild(containerButton);
    }

    function resultsView(arg) {
        let template = {
            id: rootElementsIds.results,
            element: 'results',
            class: "results",
            item: {
                element: 'results__item',
                class: "results__item"
            }
        };
        let container = document.createElement(template.element);

        container.setAttribute('id', template.id);
        container.setAttribute('class', template.class);
        document.getElementById(rootElementsIds.detailResults).appendChild(container);
        for (let i = 0; i < arg.length; i++) {
            let containerItem = document.createElement(template.item.element);
            containerItem.setAttribute('class', template.item.class);
            document.getElementById(template.id).appendChild(containerItem);
            containerItem.innerText = arg[i].title;
        }
    }

    function removeResults() {
        const container = document.getElementById('results');
        container.remove();
    }

    function recentSearchView(arg) {
        let template = {
            id: 'recentSearch',
            element: 'recentSearch',
            class: "pagination",
            item: {
                element: 'recentSearch__item',
                class: "pagination__item"
            }
        };
        let container = document.createElement(template.element);

        container.setAttribute('id', template.id);
        document.getElementById(rootElementsIds.detailRecent).appendChild(container);
        for (let i = 0; i < arg.length; i++) {
            let containerItem = document.createElement(template.item.element);
            containerItem.setAttribute('class', template.item.class);
            document.getElementById(template.id).appendChild(containerItem);
            containerItem.innerText = arg[i];
        }
    }

    function paginationView() {
    }

    function masterView() {
        let container = document.createElement(regComponents.master.element);
        container.setAttribute('id', regComponents.detail.id);
        document.getElementById(regComponentsIds.root).appendChild(container);
    }

    function previewView() {

    }

    function previewImageView() {

    }

    function playerView() {

    }

    return {
        detailView,
        searchView,
        resultsView,
        recentSearchView,
        masterView,
        previewView,
        previewImageView,
        playerView,
        removeResults
    };
}

// Event Handlers
function init() {
    let myController = new Controller();
}

window.onload = init;
