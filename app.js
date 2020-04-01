import yaml from 'js-yaml'
import fs from 'fs'
import logger from './lib/logger'
import exitHandler from './lib/exit-handler'

import { crawl } from './lib/spider'

let configFilePath = './config/spider.yml'

const args = process.argv.slice(2)
if (args.length > 0) {
    configFilePath = args[0]
}

const config = yaml.load(fs.readFileSync(configFilePath, 'utf8'))
logger.level = config.logging.level

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
