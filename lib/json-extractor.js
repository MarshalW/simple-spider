
import axios from 'axios'
import jp from 'jsonpath'

async function extractUrls(url, urlPath) {
    const response = await axios.get(url);
    const urls = jp.query(response.data, urlPath)
    return urls
}

export default extractUrls