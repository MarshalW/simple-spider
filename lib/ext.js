
function preParse(url, html) {
    return html
}

function afterParse(url, html, item) {
    return item
}

export { preParse, afterParse }