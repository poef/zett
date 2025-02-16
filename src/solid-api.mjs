import * as metro from '@muze-nl/metro/src/metro.mjs'
import throwermw from '@muze-nl/metro/src/mw/thrower.mjs'
import oidcmw from '@muze-nl/metro-oidc'
import { oldm } from '@muze-nl/oldm'

export function getClient(loginInfo, prefixes)
{
    let client = metro.client({
        mode: 'cors',
        headers: {
            'Accept': 'application/*'
        }
    })
    if (loginInfo && loginInfo.username && loginInfo.password) {
        client = client.with({
            headers: {
                Authorization: 'Basic '+btoa(loginInfo.username+':'+loginInfo.password)
            }
        })
    } else if (loginInfo && loginInfo.oidcIssuer) {
        let oidcOptions = {
            authorize_callback: globalThis.metro.oauth2.authorizePopup,
            force_authorization: loginInfo.force_authorization || false,
            client_info: {
                client_name: 'Zett',
                redirect_uris: [
                    loginInfo.redirect_uri
                ]
            },
            issuer: loginInfo.oidcIssuer
        }
        client = client.with(oidcmw(oidcOptions))
    }
    return client.with(throwermw()).with(oldmmw(prefixes))
}


export function oldmmw(prefixes) {
    return async (req, next) => {
        // if req.data => check content-type, convert to that (body = oldm.write(req.data))
        if (req.data && req.data.write) {
            req = req.with({
                headers: {
                    'Content-Type': req.data.type
                },
                body: await req.data.write()
            })
        }
        let res = await next(req)
        if (res.ok) {
            // if res.content-type matches supported type, parse body, and set that (body = oldm.parse(await req.text()))
            if (!res.data) {
                const body = await solidApi.context.parse(await res.text(), res.url)
                res = res.with({body})
            }
        }
        return res
    }
}

export const solidApi = {
    prefixes: {
        solid: 'http://www.w3.org/ns/solid/terms#',
        pim: 'http://www.w3.org/ns/pim/space#'
    },
    fetch: async function(url, loginInfo=null) {
        let cleanUrl   = metro.url(url).with({ hash: '' })
        const client   = getClient(loginInfo, solidApi.prefixes)
		return client.get(cleanUrl)
    },
    getIssuer: async function(webIdUrl) {
        const response = await solidApi.fetch(webIdUrl)
        return response.data.primary['solid:oidcIssuer']
    },
    getStorageUrls: async function(webIdUrl) {
        //TODO: storage urls may also be in the Link header from the response
        const response = await solidApi.fetch(webIdUrl)
        return response.data.primary['pim:storage']
            ?.map(u => u.endsWith('/') ? u : u+'/')
    },
    redirectPopup: globalThis.metro.oauth2.redirectPopup
}

solidApi.context = oldm({
    parser: oldm.n3Parser,
    writer: oldm.n3Writer,
    prefixes: solidApi.prefixes,
    separator: ':'
})
