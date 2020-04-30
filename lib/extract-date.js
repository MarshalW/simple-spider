const finders = [findByDateTag, getLastModifiedTime]

function extractDate(html, response) {

    let value = null

    for (let finder of finders) {
        value = finder(html, response)
        if (value) return value
    }

    return value
}

function getLastModifiedTime(html, response) {
    const headers = ['Last-Modified', 'last-modified']

    for (let header of headers) {
        let dateString = response.headers[header]
        if (dateString != null) {
            return dateString
        }
    }

    return null

}

function findByDateTag(html) {
    const htmlTagRe = /<\/?[\w\s="/.':;#-\/]+>/gi
    const re = /<date>(.*?)<\/date>/

    let m = html.match(re)
    let dateString = null
    if (m) {
        // 过滤掉html标记
        dateString = m[0].replace(htmlTagRe, '')
    }

    return dateString
}

export default extractDate