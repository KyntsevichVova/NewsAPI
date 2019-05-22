const MAX_DISPLAYED = 40;

export default function View() {
    this.displayed = 0;
    this.moreButtonDisplayed = true;
    this.failMessageDisplayed = false;
}

View.prototype.showSources = function(sources) {
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

View.prototype.showRequest = function(batch, hasMore) {
    this.clear();
    if (batch.length > 0) {
        if (this.failMessageDisplayed) {
            hide("failMessage");
            this.failMessageDisplayed = false;
        }
        this.appendArticles(batch, hasMore);
    } else if (!this.failMessageDisplayed) {
        show("failMessage");
        this.failMessageDisplayed = true;
        this.appendArticles(batch, hasMore);
    }
}

View.prototype.appendArticles = function(batch, hasMore) {
    const wrapper = document.getElementById("contentWrapper");
    const template = document.getElementById("contentElementTemplate");

    let fragment = document.createDocumentFragment();
    batch.forEach(element => {
        if (this.displayed < MAX_DISPLAYED) {
            fragment.appendChild(createArticle(template.content.cloneNode(true), element));
            this.displayed++;
        }
    });
    wrapper.appendChild(fragment);
    if (this.displayed < MAX_DISPLAYED && hasMore) {
        if (!this.moreButtonDisplayed) {
            show("moreButton");
            this.moreButtonDisplayed = true;
        }
    } else {
        if (this.moreButtonDisplayed) {
            hide("moreButton");
            this.moreButtonDisplayed = false;
        }
    }
}

function createArticle(node, article) {
    node.querySelector(".contentElementImg").style.backgroundImage = `url("${article.urlToImage}")`;
    node.querySelector(".articleLink").setAttribute("href", article.url);
    node.querySelector(".articleTitle").textContent = article.title;
    let info = article.source.name;
    if (article.publishedAt) {
        let date = new Date(article.publishedAt);
        info += ', ' + date.toLocaleString("en-US", {
            hour12: false, day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
    }
    if (article.author) {
        info += ', Author: ' + article.author;
    }
    node.querySelector(".articleInfo").textContent = info;
    node.querySelector(".articleBody").textContent = article.description;
    return node;
}

function hide(id) {
    document.getElementById(id).style.display = 'none';
}

function show(id) {
    document.getElementById(id).style.display = 'unset';
}