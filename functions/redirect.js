// if running from npm run dev
const isDevEnv = process.env.npm_lifecycle_event === 'dev' || false

if (isDevEnv) {
    const dotenv = require('dotenv')
    dotenv.config()
}

function loadConfig() {
    return {
        isOneLineSyntax: process.env.IS_ONE_LINE_SYNTAX === 1 || false,
        prefix: process.env.VAR_PREFIX || 'URL_',
        oneLineDelimiter: process.env.ONE_LINE_DELIMITER || '|',
        debug: process.env.DEBUG === 1 || false
    }

}

function getUrlsFromEnv(config) {
    // get env keys
    const envKeys = Object.keys(process.env)

    // create empty object
    const urls = {}

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
                    if (!urls[id]) urls[id] = {}
                    if (id) {
                        const go = process.env[key]
                        urls[id] = {...urls[id], go}
                    }
                }
            } else if (key.endsWith('_ID')) {
                const id = key.replace('_ID', '').replace(config.prefix, '')
                if (id) {
                    if (!urls[id]) urls[id] = {}
                    if (id) {
                        const slug = process.env[key]
                        urls[id] = {...urls[id], id: slug}
                    }
                }
            }
        }

    }

    return urls
}


exports.handler = async (event, context) => {
    
    // Get the last segment of the URL
    const id = event.path.split('/').pop()
    
    const config = loadConfig()
    const urls = getUrlsFromEnv(config)

    if (config.debug) {
        console.log(config)
        console.log(urls)
    }


    if (config.debug && id === 'debug') {
        return {
            statusCode: 200,
            body: JSON.stringify({config, urls}),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
    }

    let url = urls[id]
    if (typeof url === 'object') {
        url = url.go
    } else {
        const urlsKeys = Object.keys(urls)
        for (let i = 0; i < urlsKeys.length; i++) {
            if (typeof urls[urlsKeys[i]] === 'object') {
                if (id === urls[urlsKeys[i]].id) {
                    url = urls[urlsKeys[i]].go
                    break
                }
            }
        }
    }

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