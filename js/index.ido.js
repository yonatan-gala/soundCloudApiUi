"use strict";

const staticString = {
    ID_HOOKS: {
        rootId: 'app',
        searchInputId: 'searchInput',
        searchButtonId: 'searchButton',
        resultsItemId: 'resultsItem',
        paginateNext: 'paginateNext',
        paginatePrev: 'paginatePrev',
        previewItemId: 'previewItem',
        previewPlayerPlay: 'previewPlayerPlay',
        previewPlayerStop: 'previewPlayerStop',
    },
    SC: {
        API_ID: 'E8IqLGTYxHll6SyaM7LKrMzKveWkcrjg'
    }
};

// controller Constructor
function Controller() {
    // the controller scope is:
    // 1. API initialization
    //   -  Id
    //   -  SC, sound cloud SDK init.
    // 2. Event management
    //   - input
    //   - submit
    //   - result click
    //   - preview image click
    //   - recent search click


    // controller -> model

    // model -> controller
    this.modelCallback = function ({event, data}) {
        console.log('modelCallback ', event, data);
        switch (event) {
            case staticString.ID_HOOKS.paginateNext:
                break;
            case 'askNextPage':
                console.log('askNextPage', data);
                break;
            default:
                break;
        }
    };

    let myModel = new Model({
        callback: this.modelCallback.bind(this)
    });

    myModel.getNextData({nextPage: 6});

    let myView = new View({});

    // controller -> view
    // myView.mymethod

    // view -> controller

}

// model Constructor
function Model({callback}) {

    // API method
    SC.initialize({
        client_id: staticString.SC.API_ID
    });

    callback({event: 'SC_initialize', data: true});

    // this is my model state
    const getNextData = function ({nextPage}) {
        callback({event: 'askNextPage', data: 'ask data' + new Date()});
        setTimeout(function () {
            callback({event: 'askNextPage', data: 'got data' + new Date()});
        }, 2000);
        callback({event: 'askNextPage', data: 'method still not finished' + new Date()});
    };


    return {
        getNextData
    }
}

// view Constructor
function View({}) {

    function configComponenets() {
        // const idHooks = {
        //     rootId: 'app',
        //     searchInputId: 'searchInput',
        //     searchButtonId: 'searchButton',
        //     resultsItemId: 'resultsItem',
        //     paginateNext: 'paginateNext',
        //     paginatePrev: 'paginatePrev',
        //     previewItemId: 'previewItem',
        //     previewPlayerPlay: 'previewPlayerPlay',
        //     previewPlayerStop: 'previewPlayerStop',
        // };
        let compSearch = {
            parentId: '',
            compId: 'search',


        };

        return {idHooks}
    }

    return {
        configComponenets
    };
}

// Init
function init() {
    let myController = new Controller();
}

window.onload = init;