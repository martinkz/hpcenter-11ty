const images = document.querySelectorAll(".carousel img[data-idx]")

if (images.length) {
	let nextItem = 1
	let prevItem = 0
	const numItems = images.length
	images[prevItem].style.opacity = 1

	const interval = setInterval(() => {
		// console.log(nextItem, numItems)
		images[prevItem].style.opacity = 0
		prevItem = nextItem
		images[nextItem].style.opacity = 1
		if (++nextItem === numItems) {
			nextItem = 0
		}
	}, 4000)
}
