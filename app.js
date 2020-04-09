import yaml from 'js-yaml'
import fs from 'fs'
import logger from './lib/logger'
import exitHandler from './lib/exit-handler'

import { crawl } from './lib/spider'
import extractUrls from './lib/json-extractor'

(async function () {
    let configFilePath = './config/spider.yml'

    // 获取命令行参数的配置文件路径，如果有的话
    const args = process.argv.slice(2)
    if (args.length > 0) {
        configFilePath = args[0]
    }

    const config = yaml.load(fs.readFileSync(configFilePath, 'utf8'))
    logger.level = config.logging.level

    // 前置处理，针对列表页是json的情况
    let { jsonUrls, jsonPath } = config
    if (jsonUrls != null) {
        let articleUrls = []
        for (let url of jsonUrls) {
            articleUrls = [].concat(await extractUrls(url, jsonPath), articleUrls)
        }
        config.urls = articleUrls
    }

    // 开始传统的爬虫过程
    crawl(config).then(() => {
        logger.info({
            status: 'Spider end.'
        })
        process.exit(0)
    })

    logger.info({
        status: 'Spider started.'
    })

    exitHandler()

}())
