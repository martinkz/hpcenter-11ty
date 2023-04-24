module.exports = function getContrast(hex1, hex2) {
	function hexToRgb(hex) {
		hex = hex.replace("#", "")
		const r = parseInt(hex.substring(0, 2), 16)
		const g = parseInt(hex.substring(2, 4), 16)
		const b = parseInt(hex.substring(4, 6), 16)
		return [r, g, b]
	}
	function getLuminance(rgb) {
		const [r, g, b] = rgb.map((c) => {
			const s = c / 255
			return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
		})
		return 0.2126 * r + 0.7152 * g + 0.0722 * b
	}

	const rgb1 = hexToRgb(hex1)
	const rgb2 = hexToRgb(hex2)
	const lum1 = getLuminance(rgb1)
	const lum2 = getLuminance(rgb2)
	const brightest = Math.max(lum1, lum2)
	const darkest = Math.min(lum1, lum2)
	return (brightest + 0.05) / (darkest + 0.05)
}
