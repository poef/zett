import { transformers } from './transformers.mjs'
import { solidApi } from './solid-api.mjs'
// import simply/everything.mjs

const openDialogs = []

const zett = simply.app({
	routes: {

	},
	keys: {
		default: {
			'Control+ ': function(evt) {
				this.app.menu.showPopover()
				this.app.menu.querySelector('a').focus()
			},
			Escape: function(evt) {
				if (this.app.container.querySelector(':popover-open')) {
					return
				}
				if (openDialogs.length) {
					let dialog = openDialogs.pop()
					dialog.close()
					evt.preventDefault()
				}
			}
		}
	},
	commands: {
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
		zettMenu: async function(el, value) {
			this.menu.togglePopover()
		},
		zettAddFileDialog: async function(el, value) {
			this.menu.hidePopover()
            this.dialogs.addFile.setAttribute('open','open')
            openDialogs.push(this.dialogs.addFile)
            this.dialogs.addFile.querySelector('[autofocus]')?.focus()
		},
		closeDialog: async function(el, value) {
			if (openDialogs.length) {
				let dialog = openDialogs.pop()
				dialog.close()
			}
		}
	},
	actions: {
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
		worksheets: [
			{
				files: []
			}
		]
	}
})

zett.dialogs = {
	addFile: document.getElementById('zettAddFileDialog')
}
zett.menu = document.getElementById('zett-menu')

function getOffset(el) {
	const rect = el.getBoundingClientRect()
	return {
		left: rect.left + window.scrollX,
		top: rect.top + window.scrollY
	}
}
