import libxml from "libxmljs"

function parse(html, rules) {
    let item = {}
    let htmlDoc = libxml.parseHtmlFragment(html)

    for (let { name, expression } of rules) {
        let result = htmlDoc.get(expression)
        if (result != null) {
            let value = result.type() == 'attribute' ? result.value() : result.toString('html')
            item[name] = value
        }
    }

    return item
}

export default parse