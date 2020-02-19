
import Crawler from "simplecrawler"
import logger from './logger'
import debugHandler from './debug'
import parser from './parser'
import parse from "./parser"

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
        debug = false,
        rules = {
            fetch: [],
            parse: []
        }
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

        crawler.addFetchCondition((queueItem) => {
            let { uriPath } = queueItem

            for (let re of rules.fetch) {
                if (re.test(uriPath)) {
                    return true
                }
            }

            return false
        })

        if (debug) {
            logger.level = 'error'
            debugHandler(crawler)
        }

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

        crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
            logger.info({
                crawl: {
                    event: 'fetchcomplete'
                }
            })

            let { uriPath } = queueItem

            for (let re of rules.parse) {
                if (re.test(uriPath)) {
                    parse(queueItem.url, responseBuffer.toString())
                    return
                }
            }
        })

        crawler.start()
    })

    return Promise.all(promises)
}

export { crawl }  
