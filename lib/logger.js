import winston from 'winston'
const { createLogger, transports, format } = winston
const { combine, json } = format

import moment from 'moment-timezone'

const appendTimestamp = format((info, opts) => {
    if (opts.tz)
        info.log_timestamp = moment().tz(opts.tz).format()
    return info
})

export default createLogger({
    level: 'info',
    format: combine(
        appendTimestamp({ tz: Intl.DateTimeFormat().resolvedOptions().timeZone }),
        json(),
    ),
    transports: [
        new transports.Console()
    ]
})
