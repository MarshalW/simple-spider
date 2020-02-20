import libxml from "libxmljs"
import logger from './logger'

function parse(url, html, rules) {
    let article = { url }

    let htmlDoc = libxml.parseHtmlString(html)

    let item = {}

    for (let { name, expression } of rules) {
        let result = htmlDoc.get(expression)
        let value = result.type() == 'attribute' ? result.value() : result.toString('heml')
        item[name] = value
    }

    logger.info({
        item
    })
}

export default parse