import './style.css';

import Model from './model.js';
import View from './view.js';

let model = new Model();
let view = new View();

model.loadSources().then((value) => {
    view.showSources(value.sources);
});

model.loadRequest().then(() => {
    view.showRequest(model.nextBatch(), model.hasMore());
});

const getQuery = function() {
    let request = document.getElementById("requestInput").value;
    return request.trim();
}

document.getElementById("sourceFilter").addEventListener("click", e => {
    if (e.target.classList.contains("sourceButton")) {
        if (model.toggleSource(e.target.id)) {
            document.getElementById(e.target.id).classList.add("activeFilter");
        } else {
            document.getElementById(e.target.id).classList.remove("activeFilter");
        }
        model.loadRequest({q: getQuery()}).then(() => {
            view.showRequest(model.nextBatch(), model.hasMore());
        });
    }
});

document.getElementById("requestButton").addEventListener("click", e => {
    e.preventDefault();
    model.loadRequest({q: getQuery()}).then(() => {
        view.showRequest(model.nextBatch(), model.hasMore());
    });
});

document.getElementById("requestInput").addEventListener("keyup", e => {
    e.preventDefault();
    if (e.keyCode == 13) 
        document.getElementById("requestButton").click();
});

document.getElementById("moreButton").onclick = function() {
    view.appendArticles(model.nextBatch(), model.hasMore());
}