export const transformers = {
	position: function(context, next) {
		const position = context.value
        this.dataset.simplyPositionX = position.x || 0
        this.dataset.simplyPositionY = position.y || 0
        this.style.transform = `translate(${position.x}px, ${position.y}px`
        return next(context)
    },
    hideHidden: function(context, next) {
    	const data = context.value
        if (data) {
            this.closest('.zett-entity').classList.add('zett-hidden')
        }
        return next(context)
    }
}