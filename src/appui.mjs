export const appui = {
	keys: {
		default: {
			Escape: function(evt) {
				if (this.container.querySelector(':popover-open')) {
					return
				}
				if (this.state.openDialogs?.length) {
					if (this.actions.uiCloseDialog(this.state.openDialogs[this.state.openDialogs.length-1])) {
						evt.preventDefault()
					}
				}
			}
		}
	},
	commands: {
		uiCloseDialog: function(el, value) {
			let dialog = el.closest('dialog')
			this.actions.uiCloseDialog(dialog)
		},
		uiSelectTab: function(el, value) {
			const group = el.dataset.uiGroup
			const target = this.container.querySelector('#'+value)
			const targetGroup = target ? target.dataset.uiGroup : null
			this.actions.uiSelect(el, group)
			if (target) {
				this.actions.uiSelect(target, targetGroup)
				target.scrollIntoView()
			}
		}
	},
	actions: {
		uiCloseDialog: function(dialog) {
			if (dialog.open) {
				this.state.openDialogs = this.state.openDialogs?.filter(d => d==dialog)
				dialog.close()
				return true
			}
			return false
		},
		uiOpenDialog: function(dialog) {
			if (!dialog.open) {
				dialog.show()
				this.state.openDialogs.push(dialog)
	            dialog.querySelector('[autofocus]')?.focus()
			}
		},
		uiOpenModalDialog: function(dialog) {
			if (!dialog.open) {
				dialog.showModal()
				this.state.openDialogs.push(dialog)
	            dialog.querySelector('[autofocus]')?.focus()
			}
		},
		uiSelect: function(selected, group) {
			if (group) {
				for (let gel of Array.from(
					this.container.querySelectorAll(`[data-ui-group=${group}].ui-selected`))) {
					gel.classList.remove('ui-selected')
				}
			}
			selected.classList.add('ui-selected')
		}
	},
	state: {
		openDialogs: []
	}
}