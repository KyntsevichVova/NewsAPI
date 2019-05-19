import './style.css';

import Model from './model.js';
import View from './view.js';

let model = new Model();
let view = new View(model);

view.showSources();
view.showRequest();

const getQuery = function() {
    let request = document.getElementById("requestInput").value;
    request = request.trim();
    return request;
}

document.getElementById("sourceFilter").addEventListener("click", e => {
    if (e.target.classList.contains("sourceButton")) {
        let oldSource = model.source;
        if (model.setSource(e.target.id)) {
            view.showRequest({endpoint: "everything", q: getQuery()});
            if (oldSource)
                document.getElementById(oldSource).classList.remove("activeFilter");
            document.getElementById(e.target.id).classList.add("activeFilter");
        } else {
            document.getElementById(e.target.id).classList.remove("activeFilter");
            view.showRequest({q: getQuery()});
        }
    }
});

document.getElementById("requestButton").addEventListener("click", e => {
    e.preventDefault();
    view.showRequest({q: getQuery()});
});

document.getElementById("requestInput").addEventListener("keyup", e => {
    e.preventDefault();
    if (e.keyCode == 13) 
        document.getElementById("requestButton").click();
});

document.getElementById("moreButton").onclick = view.appendArticles.bind(view);