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
    search: {
        renderSearch: () => {
            let search = document.createElement('search');
            search.setAttribute('id', 'search');

            let input = document.createElement('input');
            input.setAttribute('id', 'input');
            input.setAttribute('placeholder', "search some shit");
            input.className = "form-control";

            let submit = document.createElement('button');
            submit.setAttribute('id', 'submit');
            submit.classList.add("btn", "btn--primary");
            submit.innerText = "search";

            document.getElementById('app').appendChild(search);
            document.getElementById('search').appendChild(input);
            document.getElementById('search').appendChild(submit);
        }
    },
    results: {
        renderResults: (songs) => {
            let resultsContainer = document.createElement('results');
            document.getElementById('app').appendChild(resultsContainer);
            if (songs.length > 0) {
                for (let i = 0; i < songs.length; i++) {
                    let result = document.createElement('results__item');
                    result.setAttribute('data-id', i + 1);
                    resultsContainer.appendChild(result);
                    result.innerText = songs[i].title;
                }
            } else {
                let message = document.createElement('message');
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
            //linked_partitioning: 1,
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
        renderInit: view.search.renderSearch(),
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
