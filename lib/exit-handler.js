import logger from './logger'

function exitHandler() {
    // 正常退出
    process.on('exit', function (code) {
        logger.info({
            status: {
                type: 'exit',
                code
            }
        })
    })
    // SIGTERM: kill -9
    process.on('SIGTERM', function (code) {
        logger.info({
            status: {
                type: 'SIGTERM',
                code
            }
        })
    })

    process.on('SIGINT', function (code) {
        logger.info({
            status: {
                type: 'SIGINT',
                code
            }
        })
        process.exit()
    })
}

export default exitHandler