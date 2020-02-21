import libxml from "libxmljs"
import logger from './logger'

function parse(url, html, rules) {
    let article = { url }

    let htmlDoc = libxml.parseHtmlString(html)

    let item = {}

    for (let { name, expression } of rules) {
        let result = htmlDoc.get(expression)
        // console.log({ url, name, expression })
        if (result != null) {
            let value = result.type() == 'attribute' ? result.value() : result.toString('html')
            item[name] = value
        }

    }

    logger.info({
        item
    })
}

export default parse