require("dotenv").config()

const DATASET = "production"
const QUERY = encodeURIComponent('*[!(_id in path("drafts.**"))]')
const PROJECT_URL = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

async function getSanityData(url) {
	return await fetch(url)
		.then((res) => res.json())
		.then(({ result }) => {
			return result
		})
		.catch((err) => console.error(err))
}

function splitByType(data) {
	const result = {}
	for (const item of data) {
		const { _type } = item
		result[_type] = [...(result[_type] || []), item]
	}
	return result
}

module.exports = async function () {
	let sanityData = await getSanityData(PROJECT_URL)
	// console.log(splitByType(sanityData))
	return splitByType(sanityData)
}
