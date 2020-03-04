import yaml from 'js-yaml'
import fs from 'fs'
import logger from './lib/logger'
import exitHandler from './lib/exit-handler'

import { crawl } from './lib/spider'

const config = yaml.load(fs.readFileSync('./config/spider.yml', 'utf8'))
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
