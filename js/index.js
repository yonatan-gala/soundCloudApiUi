//"use strict";

//TODO: fly

(function () {
    const resultsNum = 6;
    const recentResultsNum = 5;
    const apiId = 'E8IqLGTYxHll6SyaM7LKrMzKveWkcrjg';
    const artWorkSetting = 'show_artwork=false';
    const autoPlayerSetting = 'auto_play=true';

    //
    let collectionPageNumber = 0;
    let resultsInit = false;
    let paginationInit = false;

    let recentResults = false;
    let hasPagination = false;

    let songsApiArray = [];
    let recentSearchArray = [];

    let inputContainerValue;
    let paginationHref;


    //
    let rootIdNode;
    let detailIdNode;
    let detailSearchIdNode;
    let searchIdNode;
    let inputContainerIdNode;
    let submitContainerIdNode;
    let detailResultsIdNode;
    let resultsIdNode;
    let paginationNodeId;
    let detailPaginationIdNode;
    let masterIdNode;
    let recentIdNode;

    const text = {
        INPUT_PLACEHOLDER: 'Search a song..',
        RECENT_RESULTS_TITLE: "Recent results"
    };

    const templates = {
        ROOT: 'app',
        DETAIL: {
            ID_HOOK: 'detail',
        },
        DETAIL_SEARCH: {
            ID_HOOK: 'detailSearch',
        },
        DETAIL_RESULTS: {
            ID_HOOK: 'detailResults',
        },
        DETAIL_PAGINATION: {
            ID_HOOK: 'detailRecent',
        },
        DETAIL_RECENT: {
            ID_HOOK: 'detailSearch',
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
        RECENT: {
            ID_HOOK: 'recent'
        },
        RECENT_RESULTS: {
            ID_HOOK: 'recentResults'
        },
        PAGINATION: {
            ID_HOOK: 'paginationContainer'
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

            /**
             * prevent sending submit without refreshing query.
             */
            function handleSubmitButton() {
                if (inputContainerValue !== inputContainerIdNode.value) {
                    inputContainerValue = inputContainerIdNode.value;
                    sendSubmitEvent(inputContainerIdNode.value);
                    collectionPageNumber = 0;
                }
            }

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
        function sendSubmitEvent(capturedInputValue) {
            myEventManager.updateResultBaseOnSearchState(capturedInputValue);

        }

        /**
         *
         * @param clickElement
         */
        function triggerRecentItemClickEvent(clickElement) {
            collectionPageNumber = 1;
            myEventManager.manageRecentItemSearch(clickElement.innerHTML);
        }

        /**
         *
         * @param clickElement
         */
        function triggerResultItemClickEvent(trackID) {
            myEventManager.manageResultItemPreview(trackID);
        }

        /**
         *
         * @param trackId
         */
        function triggerTrackClickEvent(trackId) {
            myEventManager.getTrackPlayer(trackId);
        }

        function triggerPaginationEvent() {
            console.log("boom");
            myEventManager.getNextSongs(inputContainerIdNode.value);

        }

        window.triggerResultItemClickEvent = triggerResultItemClickEvent;
        window.triggerRecentItemClickEvent = triggerRecentItemClickEvent;
        window.triggerTrackClickEvent = triggerTrackClickEvent;
        window.triggerPaginationEvent = triggerPaginationEvent;
    }

    function EventManager() {
        let myTemplateEngine = new TemplateEngine();
        myTemplateEngine.createLayout();
        // myTemplateEngine.detailTemplate();
        //myTemplateEngine.masterTemplate();

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
            getSongs(query);
        }

        /**
         * use the SoundCloud API to get the tracks Array.
         * update songApiArray with results
         * call the resultsTemplate function => to render results
         * call the manageRecentSearch function => to manage the recent results render
         * @param query
         */
        function getSongs(searchQuery) {
            SC.get('/tracks', {
                limit: resultsNum,
                linked_partitioning: 1,
                q: searchQuery,
            }).then(function (tracks) {
                songsApiArray = tracks.collection;
                console.log(tracks);
                myTemplateEngine.resultsTemplate(songsApiArray);
                manageRecentSearch(searchQuery);
                if (tracks.next_href !== null) {
                    hasPagination = true;
                    paginationHref = tracks.next_href;
                    collectionPageNumber += 6;
                    myTemplateEngine.paginationTemplate()
                } else {
                    hasPagination = false;
                }
            });
        }

        function getNextSongs(currentSearchQuery) {
            SC.get('/tracks', {
                limit: resultsNum,
                linked_partitioning: collectionPageNumber,
                q: currentSearchQuery,
            }).then(function (tracks) {
                songsApiArray = tracks.collection;
                console.log(tracks);
                myTemplateEngine.resultsTemplate(songsApiArray)
                if (tracks.next_href !== null) {
                    hasPagination = true;
                    paginationHref = tracks.next_href;
                    collectionPageNumber += 6;
                    myTemplateEngine.paginationTemplate()
                } else {
                    hasPagination = false;
                }
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

        /**
         * get param from recent item onclick ant decide whether to send forward to updatesearch
         * if current input and param are different then update value on container.
         * @param capturedRecentItemQueryData
         */
        function manageRecentItemSearch(capturedRecentItemQueryData) {
            inputContainerIdNode = inputContainerIdNode || document.getElementById(templates.SEARCH_INPUT.ID_HOOK);
            if (inputContainerIdNode.value !== capturedRecentItemQueryData) {
                inputContainerIdNode.value = capturedRecentItemQueryData;
                updateResultBaseOnSearchState(capturedRecentItemQueryData);
            }
        }

        /**
         *
         * @param capturedResultItemID
         */
        function manageResultItemPreview(capturedResultItemID) {
            let previewValue;
            for (let i = 0; i < songsApiArray.length; i++) {
                if (songsApiArray[i].id == capturedResultItemID) {
                    previewValue = songsApiArray[i].artwork_url;
                }
            }
            if (previewValue === null) {
                myTemplateEngine.previewTemplate(capturedResultItemID);
            } else {
                myTemplateEngine.previewTemplate(capturedResultItemID, previewValue);
            }
        }

        /**
         *
         * @param trackId
         */
        function getTrackPlayer(trackId) {
            myTemplateEngine.playerTemplate(trackId);
        }

        return {
            updateResultBaseOnSearchState,
            manageRecentItemSearch,
            manageResultItemPreview,
            getTrackPlayer,
            getNextSongs
        }
    }

// view Constructor
    function TemplateEngine() {
        /**
         * creating init ui by calling basic containers templates
         */
        function createLayout() {
            detailTemplate();
            detailSearchTemplate();
            detailResultsTemplate();
            detailPaginationTemplate();
            masterTemplate();
            recentTemplate();
        }

        /**
         * Detail UI
         * @type {*|HTMLElement}
         */
        function detailTemplate() {
            rootIdNode = rootIdNode || document.getElementById(templates.ROOT);
            const containerDetail = document.createElement('div');
            containerDetail.setAttribute('id', templates.DETAIL.ID_HOOK);
            containerDetail.className = "app__detail";
            rootIdNode.appendChild(containerDetail);
            detailIdNode = detailIdNode || document.getElementById(templates.DETAIL.ID_HOOK);
        }

        /**
         * Detail search UI
         * @type {HTMLElement}
         * nested function: searchTemplate
         */
        function detailSearchTemplate() {
            const containerDetailSearch = document.createElement('div');
            containerDetailSearch.setAttribute('id', templates.DETAIL_SEARCH.ID_HOOK);
            containerDetailSearch.className = "app__search";
            detailIdNode.appendChild(containerDetailSearch);
            detailSearchIdNode = detailSearchIdNode || document.getElementById(templates.DETAIL_SEARCH.ID_HOOK);

            searchTemplate();
        }

        /**
         * Detail results UI
         * @type {HTMLElement}
         */
        function detailResultsTemplate() {
            const containerDetailResults = document.createElement('div');
            containerDetailResults.setAttribute('id', templates.DETAIL_RESULTS.ID_HOOK);
            containerDetailResults.className = "app__results";
            detailIdNode.appendChild(containerDetailResults);
            detailResultsIdNode = detailResultsIdNode || document.getElementById(templates.DETAIL_RESULTS.ID_HOOK);

        }

        /**
         * Detail pagination UI
         * @type {HTMLElement}
         */
        function detailPaginationTemplate() {
            const containerDetailPagination = document.createElement('div');
            containerDetailPagination.setAttribute('id', templates.DETAIL_PAGINATION.ID_HOOK);
            containerDetailPagination.className = "app__pagination";
            detailIdNode.appendChild(containerDetailPagination);
            detailPaginationIdNode = detailPaginationIdNode || document.getElementById(templates.DETAIL_PAGINATION.ID_HOOK);

        }

        /**
         * Master UI
         * @type {HTMLElement}
         */
        function masterTemplate() {
            const containerMaster = document.createElement('div');
            containerMaster.setAttribute('id', templates.MASTER.ID_HOOK);
            containerMaster.className = "app__master";
            rootIdNode.appendChild(containerMaster);
            masterIdNode = masterIdNode || document.getElementById(templates.MASTER.ID_HOOK);

        }

        /**
         * Detail Recent Search UI
         * @type {HTMLElement}
         */
        function recentTemplate() {
            const containerRecent = document.createElement('div');
            containerRecent.setAttribute('id', templates.RECENT.ID_HOOK);
            containerRecent.className = "app__recent";
            rootIdNode.appendChild(containerRecent);
            recentIdNode = recentIdNode || document.getElementById(templates.ROOT.ID_HOOK);
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

            detailSearchIdNode.appendChild(container);
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
            if (resultsInit === false) {
                const container = document.createElement('div');
                container.setAttribute('id', templates.RESULTS.ID_HOOK);
                container.classList.add('results');
                detailResultsIdNode.appendChild(container);
                resultsIdNode = resultsIdNode || document.getElementById(templates.RESULTS.ID_HOOK);
            } else {
                resultsIdNode.innerHTML = '';
            }
            for (let i = 0; i < resultsArrayAsParam.length; i++) {
                const containerItem = document.createElement('div');
                containerItem.classList.add('results__item', 'results__item--default');
                containerItem.setAttribute('onclick', `triggerResultItemClickEvent(${resultsArrayAsParam[i].id})`);
                resultsIdNode.appendChild(containerItem);
                containerItem.setAttribute('id', resultsArrayAsParam[i].id);
                containerItem.innerText = resultsArrayAsParam[i].title;
            }
            resultsInit = true;
            masterIdNode.innerHTML = '';
        }

        function paginationTemplate() {
            if (paginationInit === false) {
                const container = document.createElement('div');
                container.setAttribute('id', templates.PAGINATION.ID_HOOK);
                container.classList.add('pagination');
                detailIdNode.appendChild(container);
                paginationNodeId = paginationNodeId || document.getElementById(templates.PAGINATION.ID_HOOK);
            } else {
                paginationNodeId.innerHTML = '';
            }
            const containerItem = document.createElement('button');
            containerItem.classList.add('pagination__item');
            containerItem.innerText = "Next >";
            containerItem.setAttribute('onclick', `triggerPaginationEvent()`);
            paginationNodeId.appendChild(containerItem);
            paginationInit = true;
        }

        /**
         *
         * @param previewID
         * @param previewValue
         */
        function previewTemplate(previewID, previewValue = null) {
            masterIdNode.innerHTML = '';
            const container = document.createElement('div');
            container.setAttribute('onclick', `triggerTrackClickEvent(${previewID})`);
            if (previewValue) {
                container.classList.add('card');
                const containerImage = document.createElement('img');
                containerImage.setAttribute('src', `${previewValue}`);
                containerImage.classList.add('card__img');
                container.appendChild(containerImage);
                // container.style = `background-image: url(${previewValue})`;
            } else {
                container.classList.add('card', 'card--no-preview');
            }
            masterIdNode.appendChild(container);
        }

        /**
         *
         * @param trackId
         */
        function playerTemplate(trackId) {
            const container = document.createElement('iframe');
            container.setAttribute('id', 'widgetIframe');
            container.classList.add('player');
            const playerConfig = artWorkSetting + '&' + autoPlayerSetting;
            container.setAttribute('src', `https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/${trackId}&${playerConfig}`);
            masterIdNode.appendChild(container);
        }

        /**
         * render recent search UI
         * @param recentSearchArrayAsParam
         */
        function recentSearchTemplate(recentSearchArrayAsParam) {
            if (recentResults === false) {


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
            createLayout,
            resultsTemplate,
            paginationTemplate,
            recentSearchTemplate,
            previewTemplate,
            playerTemplate
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
