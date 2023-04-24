const toHTML = require("@portabletext/to-html").toHTML
const imageUrlBuilder = require("@sanity/image-url")
const createClient = require("@sanity/client").createClient
const contrast = require("./utility/colorContrast")
require("dotenv").config()

module.exports = function (eleventyConfig) {
	eleventyConfig.addWatchTarget("./assets/sass")
	eleventyConfig.addWatchTarget("./assets/js")

	eleventyConfig.addPassthroughCopy("./assets/dist")

	eleventyConfig.addWatchTarget("./assets/img")
	eleventyConfig.addPassthroughCopy("./assets/img")

	const sanityClient = createClient({
		projectId: process.env.SANITY_PROJECT_ID,
		dataset: "production",
		useCdn: false, // set to `true` to fetch from edge cache
		apiVersion: "2021-10-21",
		// token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
	})

	const builder = imageUrlBuilder(sanityClient)

	const myPortableTextComponents = {
		types: {
			image: ({ value }) => {
				return `<img src="${builder.image(value.asset)}" alt="" />`
			},
		},

		marks: {
			link: ({ children, value }) =>
				`<a href="${value.href}" target="${
					value.blank ? "_blank" : "_self"
				}">${children}</a>`,
		},
	}

	eleventyConfig.addFilter("toHtml", function (text) {
		return toHTML(text, {
			components: myPortableTextComponents,
		})
	})

	eleventyConfig.addFilter("resolveImage", function (image) {
		console.log(image.crop)
		return builder.image(image.asset)
		if (image.crop) {
			return builder.image(image.asset).crop("left")
		} else {
			return builder.image(image.asset)
		}
	})

	eleventyConfig.addFilter("setBoxCopyStyle", function (item) {
		if (item.color?.hex) {
			let style = `background: ${item.color.hex}; `
			let lowContrast =
				contrast(item.color.hex, "#000000") <
				contrast(item.color.hex, "#ffffff")
			if (lowContrast) {
				style += `color: #ffffff;`
			}
			return style
		}
		return ""
	})

	// Find the _ref property within a ref object returned by a Sanity reference field
	// function findSanityRef(refObject, data) {
	// 	for (const item of Object.values(refObject)) {
	// 		if (item._ref) {
	// 			return item._ref
	// 		}
	// 	}
	// }

	// eleventyConfig.addFilter("resolveRef", function (refObject, allData) {
	// 	const ref = findSanityRef(refObject, allData)

	// 	for (const dataType of Object.values(allData)) {
	// 		for (const item of dataType) {
	// 			if (item._id === ref) {
	// 				// console.log(item)
	// 				return item
	// 			}
	// 		}
	// 	}
	// })

	return {
		passthroughFileCopy: true,
	}
}
