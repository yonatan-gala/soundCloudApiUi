"use strict";

// controller Constructor
function Controller() {
    const apiID = 'E8IqLGTYxHll6SyaM7LKrMzKveWkcrjg';

    // checks
    console.log("Model instance pre creation check");
    let myModel = new Model();

    // checks
    console.log("Model instance post creation check");

    let submitValue;
    let inputValueChange;
    submitlistener();

    //checks
    console.log("Model Says submit button listener is initilized");

    // API method
    SC.initialize({
        client_id: apiID
    });

    function submitlistener() {
        //todo:  these should be taken from the templateManager.
        let input = document.getElementById("input");
        let submitButton = document.getElementById("submit");
        //
        submitButton.addEventListener('click', () => {
            if (submitValue !== input.value) {
                //checks
                console.log("submit value is sent from controller listener to model:", submitValue);
                submitValue = input.value;

                //checks
                console.log("Controler sent request to model for search results");
                myModel.resultsApiGet(submitValue);

                //for clearing i need to make search active avilable
                //than if it is true, only than clear.
            }
        });
    }

    function keySearch() {
    }

    function navigateResults() {

    }
}

// model Contructor
function Model() {
    const resultDisplayLength = 6;
    let myView = new View();
    // checks
    console.log("model Says, view instance created");

    myView.callLayout()

    //checks
    console.log("model Says, myView.callLayout is invoked");

    let searchValue;
    let searchState;

    let recentSearch = [];

    let resultApiArray = [];
    let resultsPartitionCount = 1;


    // setter

    //methods
    function resultsApiGet(arg) {
        searchValue = arg;
        searchState = true;
        recentSearch.push(searchValue);

        //checks
        console.log("model Says search value is: ", searchValue);
        console.log("model Says search state is: ", searchState);
        console.log("model Says recent search array is: ", recentSearch);

        // API Promise
        SC.get('/tracks', {
            limit: resultDisplayLength,
            linked_partitioning: resultsPartitionCount,
            q: arg
        }).then(function (tracks) {
            resultApiArray = tracks;
            myView.callResults(resultApiArray);

            // checks
            console.log("model Says array from API is:", resultApiArray);
        });
    }

    function clearResults() {
      // this should make it all go away...

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

    return {
        resultsApiGet,
        clearResults
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

    function resetResults() {

    }

    return {
        callLayout,
        callResults,
    };
}

// templateGenerator Constructor
function TemplateGenerator() {
    let resultsContainer = document.createElement('results');
    resultsContainer.setAttribute('id', 'results');
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

    let message = document.createElement('message');
    message.innerText = "shit face";

    // methods
    function renderLayout() {

        document.getElementById('app').appendChild(detail);
        document.getElementById('app').appendChild(master);
        document.getElementById('detail').appendChild(search);
        document.getElementById('search').appendChild(input);
        document.getElementById('search').appendChild(submit);
    }

    function renderResults(arg) {
        document.getElementById('detail').appendChild(resultsContainer);
        if (arg.collection.length > 0) {
            for (let i = 0; i < arg.collection.length; i++) {
                let result = document.createElement('results__item');
                resultsContainer.appendChild(result);
                result.innerText = arg.collection[i].title;
            }
        } else {
            resultsContainer.appendChild(message);
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

    function clearResults() {
        console.log("rrrrrrrrrrrrrrrr");
    }

    function clearPreviewImage() {
        //  default image for a new search state
    }

    return {
        renderLayout,
        renderResults,
        clearResults
    }
}


function init() {
    //check
    console.log("controller instance pre creation");

    let myController = new Controller();

    //check
    console.log("controller post creation");
}

window.onload = init;