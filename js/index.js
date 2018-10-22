//"use strict";

(function () {
    const resultsNum = 6;
    const recentResultsNum = 5;
    const apiId = 'E8IqLGTYxHll6SyaM7LKrMzKveWkcrjg';

    let activeSearch = false;
    let recentSearch = false;
    let recentResults = false;

    let songsApiArray = [];
    let recentSearchArray = [];

    let inputContainerValue;
    let searchValue;

    let inputContainerIdNode;
    let submitContainerIdNode;
    let rootIdNode;
    let detailIdNode;
    let searchIdNode;
    let resultsIdNode;
    let recentIdNode;


    const text = {
        INPUT_PLACEHOLDER: 'Search a song..',
        MESSAGE_NO_RESULTS: 'No results found',
        RECENT_RESULTS_TITLE: "Recent results"
    };

    const templates = {
        ROOT: 'app',
        DETAIL: {
            ID_HOOK: 'detail',
        },
        MASTER: {
            ID_HOOK: 'master'
        },
        RECENT: {
            ID_HOOK: 'recent'
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
        PREVIEW: {
            ID_HOOK: 'preview'
        },
        PLAYER: {
            ID_HOOK: 'player'
        },
        RECENT_RESULTS: {
            ID_HOOK: 'recentResults'
        },
        RECENT_ITEM: {
            CLASS_HOOK: 'results__item'
        }
    };

    function EventDetector() {
        let myEventManager = new EventManager();

        detectSearchHandler();

        // Handle Submit
        /**
         * handle search related events
         * submit button click
         * key press (enter) submission
         * call sendSubmitEvent
         */
        function detectSearchHandler() {
            inputContainerIdNode = inputContainerIdNode || document.getElementById(templates.SEARCH_INPUT.ID_HOOK);
            submitContainerIdNode = submitContainerIdNode || document.getElementById(templates.SEARCH_BUTTON.ID_HOOK);

            inputContainerIdNode.addEventListener('keypress', handleKeyPress);
            submitContainerIdNode.addEventListener('click', handleSubmitButton);

            // Handle submit
            function handleSubmitButton() {
                if (inputContainerValue !== inputContainerIdNode.value) {
                    inputContainerValue = inputContainerIdNode.value;
                    sendSubmitEvent(inputContainerIdNode.value);
                }
            }

            // Handle Key press
            function handleKeyPress(e) {
                if (e.keyCode === 13) {
                    submitContainerIdNode.click();
                }
            }
        }

        /**
         * sends captured Input Value to myEventManager.updateResultBaseOnSearchState
         * @param capturedInputValue
         */
        // submit search
        function sendSubmitEvent(capturedInputValue) {
            myEventManager.updateResultBaseOnSearchState(capturedInputValue);
        }

        function triggerRecentItemClickEvent(d) {
            myEventManager.manageRecentItemClick(d.innerHTML);
        }

        function triggerResultItemClickEvent(d) {
            myEventManager.manageResultItemClick(d.getAttribute('id'));
        }

        window.triggerResultItemClickEvent = triggerResultItemClickEvent;
        window.triggerRecentItemClickEvent = triggerRecentItemClickEvent;

    }

    function EventManager() {
        let myTemplateEngine = new TemplateEngine();
        myTemplateEngine.detailTemplate();
        myTemplateEngine.masterTemplate();

        if (localStorage["recentSearchArray"]) {
            recentSearchArray = JSON.parse(localStorage.getItem("recentSearchArray"));
            myTemplateEngine.recentSearchTemplate(recentSearchArray);
        }

        /**
         * Decide if to remove last result from the ui
         * check:  if we have current results ==> remove them
         * update: search state
         * call: getSongs with query @param
         * @param query
         */
        function updateResultBaseOnSearchState(query) {
            activeSearch ? myTemplateEngine.removeResults() : null;
            activeSearch = true;
            getSongs(query);
        }

        /**
         * use the SoundCloud API to get the tracks Array.
         * update songApiArray with results
         * call the resultsTemplate function => to render results
         * call the manageRecentSearch function => to manage the recent results render
         * @param query
         */
        function getSongs(query) {
            SC.get('/tracks', {
                limit: resultsNum,
                q: query
            }).then(function (tracks) {
                songsApiArray = tracks;
                myTemplateEngine.resultsTemplate(songsApiArray);
                manageRecentSearch(query);
            });
        }

        /**
         * change the recent searches list render according to its length
         * show only 5 last results
         * check: if query in array ==> true: splice and push query
         * check: if array smaller than defined results number ==> push query
         * check: if array is bigger the defined results number ==> remove first value, push query
         * call: recent search render.
         * @param query
         */
        function manageRecentSearch(query) {
            const queryIndex = recentSearchArray.indexOf(query);
            if (queryIndex !== -1) {
                recentSearchArray.splice(queryIndex, 1);
                recentSearchArray.push(query);
                console.log(recentSearchArray);
            } else {
                if (recentSearchArray.length < recentResultsNum) {
                    recentSearchArray.push(query);
                } else {
                    recentSearchArray.shift();
                    recentSearchArray.push(query);
                }
            }
            localStorage.setItem("recentSearchArray", JSON.stringify(recentSearchArray));
            myTemplateEngine.recentSearchTemplate(recentSearchArray);
        }


        //todo: name should change (search recent)
        function manageRecentItemClick(capturedRecentItemQueryData) {
            console.log(capturedRecentItemQueryData);
        }

        //todo: name should change (preiview item)
        function manageResultItemClick(capturedResultItemID) {
            console.log(capturedResultItemID);
        }

        //TODO : pagination
        //TODO: preview
        //TODO: player

        return {
            updateResultBaseOnSearchState,
            manageRecentItemClick,
            manageResultItemClick
        }
    }

// view Constructor
    function TemplateEngine() {
        function detailTemplate() {
            const container = document.createElement('div');
            container.setAttribute('id', templates.DETAIL.ID_HOOK);
            container.className = "app__detail";
            rootIdNode = rootIdNode || document.getElementById(templates.ROOT);
            rootIdNode.appendChild(container);

            searchTemplate();
        }

        function masterTemplate() {
            let container = document.createElement('div');
            container.setAttribute('id', templates.MASTER.ID_HOOK);
            container.className = "app__master";
            rootIdNode = rootIdNode || document.getElementById(templates.ROOT)
            rootIdNode.appendChild(container);
        }

        function searchTemplate() {
            const container = document.createElement('div');
            const containerInput = document.createElement('input');
            const containerButton = document.createElement('button');

            container.setAttribute('id', templates.SEARCH.ID_HOOK);
            container.className = "search";

            containerInput.setAttribute('id', templates.SEARCH_INPUT.ID_HOOK);
            containerInput.setAttribute('placeholder', text.INPUT_PLACEHOLDER);
            containerInput.className = "search__input";

            containerButton.setAttribute('id', templates.SEARCH_BUTTON.ID_HOOK);
            containerButton.className = "search__btn";

            detailIdNode = detailIdNode || document.getElementById(templates.DETAIL.ID_HOOK);
            detailIdNode.appendChild(container);
            searchIdNode = searchIdNode || document.getElementById(templates.SEARCH.ID_HOOK);
            searchIdNode.appendChild(containerInput);
            searchIdNode.appendChild(containerButton);
        }

        /**
         * render results UI
         * @param resultsArrayAsParam
         * check: is rendered, if not: create container.
         *
         */
        function resultsTemplate(resultsArrayAsParam) {
            if (!resultsIdNode) {
                const container = document.createElement('div');
                container.setAttribute('id', templates.RESULTS.ID_HOOK);
                container.className = "results";
                detailIdNode = detailIdNode || document.getElementById(templates.DETAIL.ID_HOOK);
                detailIdNode.appendChild(container);
            }
            for (let i = 0; i < resultsArrayAsParam.length; i++) {
                let containerItem = document.createElement('div');
                containerItem.classList.add('results__item', 'results__item--default');
                containerItem.setAttribute('onclick', "triggerResultItemClickEvent(this)");
                resultsIdNode = resultsIdNode || document.getElementById(templates.RESULTS.ID_HOOK);
                resultsIdNode.appendChild(containerItem);
                containerItem.setAttribute('id', resultsArrayAsParam[i].id);
                containerItem.innerText = resultsArrayAsParam[i].title;
            }
        }

        function removeResults() {
            resultsIdNode = resultsIdNode || document.getElementById(templates.RESULTS.ID_HOOK);
            resultsIdNode.innerHTML = '';
        }

        /**
         * render recent search UI
         * @param recentSearchArrayAsParam
         */
        function recentSearchTemplate(recentSearchArrayAsParam) {
            if (recentResults === false) {
                const container = document.createElement('div');
                container.setAttribute('id', templates.RECENT.ID_HOOK);
                container.classList.add('app__recent');
                rootIdNode = rootIdNode || document.getElementById(templates.ROOT);
                rootIdNode.appendChild(container);

                const containerTitle = document.createElement('div');
                containerTitle.classList.add('results__title');

                recentIdNode = recentIdNode || document.getElementById(templates.RECENT.ID_HOOK);
                recentIdNode.appendChild(containerTitle);
                containerTitle.innerText = text.RECENT_RESULTS_TITLE;

                for (let i = 0; i < recentSearchArrayAsParam.length; i++) {
                    const containerItem = document.createElement('div');
                    containerItem.classList.add('results__item', 'results__item--recent');
                    recentIdNode.appendChild(containerItem);
                    containerItem.setAttribute('onclick', "triggerRecentItemClickEvent(this)");
                    containerItem.innerText = recentSearchArrayAsParam[i];
                }
                recentResults = true;

            } else {
                recentIdNode.innerHTML = '';
                const containerTitle = document.createElement('div');
                containerTitle.innerText = text.RECENT_RESULTS_TITLE;
                containerTitle.classList.add('results__title');
                recentIdNode.appendChild(containerTitle);

                for (let i = 0; i < recentSearchArrayAsParam.length; i++) {
                    const containerItem = document.createElement('div');
                    containerItem.classList.add('results__item', 'results__item--recent');
                    recentIdNode.appendChild(containerItem);
                    containerItem.setAttribute('onclick', "triggerRecentItemClickEvent(this)");
                    containerItem.innerText = recentSearchArrayAsParam[i];
                }
            }
        }

        return {
            detailTemplate,
            resultsTemplate,
            recentSearchTemplate,
            masterTemplate,
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

})();
