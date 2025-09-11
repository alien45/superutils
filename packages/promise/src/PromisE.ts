import PromisE_deferred from './deferred'
import PromisE_deferredCallback from './deferredCallback'
import PromisE_deferredFetch from './deferredFetch'
import PromisE_deferredPost from './deferredPost'
import PromisE_delay from './delay'
import PromisE_delayReject from './delayReject'
import PromisE_fetch from './fetch'
import PromisE_fetchResponse from './fetchResponse'
import PromisE_post from './post'
import PromisEBase from './PromisEBase'
import PromisE_timeout from './timeout'
import { ResolveIgnored } from './types'

export class PromisE<T = unknown> extends PromisEBase<T> {
    static get defaultResolveIgnored () { return PromisEBase.defaultResolveIgnored }
    static set defaultResolveIgnored (v: ResolveIgnored ) { PromisEBase.defaultResolveIgnored = v }
    static deferred = PromisE_deferred
    static deferredCallback = PromisE_deferredCallback
    static deferredFetch = PromisE_deferredFetch
    static deferredPost = PromisE_deferredPost
    static delay = PromisE_delay
    static delayReject = PromisE_delayReject
    static fetch = PromisE_fetch
    static fetchDeferred = this.deferredFetch
    static fetchResponse = PromisE_fetchResponse
    static post = PromisE_post
    static postDeferred = this.deferredPost
    static timeuot = PromisE_timeout
}
export default PromisE