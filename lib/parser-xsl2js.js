import xml2js from 'xml2js'
import xpath from 'xml2js-xpath'

function parse(html, rules) {
    let item = {}
    let htmlDoc = new dom().parseFromString(html)

    // xml2js.parseString('<root><element id="15">target</element></root>', function(err, json) {
    //     // find all elements: returns xml2js JSON of the element
    //     var matches = xpath.find(json, "//element");

    //     // find the first element, and get its id:
    //     var matches = xpath.evalFirst(json, "//element", "id");

    //     // Extract text representation of XML document:
    //     assert xpath.jsonText(json) === 'target';
    //   });

    return item
}