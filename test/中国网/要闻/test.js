import yaml from 'js-yaml'
import fs from 'fs'

import logger from '../../../lib/logger'

import { hooks, serverUrl } from '../../hooks'
import { crawl } from '../../../lib/spider'

import { assert } from 'chai'



function hook_stdout(callback) {
    const old_write = process.stdout.write

    process.stdout.write = (function (write) {
        return function (string, encoding, fd) {
            write.apply(process.stdout, arguments)
            callback(string, encoding, fd)
        }
    })(process.stdout.write)

    return function () {
        process.stdout.write = old_write
    }
}


describe('中国网-要闻', async () => {
    let path = './test/中国网/要闻'
    hooks(path)

    let configFilePath = `${path}/config.yml`
    const config = yaml.load(fs.readFileSync(configFilePath, 'utf8'))

    logger.level = config.logging.level // TODO spider 需要重构日志配置

    const articleUris = new Set([
        'content_1.html',
        'content_2.html',
        'content_3.html',
        'content_4.html',
        'content_5.html',
        'content_6.html',
        'content_7.html',
        'content_8.html',
    ])

    it('提取中国网-要闻', async () => {
        // https://gist.github.com/pguillory/729616/32aa9dd5b5881f6f2719db835424a7cb96dfdfd6
        const unhook = hook_stdout(function (string, encoding, fd) {
            if (string.startsWith('{"message":{"item":')) {
                const item = JSON.parse(string).message.item

                const { url, from, section, publish_date: publishDate, content } = item

                assert.equal(from, '中国网', '来源错误')
                assert.equal(section, '要闻', '栏目错误')

                assert.property(item, 'title', '应有标题属性')

                assert.notEqual(publishDate, null, '日期不应为空')

                // TODO 貌似不应有invalid date，因为用last modify做了兜底，可能是http server不规范？
                assert.notEqual(publishDate, 'Invalid date', '日期不应是非法值')

                assert.notEqual(publishDate, '', '日期不应是空字符串')

                let path = url.split('/').reverse()[0]
                assert.isTrue(articleUris.has(path), `爬到了多余的条目: ${url}`)
                articleUris.delete(path)

                assert.property(item, 'content', '内容不为空')
            }
        })

        await crawl(config)

        unhook()

        assert.lengthOf(articleUris, 0, '应为0')

    })

})