
import Crawler from "simplecrawler"
import logger from './logger'
import debugHandler from './debug'
import parse from "./parse"
import htmlToText from 'html-to-text'
import extractDate from './extract-date'

const USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"

function crawl(params) {
    let {
        urls = [],
        domainWhitelist = [],
        maxDepth = 3,
        timeout = 1000 * 10,
        interval = 100,
        maxConcurrency = 5,
        respectRobotsTxt = false,
        rules = {
            fetch: [],
            parse: []
        },
        allTimeout,
        from,
        section
    } = params

    let promises = []

    urls.forEach(url => {
        let crawler = new Crawler(url)

        crawler.supportedMimeTypes = ["text/html"]
        crawler.downloadUnsupported = false
        crawler.parseHTMLComments = false
        crawler.parseScriptTags = false

        crawler.domainWhitelist = domainWhitelist
        crawler.userAgent = USER_AGENT
        crawler.maxDepth = maxDepth
        crawler.timeout = timeout
        crawler.interval = interval
        crawler.maxConcurrency = maxConcurrency
        crawler.respectRobotsTxt = respectRobotsTxt

        crawler.addFetchCondition((queueItem, referrerQueueItem) => {
            let { uriPath } = queueItem

            // 检查refer不能是 parse 的
            if (referrerQueueItem) {
                for (let re of rules.parse) {
                    let { referUriPath } = referrerQueueItem
                    if (re.test(referUriPath)) {
                        return false
                    }
                }
            }

            for (let re of rules.fetch) {
                if (re.test(uriPath)) {
                    return true
                }
            }

            return false
        })

        debugHandler(crawler)

        let promise = new Promise((resolve, reject) => {
            crawler.on('complete', () => {
                logger.info({
                    crawl: {
                        event: 'complete'
                    }
                })
                resolve()
            })
        })
        promises.push(promise)

        // 下载到文章正文的处理逻辑
        crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
            logger.info({
                crawl: {
                    event: 'fetchcomplete'
                }
            })

            let { uriPath } = queueItem

            // 多个parse条件，只要命中一个就会停止
            for (let re of rules.parse) {
                if (re.test(uriPath)) {
                    let html = responseBuffer.toString()
                    let item = parse(queueItem.url, html, rules.item)

                    // 保留一个完整的html字段，供以后排错或分析用
                    item.html = html
                    
                    // 爬虫类型
                    item.spider='simplecrawler'

                    // 去掉title的html标记
                    if (item.title) {
                        item.title = htmlToText.fromString(item.title, {
                            wordwrap: false
                        })
                    }

                    // 去掉内容的html标记
                    if (item.content) {
                        item.content = htmlToText.fromString(item.content, {
                            wordwrap: false
                        })
                    }

                    // 给文章条目加上来源和栏目
                    Object.assign(item, { from, section })

                    // 抽取文章准确时间
                    let publishDate = extractDate(html)
                    if (publishDate) {
                        item.publish_date = publishDate
                    }

                    logger.info({ item })
                    return
                }
            }
        })

        crawler.start()

        if (allTimeout != null) {
            if (allTimeout != null) {
                setTimeout(() => {
                    logger.error({
                        error: {
                            type: 'errorTimeout',
                            time: allTimeout
                        }
                    })
                    crawler.stop()
                }, allTimeout);
            }
        }
    })

    return Promise.all(promises)
}

export { crawl }  
