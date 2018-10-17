//"use strict";

const resultsNum = 6;
const recentResultsNum = 5;
const apiId = 'E8IqLGTYxHll6SyaM7LKrMzKveWkcrjg';

let activeSearch = false;
let recentSearch = false;
let inputContainerValue = "";
let songsApiArray = [];
let recentSearchArray = [];
let searchValue;

const text = {
    INPUT_PLACEHOLDER: 'Search a song..',
    MESSAGE_NO_RESULTS: 'No results found',
    SUBMIT_TEXT: "Go",
    RECENT_RESULTS_TITLE: "Recent results"
};

const root = 'app';


const templates = {
    ROOT: 'app',
    DETAIL: {
        ID_HOOK: 'detail',
    },
    SEARCH: {
        ID_HOOK: 'search',
    },
    SEARCH_INPUT: {
        ID_HOOK: 'searchInput',
    },
    SEARCH_BUTTON: {
        ID_HOOK: 'searchButton'
    },
    RESULTS: {
        ID_HOOK: 'results'
    },
    RESULTS_ITEM: {
        CLASS_HOOK: ['results__item']
    },
    RECENT: {
        ID_HOOK: 'recentResults'
    },
    RECENT_ITEM: {
        CLASS_HOOK: 'results__item'
    },
    MASTER: {
        ID_HOOK: 'master'
    },
    PREVIEW: {
        ID_HOOK: 'preview'
    },
    PLAYER: {
        ID_HOOK: 'player'
    }
};

function EventDetector() {
    let myEventManager = new EventManager();

    detectSearchHandler();

    // Handle Submit
    function detectSearchHandler() {
        let inputContainer = document.getElementById(templates.SEARCH_INPUT.ID_HOOK);
        let submitContainer = document.getElementById(templates.SEARCH_BUTTON.ID_HOOK);

        inputContainer.addEventListener('keypress', handleKeyPress);
        submitContainer.addEventListener('click', handleSubmitButton);

        // Handle submit
        function handleSubmitButton() {
            if (inputContainerValue != inputContainer.value) {
                inputContainerValue = inputContainer.value;
                sendSubmitEvent(inputContainer.value);
            }
        }

        // Handle Key press
        function handleKeyPress(e) {
            if (e.keyCode === 13) {
                submitContainer.click();
            }
        }
    }

    // submit search
    function sendSubmitEvent(arg) {
        myEventManager.manageSearchState(arg);
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

    return {
        handlePaginateNext,
        handlePaginatePrev,
        handleResultClick,
        handlePreviewClick,
        handlePlayerStop,
        handlePlayerPlay
    }
}

// model Constructor
function EventManager() {
    //calling model method
    let myTemplateEngine = new TemplateEngine();

    myTemplateEngine.detailTemplate();

    //myEventManager.removeResults();
    function manageSearchState(arg) {
        if (activeSearch === false) {
            getSongs(arg);
            activeSearch = true;
        }
        else {
            myTemplateEngine.removeResults();
            getSongs(arg);
            activeSearch = true;
        }
    }

    function getSongs(arg) {
        SC.get('/tracks', {
            limit: resultsNum,
            q: arg
        }).then(function (tracks) {
            songsApiArray = tracks;

            myTemplateEngine.resultsTemplate(songsApiArray);
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
        if (recentSearchArray.length < recentResultsNum) {
            recentSearchArray.push(arg);
        } else {
            recentSearchArray.shift();
            recentSearchArray.push(arg);
        }
        myTemplateEngine.recentSearchTemplate(recentSearchArray);
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
function TemplateEngine() {
    function detailTemplate() {
        let container = document.createElement('div');

        container.setAttribute('id', templates.DETAIL.ID_HOOK);

        document.getElementById(templates.ROOT).appendChild(container);

        searchTemplate();
    }

    function searchTemplate() {
        let container = document.createElement('div');
        let containerInput = document.createElement('input');
        let containerButton = document.createElement('button');

        container.setAttribute('id', templates.SEARCH.ID_HOOK);

        containerInput.setAttribute('id', templates.SEARCH_INPUT.ID_HOOK);
        containerInput.setAttribute('placeholder', text.INPUT_PLACEHOLDER);
        containerInput.className = "form-control";

        containerButton.setAttribute('id', templates.SEARCH_BUTTON.ID_HOOK);
        containerButton.className = "btn";
        containerButton.innerText = text.SUBMIT_TEXT;

        document.getElementById(templates.DETAIL.ID_HOOK).appendChild(container);
        document.getElementById(templates.SEARCH.ID_HOOK).appendChild(containerInput);
        document.getElementById(templates.SEARCH.ID_HOOK).appendChild(containerButton);
    }

    function resultsTemplate(arg) {
        let container = document.createElement('div');
        container.setAttribute('id', templates.RESULTS.ID_HOOK);
        container.className = "results";
        document.getElementById(templates.DETAIL.ID_HOOK).appendChild(container);
        for (let i = 0; i < arg.length; i++) {
            let containerItem = document.createElement('div');
            containerItem.className = "results__item";
            document.getElementById(templates.RESULTS.ID_HOOK).appendChild(containerItem);
            containerItem.innerText = arg[i].title;
        }
    }

    function removeResults() {
        const container = document.getElementById(templates.RESULTS.ID_HOOK);
        container.remove();
    }

    function recentSearchTemplate(arg) {
        if (arg.length === 1) {
            let container = document.createElement('div');
            container.setAttribute('id', templates.RECENT.ID_HOOK);
            document.getElementById(templates.ROOT).appendChild(container);

            let containerItem = document.createElement('div');
            containerItem.className = "results__item";
            document.getElementById(templates.RECENT.ID_HOOK).appendChild(containerItem);
            containerItem.innerText = arg[0];

        } else {
            let containerItem = document.createElement('div');
            containerItem.className = "results__item";
            containerItem.innerText = arg[arg.length - 1];
            if (arg.length < recentResultsNum) {
                document.getElementById(templates.RECENT.ID_HOOK).appendChild(containerItem);
            } else {
                templates.RECENT.removeChild(templates.RECENT.ID_HOOK.getElementsByTagName('div')[0]);
                document.getElementById(template.RECENT.ID_HOOK).appendChild(containerItem);
            }
        }
    }

    function paginationTemplate() {
    }

    function masterTemplate() {
        let container = document.createElement('div');
        container.setAttribute('id', templates.MASTER);
        document.getElementById(root).appendChild(container);
    }

    function previewTemplate() {

    }

    function previewImageTemplate() {

    }

    function playerTemplate() {

    }

    return {
        detailTemplate,
        searchTemplate,
        resultsTemplate,
        recentSearchTemplate,
        masterTemplate,
        previewTemplate,
        previewTemplate,
        playerTemplate,
        removeResults
    };
}

// Event Handlers
function init() {
    // API method
    SC.initialize({
        client_id: apiId
    });
    let myEventDetector = new EventDetector();
}

window.onload = init;
