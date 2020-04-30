
import { spawn } from 'child_process'
import { sleep, msleep } from 'sleep'
import axios from 'axios'

describe('中国网手机端-推荐', async () => {
    it('提取中国网手机端-推荐', async () => {
        let path = './test/中国网手机端/推荐'

        const http = spawn('./node_modules/http-server/bin/http-server', [`${path}/site`])
        msleep(200)

        const response = await axios.get(`http://localhost:8080/index.json`)
        console.log(response.data)

        http.kill('SIGINT')
    })
})