import libxml from "libxmljs"

import logger from './logger'

function parse(url, html, rules) {
    let item = { url }
    let htmlDoc = null

    try {
        htmlDoc = libxml.parseHtmlFragment(html)
    } catch (e) {

        item.error = {
            type: 'parseHtml.error',
            detail: e
        }

        logger.error(item)
    }

    if (htmlDoc != null) {
        for (let { name, expression } of rules) {
            let result = htmlDoc.get(expression)
            // console.log({ url, name, expression })
            if (result != null) {
                let value = result.type() == 'attribute' ? result.value() : result.toString('html')
                item[name] = value
            }
        }
    }

    logger.info({
        item
    })
}

export default parse