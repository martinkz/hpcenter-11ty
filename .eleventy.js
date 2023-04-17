const toHTML = require("@portabletext/to-html").toHTML
const imageUrlBuilder = require("@sanity/image-url")
const sanityData = require("./_data/sanityData")
const createClient = require("@sanity/client").createClient
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
		return builder.image(image.asset)
	})

	eleventyConfig.addFilter("resolveRef", function (refData, allData) {
		console.log(allData)
		for (const item of Object.values(refData)) {
			if (item._ref) {
				return item._ref
			}
		}
		// return data._ref
	})

	return {
		passthroughFileCopy: true,
	}
}
