import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const queryParamsDiv = document.querySelector("[data-query-params]");
const requestParamsDiv = document.querySelector("[data-request-headers]");
const template = document.querySelector("[data-key-value-template]");
const addQueryParamButton = document.querySelector("[data-add-query-param-btn]");
const addRequestHeaderButton = document.querySelector("[data-add-request-header-btn]");

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
})

// add new request header
addRequestHeaderButton.addEventListener('click', (e) => {
    requestParamsDiv.append(createNewRequestHeader());
})