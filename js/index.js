"use strict";

const view = {
    clearSearch: () => {
        const results = document.getElementById('results');
        results.remove();
        console.log("search removed");
    },
    renderSearch: () => {
        const search = document.createElement('search');
        search.setAttribute('id', 'search');

        const input = document.createElement('input');
        input.setAttribute('id', 'input');
        input.setAttribute('placeholder', "search some shit");
        input.className = "form-control";

        const submit = document.createElement('button');
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
};

const model = {
    recentSearch: [],
    songs: {},
    songsLength: 6,
    searchState: "",
    searchValue: "",
    getSongs: (arg) => {
        if (model.searchState === true) {
            view.clearSearch();
            model.searchState = "";
        }
        SC.get('/tracks', {
            limit: model.songsLength,
            q: arg
        }).then(function (tracks) {
            model.songs.collection = tracks;
            // print using view
            view.renderResults(model.songs.collection);
            model.recentSearch.push(model.searchValue);
            model.searchState = true;
            console.log(this.recentSearch);
        });
        console.log(model.searchState, "got songs, changed state, pushed value, promise event");
    },
    navigateSongs: (arg) => {
    }
};

const controller = {
    renderInit: view.renderSearch(),
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
            if (model.searchValue !== controller.searchInput.value) {
                model.searchValue = controller.searchInput.value;
                model.getSongs(model.searchValue);
            }
        },
    keySearch: (e) => {
        if (e.keyCode === 13) {
            controller.submitSearch();
            return false;
        }
    },
    keyInput: (e) => {
        if (e.keyCode === 13) {
            controller.submitSearch();
            return false;
        }
    },
    navigateSongs: () => {
    }
};

window.onload = controller.init;


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

// creating OO approach
var View = function(){
    var someparam =  0;

    var a1 = function(){
        console.log('a1 ' + someparam++);
    };

    var b1 = function(){
        console.log('a1 ' + someparam++);
    };

    return {
        a1: a1,
        b1: b1
    }
} 