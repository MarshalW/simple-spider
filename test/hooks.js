import { spawn } from 'child_process'
import { msleep } from 'sleep'

const BEFORE_DELAY = 200
const AFTER_DELAY = 10

export function hooks(path) {
    let http

    before('Start http server', function () {
        http = spawn('./node_modules/http-server/bin/http-server', [`${path}/site`])
        msleep(BEFORE_DELAY)
    })

    after('Shutdown http server', function () {
        http.kill('SIGINT')
        msleep(AFTER_DELAY)
    })
}

export let serverUrl = "http://localhost:8080"