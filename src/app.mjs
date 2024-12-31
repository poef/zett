import { transformers } from './transformers.mjs'
import { solidApi } from './solid-api.mjs'
import { appui } from './appui.mjs'
import simply from '../simplyview/src/everything.mjs'

export const zett = simply.app({
	routes: {

	},
	keys: {
		default: {
			...appui.keys.default,
			'Control+ ': function(evt) {
				this.menu.showPopover()
				this.menu.querySelector('a').focus()
			}
		}
	},
	commands: {
		...appui.commands,
		openLink: async function(el, value) {
			const buttonPos = getOffset(el)
			try {
				const file = await this.actions.openLink(el.href)
				if (!file) {
					return
				}
				this.state.worksheets[0].files[zett.state.file].position = {
					x: buttonPos.left,
					y: buttonPos.top
				}
			} catch(error) {
				alert(error.message) //TODO: use toast for errors
			}
		},
		addFile: async function(form, values) {
			this.actions.uiCloseDialog(this.dialogs.addFile)
			try {
	            const file = await this.actions.addFile(values.url)
                window.setTimeout(() => {
                    document.querySelector('.zett-entity').classList.remove('zett-pre-entity')
                    document.querySelector('.zett-entity [name="value"]').focus()
                }, 100)
	        } catch(error) {
                this.state.fetchUrl = values.url
                this.actions.uiOpenModalDialog(this.dialogs.setIssuer)
            }
		},
		zettMenu: async function(el, value) {
			this.menu.togglePopover()
		},
		zettAddFileDialog: async function(el, value) {
			this.menu.hidePopover()
			this.actions.uiOpenModalDialog(this.dialogs.addFile)
		}
	},
	actions: {
		...appui.actions,
		openLink: async function(url) {
			url = new URL(url)
			const file = await this.actions.addFile(url)
			if (!file) {
				return
			}
			if (url.hash) {
				// filter data	
			}
			return file
		},
		addFile: async function(url) {
			const file = await solidApi.fetch(url, this.state.login)
			const data = solidApi.mergeSubjects(file.data, url, file.prefixes)
			if (!this.state.worksheetIndex) {
				this.state.worksheetIndex = 0
			}
			const wsi = this.state.worksheetIndex
			if (!this.state.worksheets[wsi]) {
				this.state.worksheets[wsi] = {
					name: 'new worksheet',
					files: []
				}
			}
			const worksheet = this.state.worksheets[wsi]
			worksheet.files.push({
				name: url.href.split('/').pop(),
				url,
				data,
				prefixes: file.prefixes
			})
			this.state.file = worksheet.files.lenght - 1
			return file
		}
	},
	transformers,
	state: {
		...appui.state,
		test: "1",
		test2: "foo",
		worksheets: [
			{
				title: 'A worksheet',
				files: []
			}
		]
	}
})

console.log('worksheets',zett.state.worksheets)

zett.dialogs = {
	addFile: document.getElementById('zettAddFileDialog'),
	setIssuer: document.getElementById('zettSetIssuerDialog')
}
zett.menu = document.getElementById('zett-menu')

function getOffset(el) {
	const rect = el.getBoundingClientRect()
	return {
		left: rect.left + window.scrollX,
		top: rect.top + window.scrollY
	}
}

window.zett = zett