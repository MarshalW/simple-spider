import createClone from 'rfdc'
const clone = createClone()

import { minify } from 'html-minifier'

import logger from './logger'
import libxmlParse from './parser-libxml'
// import xpathParse from './parser-xpath'
import { preParse, afterParse } from './ext'

const parseArray = [
    // xpathParse,
    libxmlParse,
]

function parse(url, html, rules) {
    html = preParse(url, html)

    for (let runParse of parseArray) {
        try {
            let item = runParse(html, rules)
            item = afterParse(url, html, clone(item))
            item.url = url
            logger.info({
                item
            })
            break
        } catch (e) {
            try {
                html = minify(html, { collapseWhitespace: true })
            } catch (e) { }

            logger.error({
                type: 'parseHtml.error',
                url,
                html,
                detail: e.stack
            })
        }
    }
}

export default parse