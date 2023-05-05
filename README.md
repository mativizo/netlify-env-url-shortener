# netlify-env-url-shortener
Simple URL shortener based on env variables ready for netlify deploy.

### Functions
The repository contains only one function - `./functions/redirect.js`. Project doesn't use database or json file, just env variables.

### Dependencies
The repository doesn't have any production dependencies.
`dotenv` and `netlify-cli` are used only for the dev.

### How to use?
1. Clone repository `git clone https://github.com/mativizo/netlify-env-url-shortener` or fork it.
2. Login to [Netlify](https://netlify.com) and deploy your repo or drag n drop directory.
3. Setup env variables like below.
4. Add your own domain to app.

#### How to setup env?

##### Standard setup - approach #1
As you can see in the `example.env` you can specify urls and slugs (ids) by using syntax:
```
<PREFIX><UNIQUE_NAME>_ID=<URL_SLUG>
<PREFIX><UNIQUE_NAME>_GO=<TARGET_URL>
```

For example we can define:
- example.com/yt -> https://youtube.com
- example.com/google -> https://google.com
- example.com/gh -> https://github.com/mativizo/netlify-env-url-shortener

By setting:
```
URL_YOUTUBE_ID="yt"
URL_YOUTUBE_GO="youtube.com"
URL_GOOGLE_ID="google"
URL_GOOGLE_GO="google.com"
URL_GITHUB_ID="gh"
URL_GITHUB_GO="github.com/mativizo/netlify-env-url-shortener"
```

##### Oneline setup - approach #2
As you can see in the `oneline-example.env` you can also use one-line syntax, like:
```
<PREFIX><UNIQUE_NAME>="<URL_SLUG><DELIMITER><TARGET_URL>
```

For example redirects like:
- example.com/yt -> https://youtube.com
- example.com/google -> https://google.com
- example.com/gh -> https://github.com/mativizo/netlify-env-url-shortener

Will look like this:
```
URL_YOUTUBE="yt|youtube.com"
URL_GOOGLE="google|google.com"
URL_GITHUB="gh|github.com/mativizo/netlify-env-url-shortener"
```

### Configuration
You can set the configuration by the few env variables.

##### PREFIX
To set prefix that you're going to use with your variables:
```
VAR_PREFIX="SHORT_"
```

and then use:
```
VAR_PREFIX="SHORT_"
SHORT_YOUTUBE_ID="yt"
SHORT_YOUTUBE_GO="youtube.com"
```

##### ONE LINE MODE
To enable one-line approach you can use the variable `IS_ONE_LINE_SYNTAX`:
```
IS_ONE_LINE_SYNTAX='true'
```

and then write urls like:
```
IS_ONE_LINE_SYNTAX="true"
URL_YOUTUBE="yt|youtube.com"
```

##### ONE LINE DELIMITER
You can also change delimiter for one-line syntax by using the variable `ONE_LINE_DELIMITER`:

```
ONE_LINE_DELIMITER="->"
```

and then type urls like:
```
IS_ONE_LINE_SYNTAX="true"
ONE_LINE_DELIMITER=" -> "
URL_YOUTUBE="yt -> youtube.com"
```