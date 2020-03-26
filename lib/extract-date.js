
import moment from 'moment'

const htmlTagRe = /<\/?[\w\s="/.':;#-\/]+>/gi
const re = /<date>(.*?)<\/date>/
const dateFormat = {
    format: 'yyyy-MM-DD HH:mm:ss:SSS',
    tz: '+8'
}

function extractDate(html) {
    let { format, tz } = dateFormat
    let dateString = findDateString(html)

    if (dateString) {
        return moment(dateString, format, tz).format()
    }

    return null
}

function findDateString(html) {
    let m = html.match(re)
    let dateString = null
    if (m) {
        dateString = m[0].replace(htmlTagRe, '')
    }

    return dateString
}

export default extractDate