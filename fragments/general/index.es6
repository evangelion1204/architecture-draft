'use strict'

import Logger from '../../lib/logger'
import initStatsMiddleware from '../../lib/middleware/stats'
import {session} from '../../lib/middleware/session'

const logger = Logger.instance()
const program = require('commander')
const koa = require('koa')
const hbs = require('koa-hbs')

program
    .version('0.0.1')
    .option('-c, --config [Path to config]', 'The to be used config', '')
    .option('-p, --port [Port]', 'The used port', 3000)
    .parse(process.argv)

const port = program.port
const configPath = program.config

if (configPath) {
    logger.log('Loading config file:', configPath)

    const config = require(configPath)
}

const app = koa()

session(app)
app.use(initStatsMiddleware('general'))
app.use(hbs.middleware({
    viewPath: __dirname + '/views',
    extname: '.handlebars'
}))

app.use(function *() {
    yield this.render(this.request.path)
})

app.listen(port)

logger.log(`running on ${port}`)