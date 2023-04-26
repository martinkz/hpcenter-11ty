require("dotenv").config()

const DATASET = "production"
const QUERY = encodeURIComponent('*[!(_id in path("drafts.**"))]')
const PROJECT_URL = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`

async function getSanityData(url) {
	return await fetch(url)
		.then((res) => res.json())
		.then(({ result }) => {
			// console.log(11111)
			return result
		})
		.catch((err) => console.error(err))
}

// Find the _ref properties (which come from a reference field or image) within the Sanity json data
// and expand the object with the actual data from the referenced object elsewhere in the data
function expandRefs(obj, originalData = null) {
	if (originalData === null) {
		originalData = obj
	}
	if (Array.isArray(obj)) {
		for (let elem of obj) {
			expandRefs(elem, originalData)
		}
	} else if (typeof obj === "object") {
		for (let key in obj) {
			if (key === "_ref") {
				obj["__expandedRef"] = findById(obj._ref, originalData)
			}
			expandRefs(obj[key], originalData)
		}
	}
}

function findById(id, data) {
	return data.filter((item) => item._id === id)
}

function splitByType(data) {
	const result = {}
	for (const item of data) {
		const { _type } = item
		result[_type] = [...(result[_type] || []), item]
	}
	return result
}

function sortBoxItems(data) {
	return data.box.sort((a, b) => a.orderRank.localeCompare(b.orderRank))
}

module.exports = async function () {
	let sanityData = await getSanityData(PROJECT_URL)
	expandRefs(sanityData)
	sanityData = splitByType(sanityData)
	sortBoxItems(sanityData)
	return sanityData
}
