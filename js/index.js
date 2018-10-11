"use strict";

// controller Constructor
function Controller() {
    const apiID = 'EBquMMXE2x5ZxNs9UElOfb4HbvZK95rc';

    let myModel = new Model();
    let submitValue;

    submitlistener();
    SC.initialize({
        client_id: apiID
    });

    function submitlistener() {
        //todo:  these should be taken from the templateManager.
        let input = document.getElementById("input");
        let submitButton = document.getElementById("submit");
        //
        submitButton.onclick = () => {
            console.log(input.value);
            submitValue = input.value;
            myModel.resultsApiGet(submitValue);
            submitValue = false;
        }
    }

    function keySearch() {
    }

    function navigateResults() {

    }

}


// model Contructor
function Model() {
    let myView = new View();
    myView.callLayout()
    const resultDisplayLength = 6;
    let resultApiArray = [];
    let recentSearch = [];
    let searchState = "";
    let resultsPartitionCount = 0;

    // setter

    // getter

    //methods
    function resultsApiGet(arg) {
        SC.get('/tracks', {
            limit: resultDisplayLength,
            q: arg
        }).then(function (tracks) {
            resultApiArray = tracks;
            myView.callResults(resultApiArray);
            resultApiArray = "";
        });
    }

    function resultsApiGetPratition(arg) {
        if (arg === "next") {
            if (haveResults) {
                // update partitionCounter
                // go next
                resultsPartitionCount++;
                resutsApiGet()
                // console.log("going next")
            }

        } else {
            // go prev
            resultsPartitionCount--;
            resutsApiGet()
        }

    }

    function clearResults() {
        // clear results
    }

    return {
        resultsApiGet
    }
}

// view Constructor
function View() {
    let myTemplateGenerator = new TemplateGenerator();

    function callLayout() {
        return myTemplateGenerator.renderLayout();
    }

    function callResults(arg) {
        return myTemplateGenerator.renderResults(arg);
    }

    return {
        callLayout,
        callResults
    };
}

// templateGenerator Constructor
function TemplateGenerator() {
    // methods
    function renderLayout() {
        const detail = document.createElement('detail');
        detail.setAttribute('id', 'detail');

        const master = document.createElement('master');
        master.setAttribute('id', 'master');

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
        document.getElementById('app').appendChild(detail);
        document.getElementById('app').appendChild(master);
        document.getElementById('detail').appendChild(search);
        document.getElementById('search').appendChild(input);
        document.getElementById('search').appendChild(submit);
    }

    function renderResults(arg) {
        let resultsContainer = document.createElement('results');
        resultsContainer.setAttribute('id', 'results')
        document.getElementById('detail').appendChild(resultsContainer);
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
    }

    function renderNextPagination() {
        // render pagination Next button
    }

    function renderPrevPagination() {
        // render pagination Prev button
    }

    function renderPreviewImage() {
        // clicked result image
    }

    function renderTrackPlayer() {
        //
    }

    function renderQueries() {
    }

    function clearSearch() {
        // remove results from Dom
    }

    function clearPreviewImage() {
        //  default image for a new search state
    }

    return {
        renderLayout,
        renderResults
    }
}

// events handler
function eventListener() {

}


function init() {
    let myController = new Controller();
}

window.onload = init;