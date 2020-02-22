import xpath from 'xpath'
import { DOMParser as dom } from 'xmldom'
// import pretty from 'pretty'

// 检测xpath表达式结尾是不是@A-z
const re = /@[A-z]+$/

function parse(html, rules) {
    let item = {}
    let htmlDoc = new dom({ errorHandler: { warning: function (w) { } } }).parseFromString(html)

    for (let { name, expression } of rules) {

        let value = null

        if (re.test(expression)) {
            // attribute
            let content = xpath.select1(expression, htmlDoc)
            if (content) {
                value = content.value
            }
        } else {
            // node
            let content = xpath.select(expression, htmlDoc, true)
            if (content) {
                value = content.toString()
            }
        }

        item[name] = value
    }

    return item
}

export default parse