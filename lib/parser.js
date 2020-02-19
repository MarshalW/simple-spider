import libxml from "libxmljs"
import logger from './logger'

function parse(url, html) {
    let article = { url }

    let htmlDoc = libxml.parseHtmlString(html)

    let title = htmlDoc.get('//meta[@property="og:title"]/@content')
    article.title = title.value()

    let updateTime = htmlDoc.get('//meta[@property="og:updated_time"]/@content')
    article.updateTime = updateTime.value()

    let content = htmlDoc.get('//div[@class="article-entry"]')
    article.content = content.toString('html')

    logger.info({
        article
    })
}

export default parse