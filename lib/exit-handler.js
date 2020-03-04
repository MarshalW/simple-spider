import logger from './logger'

function exitHandler() {
    // 正常退出
    process.on('exit', function (code) {
        logger.info({
            status: `exit with ${code}`
        })
    })
    // SIGTERM: kill -9
    process.on('SIGTERM', function (code) {
        logger.info({
            status: `SIGTERM with ${code}`
        })
    })

    process.on('SIGINT', function (code) {
        logger.info({
            status: `SIGINT with ${code}`
        })
        process.exit()
    })
}

export default exitHandler