// if running from npm run dev
const isDevEnv = process.env.npm_lifecycle_event === 'dev' || false

if (isDevEnv) {
    const dotenv = require('dotenv')
    dotenv.config()
}

function loadConfig() {
    return {
        isOneLineSyntax: process.env.FUNCTION_IS_ONE_LINE_SYNTAX == 1,
        prefix: process.env.FUNCTION_VAR_PREFIX || 'URL_',
        oneLineDelimiter: process.env.FUNCTION_ONE_LINE_DELIMITER || '|',
        debug: process.env.FUNCTION_DEBUG == 1
    }

}

function getUrlsFromEnv(config) {
    // get env keys
    const envKeys = Object.keys(process.env)

    // create empty object
    const urls = {}
    const temp = {}

    // loop through keys
    for (let i = 0; i < envKeys.length; i++) {
        const key = envKeys[i]
        if (config.isOneLineSyntax) {
            const urlString = process.env[key]
            const urlArray = urlString.split(config.oneLineDelimiter)
            if (urlArray.length === 2) {
                urls[urlArray[0]] = urlArray[1]
            } else if (urlArray.length > 2) {
                for (let j = 0; j < urlArray.length-1; j++) {
                    urls[urlArray[j]] = urlArray[urlArray.length-1]
                }
            }
        } else {
            if (key.endsWith('_GO')) {
                const id = key.replace('_GO', '').replace(config.prefix, '')
                if (id) {
                    if (!temp[id]) temp[id] = {}
                    if (id) {
                        const go = process.env[key]
                        temp[id] = {...temp[id], go}
                    }
                }
            } else if (key.endsWith('_ID')) {
                const id = key.replace('_ID', '').replace(config.prefix, '')
                if (id) {
                    if (!temp[id]) urls[id] = {}
                    if (id) {
                        const slug = process.env[key]
                        temp[id] = {...temp[id], slug: slug}
                    }
                }
            }

            const tempKeys = Object.keys(temp)
            for (let j = 0; j < tempKeys.length; j++) {
                const tempKey = tempKeys[j]
                urls[temp[tempKey].slug] = temp[tempKey].go
            }
        }

    }

    return urls
}


exports.handler = async (event, context) => {
    
    // Get the last segment of the URL
    const slug = event.path.split('/').pop()
    
    const config = loadConfig()
    const urls = getUrlsFromEnv(config)

    console.log(slug, config, urls)

    if (config.debug) {
        console.log(config)
        console.log(urls)
    }


    if (config.debug && slug === 'debug') {
        return {
            statusCode: 200,
            body: JSON.stringify({config, urls, message: "You can disable this route by setting env variable FUNCTION_DEBUG=0."}),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
    }

    let url = urls[slug]
    if (url) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `https://${url}`
        }
        return {
            statusCode: 302,
            headers: {
                'Location': url
            }
        };
    } else {
        return {
            statusCode: 404,
            body: `Page not found`
        };
    }
}