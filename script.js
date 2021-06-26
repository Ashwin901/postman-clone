import axios from 'axios';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import prettyBytes from 'pretty-bytes';
import editors from "./editor";

const queryParamsDiv = document.querySelector("[data-query-params]");
const requestParamsDiv = document.querySelector("[data-request-headers]");
const template = document.querySelector("[data-key-value-template]");
const addQueryParamButton = document.querySelector("[data-add-query-param-btn]");
const addRequestHeaderButton = document.querySelector("[data-add-request-header-btn]");
const form = document.querySelector("[data-form]");
const responseHeadersDiv = document.querySelector("[data-response-headers]");
// we get the response and request json editors from here
const {requestEditor, updateResponseEditor} = editors();

// <--- axios interceptors ---> //
// adding interceptors to axios to handle error and get the time required for the request
// this intercepts the request sent by us through axios.
axios.interceptors.request.use(request => {
    request.customData = request.customData || {};
    request.customData.startTime = new Date().getTime();
    return request;
});

// this intercepts the response received by axios
axios.interceptors.response.use(updateEndTime, e => {
    return Promise.reject(updateEndTime(e.response));
});

function updateEndTime(response) {
    response.customData = response.customData || {};
    response.customData.time = new Date().getTime() - response.config.customData.startTime;

    return response;
}

// <-- --> //

// <--- request section ---> //
queryParamsDiv.append(createNewQueryParam());
requestParamsDiv.append(createNewRequestHeader());

// default key-value pair for query param
function createNewQueryParam() {
    const newQueryParam = template.content.cloneNode(true);

    const removeButton = newQueryParam.querySelector("[data-remove-btn]");
    removeButton.addEventListener("click", (e) => {
        e.target.closest("[data-key-value-pair]").remove();
    });
    return newQueryParam;
}

// default key-value pair for request header
function createNewRequestHeader() {
    const newRequestHeader = template.content.cloneNode(true);

    const removeButton = newRequestHeader.querySelector("[data-remove-btn]");
    removeButton.addEventListener("click", (e) => {
        e.target.closest("[data-key-value-pair]").remove();
    });

    return newRequestHeader;
}

// add new query params
addQueryParamButton.addEventListener('click', (e) => {
    queryParamsDiv.append(createNewQueryParam());
});

// add new request header
addRequestHeaderButton.addEventListener('click', (e) => {
    requestParamsDiv.append(createNewRequestHeader());
});

// get the json data from response editor
let jsonData;

try{
    jsonData = JSON.parse(requestEditor.state.doc.toString() || null);
}catch(e){
    console.log("Please enter valid json");
}

// handles submission of form
form.addEventListener("submit", (e) => {
    e.preventDefault();

    axios({
        url: document.querySelector("[data-url]").value,
        method: document.querySelector("[data-method]").value,
        params: getKeyValuePairs(queryParamsDiv),
        headers: getKeyValuePairs(requestParamsDiv),
        jsonData
    }).catch(err => err)
        .then((response) => {
            document.querySelector("[data-response-section]").classList.remove("d-none");
            getResponseDetails(response);
            getResponseHeaders(response.headers);
            updateResponseEditor(response.data);
        });
});

// to get query params and headers sent in the request from html
function getKeyValuePairs(container) {
    const pairs = document.querySelectorAll("[data-key-value-pair]");
    return [...pairs].reduce((data, pair) => {
        const key = pair.querySelector("[data-key]").value;
        const value = pair.querySelector("[data-value]").value;

        if (key === '') return data;
        return { ...data, [key]: value };
    }, {});
}

// <--- response section -----> //

function getResponseDetails(response) {
    document.querySelector("[data-status]").textContent = response.status;
    document.querySelector("[data-time]").textContent = response.customData.time;
    document.querySelector("[data-size]").textContent = prettyBytes(
        JSON.stringify(response.data).length + JSON.stringify(response.headers).length
    );
}

function getResponseHeaders(headers) {
    responseHeadersDiv.innerHTML = "";

    Object.entries(headers).forEach(([key, value]) => {
        const keyElement = document.createElement('div');
        keyElement.innerText = key;
        responseHeadersDiv.append(keyElement);
        const valueElement = document.createElement('div');
        valueElement.innerText = value;
        responseHeadersDiv.append(valueElement);
    });
}