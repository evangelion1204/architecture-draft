'use strict'

import Logger from '../../lib/logger'

const logger = Logger.instance()

export default function (application = null) {
    let responseHeaderName = 'x-response-time' + (application ? `-${application}` : '')

    return function *(next) {
        this.state.stats = {
            start: new Date
        }

        yield next;

        this.state.stats.end = new Date
        this.state.stats.total = this.state.stats.end - this.state.stats.start

        logger.log(`Total response time ${this.state.stats.total} ms for ${this.request.path}`)

        this.response.set(responseHeaderName, `${this.state.stats.total} ms`)
    }
}