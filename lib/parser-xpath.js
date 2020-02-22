import xpath from 'xpath'
import { DOMParser as dom } from 'xmldom'
import pretty from 'pretty'

// 不好用，有报错：
// [xmldom warning]        unclosed xml attribute 
// @#[line:267,col:412]

function parse(html, rules) {
    let item = {}
    let htmlDoc = new dom().parseFromString(pretty(html), 'text/html')

    for (let { name, expression } of rules) {
        let result = xpath.select(expression, htmlDoc)[0]
        if (result != null) {
            if (result.firstChild != null) {
                // is an element
                item[name] = result.firstChild.data
            } else if (result.value != null) {
                // is an attribute
                item[name] = result.value
            }
        }
    }

    return item
}

export default parse