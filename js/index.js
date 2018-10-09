"use strict";

// ## results flow:
// 1. search by submit button or enter key.


// ## View:
// 1. render search container.
// 2. render results items
// 3. render pagination.
// 4. render item image.
// 5. render messages.


// ## Controller,handling the user input


// ## event handlers:
//   1. click event on submit.
//   2. click event on clear, invoked only when present.
//   2. click event on results, invoked only when present.
//   3. click event on result image, invoked only when present.
//   4. click event on close track. invoked only when present. (close button is optional)
//   5. click event on past search item, invoked only when present. (optional).

const view = {
    search: {},
    results: {
        renderResults: (songs) => {
            let resultsContainer = document.createElement("div");
            resultsContainer.className = "results";
            document.getElementById("app").appendChild(resultsContainer);
            if (songs.length > 0) {
                for (let i = 0; i < songs.length; i++) {
                    let result = document.createElement("div");
                    result.className = "results__item";
                    resultsContainer.appendChild(result);
                    result.innerText = songs[i].title;
                }
            } else {
                let message = document.createElement("div");
                message.className = "results__message";
                resultsContainer.appendChild(message);
                message.innerText = "shit face";
            }
        },
    },
    recentSearch: (recentSearch) => {
    },
    preview: "TBD"
};

const model = {
    recentSearch: [],
    songs: [],
    songsLength: 6,
    searchState: false,
    getSongs: (arg) => {
        SC.get('/tracks', {
            limit: model.songsLength,
            // linked_partitioning: 100,
            q: arg
        }).then(function (tracks) {
            model.songs = tracks;
            // print using view
            view.results.renderResults(model.songs);
            model.recentSearch.push(searchValue);
        });
        model.searchState = true;
        console.log(model.searchState, "got songs, changed state, pushed value, promise event");
    },
};

const controller = {
        searchInput: document.getElementById("input"),
        searchSubmitButton: document.getElementById("submit"),
        id: 'EBquMMXE2x5ZxNs9UElOfb4HbvZK95rc',
        init: () => {
            SC.initialize({
                client_id: controller.id
            });
            controller.searchSubmitButton.onclick = controller.submitSearch;
            controller.searchInput.onkeypress = controller.keySearch;
        },
        submitSearch:
            () => {
                let searchValue = controller.searchInput.value;
                if (model.searchState === false) {
                    if (searchValue) {
                        model.getSongs(searchValue);
                    }
                } else {
                    controller.searchInput.value = "";
                    model.searchState = false;
                    console.log(model.searchState, "changed state, cleared value");
                }
            },
        keySearch: (e) => {
            if (e.keyCode === 13) {
                controller.submitSearch();
                return false;
            }
        }
    }
;

window.onload = controller.init;
