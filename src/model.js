const key = "158b90ae4f0d4b918241c1c3e69335ed";

export default function Model() {
    this.loaded = [];
    this.source = undefined;
}

Model.prototype.setSource = function(source) {
    if (this.source == source) {
        this.source = undefined;
    } else {
        this.source = source;
    }
    return this.source;
}

Model.prototype.loadSources = async function() {
    const url = `https://newsapi.org/v2/sources?apiKey=${key}`;
    const req = new Request(url);
    return (await (await fetch(req)).json()).sources;
}

Model.prototype.loadRequest = async function(request = {}) {
    const endpoint = request.endpoint || "top-headlines";
    let url = `https://newsapi.org/v2/${endpoint}?`;
    request.endpoint = undefined;
    request.sources = this.source;
    if (!request.sources) {
        request.country = "us";
    } else {
        request.country = undefined;
    }
    request = Object.entries(request);
    for (const [key, value] of request) {
        if (value) {
            url += `${key}=${encodeURI(value)}&`;
        }
    }
    url += `pageSize=40&apiKey=${key}`;
    const req = new Request(url);
    let res = (await (await fetch(req)).json()).articles;
    if (res && res.length) {
        this.loaded = res;
    } else {
        this.loaded = [];
    }
}