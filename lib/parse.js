import xpathParse from './parser-xpath'

// html 内容为空时（可能是网络原因），item只有url和html
// html 正常解析，增加解析信息
// html 解析错误，增加解析错误类型和错误堆栈
function parse(url, html, rules) {
    let item = {
        url
    }

    if (!(html == null || html.length == 0)) {
        try {
            Object.assign(item, xpathParse(html, rules))
        } catch (e) {
            item.error = {
                type: 'parseError',
                detail: e.stack
            }
        }
    }

    return item

}

export default parse