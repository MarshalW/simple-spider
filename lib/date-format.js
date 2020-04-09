
import moment from 'moment'

const dateFormatParms = {
    format: 'yyyy-MM-DD HH:mm:ss:SSS',
    tz: '+8'
}

function dateFormat(text) {
    let { format, tz } = dateFormatParms
    return moment(text, format, tz).format()
}

export default dateFormat