import { getDefaultSession } from '@inrupt/solid-client-authn-browser'
import oldmParser from '@muze-nl/oldm'

export const solidSession = getDefaultSession()

export const solidApi = {
    fetch: function(url, loginInfo) {
        let cleanUrl = new URL(url)
        cleanUrl.hash = ''
        cleanUrl = cleanUrl.href
        const parser = new oldmParser({prefixes:solidApi.prefixes})
		var fetchParams = {
			mode: 'cors',
			headers: {
				'Accept': 'application/*'
			}
		}
		if (loginInfo && loginInfo.username && loginInfo.password) {
			fetchParams.headers.Authorization = 'Basic '+btoa(loginInfo.username+':'+loginInfo.password)
		}
		return fetch(cleanUrl, fetchParams)
			.catch(error => {
		        return solidSession.fetch(cleanUrl)
			})
            .then(response => {
                if (response.ok) {
                    return response.text()
                } else {
					return solidSession.fetch(cleanUrl).then(response => {
						if (response.ok) {
							return response.text()
						} else {
		                    throw new Error('Could not fetch resource: '+response.status+': '+response.statusText)
						}
					})
                }
            })
            .then((text,error) => {
				if (!error) {
					var data = parser.parse(text, url)
                    return { data: data, prefixes: solidApi.prefixes }
				} else {
					throw error
				}
			});
    },
    write: function(url, body, contentType='text/turtle') {
        var fetchParams = {
            headers: {
                'Content-Type': contentType
            },
            body: body,
            method: 'PUT'
        }
        return solidSession.fetch(url, fetchParams).then(response => {
            if (response.ok) {
                return response
            } else {
                throw response
            }
        })
    },
    connect: function(issuer, resourceUrl) {
        if (solidSession.info && solidSession.info.isLoggedIn === false) {
            let url = new URL(window.location)
            url.searchParams.set('resourceUrl', resourceUrl)
            return solidSession.login({
                oidcIssuer: issuer,
                redirectUrl: url.href
            })
        }
        return solidSession.info
    },
    disconnect: function() {
        return solidSession.logout()
    },
    getPodUrl: function(webIdUrl) {
        return solidApi.fetch(webIdUrl.href)
            .then(quads => quads.find(quad => quad.predicate.value.includes('pim/space#storage')).object.value)
            .then(podUrl => {
                if ( ! podUrl.endsWith('/')) {
                    podUrl += '/'
                }
                return podUrl
            })
    }
};
