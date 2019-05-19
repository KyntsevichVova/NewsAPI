const MAX_DISPLAYED = 40;
const BATCH_SIZE = 5;

export default function View(model) {
    this.model = model;
    this.displayed = 0;
    this.moreButtonDisplayed = true;
    this.failMessageDisplayed = false;
}

View.prototype.showSources = async function() {
    let sources = await this.model.loadSources();
    const filter = document.getElementById("sourceFilter");
    const template = document.getElementById("sourceTemplate");
    sources.forEach(element => {
        let node = template.content.cloneNode(true).querySelector(".sourceButton");
        node.textContent = element.name;
        node.id = element.id;
        filter.appendChild(node);
    });
}

View.prototype.clear = function() {
    let wrapper = document.getElementById("contentWrapper");
    while (wrapper.hasChildNodes()) {
        wrapper.removeChild(wrapper.firstChild);    
    }
    this.displayed = 0;
}

View.prototype.showRequest = async function(request) {
    this.clear();
    await this.model.loadRequest(request);
    if (this.model.loaded.length > 0) {
        if (this.failMessageDisplayed) {
            hide(".failMessage");
            this.failMessageDisplayed = false;
        }
        this.appendArticles();
    } else if (!this.failMessageDisplayed) {
        show(".failMessage");
        this.failMessageDisplayed = true;
        this.appendArticles();
    }
}

View.prototype.appendArticles = function() {
    const wrapper = document.getElementById("contentWrapper");
    const template = document.getElementById("contentElementTemplate");

    let fragment = document.createDocumentFragment();
    let i = 0;
    while (i < BATCH_SIZE && this.displayed < MAX_DISPLAYED && this.displayed < this.model.loaded.length) {
        fragment.appendChild(createArticle(template.content.cloneNode(true), this.model.loaded[this.displayed++]));
        i++;
    }
    wrapper.appendChild(fragment);
    if (this.displayed < MAX_DISPLAYED && this.displayed < this.model.loaded.length) {
        if (!this.moreButtonDisplayed) {
            show(".moreButton");
            this.moreButtonDisplayed = true;
        }
    } else {
        if (this.moreButtonDisplayed) {
            hide(".moreButton");
            this.moreButtonDisplayed = false;
        }
    }
}

function createArticle(node, article) {
    node.querySelector(".contentElementImg").style.backgroundImage = `url("${article.urlToImage}")`;
    node.querySelector(".articleLink").setAttribute("href", article.url);
    node.querySelector(".articleTitle").textContent = article.title;
    node.querySelector(".articleSource").textContent = article.source.name + ",";
    let date = new Date(article.publishedAt);
    node.querySelector(".articleDate").textContent = date.toLocaleString("en-US", {day: "2-digit", month: "long", year: "numeric"});
    node.querySelector(".articleBody").textContent = article.description;
    return node;
}

function hide(selector) {
    document.querySelector(selector).style.display = 'none';
}

function show(selector) {
    document.querySelector(selector).style.display = 'unset';
}