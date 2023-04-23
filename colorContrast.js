module.exports = function getContrast(hex1, hex2) {
	// Convert hex codes to RGB values
	function hexToRgb(hex) {
		const r = parseInt(hex.substring(0, 2), 16)
		const g = parseInt(hex.substring(2, 4), 16)
		const b = parseInt(hex.substring(4, 6), 16)
		return [r, g, b]
	}

	// Calculate luminance of an RGB color
	function getLuminance(rgb) {
		const [r, g, b] = rgb.map((c) => {
			const sRgb = c / 255
			return sRgb <= 0.03928
				? sRgb / 12.92
				: Math.pow((sRgb + 0.055) / 1.055, 2.4)
		})

		return 0.2126 * r + 0.7152 * g + 0.0722 * b
	}

	const rgb1 = hexToRgb(hex1)
	const rgb2 = hexToRgb(hex2)

	// Determine contrast ratio between the two colors
	const l1 = getLuminance(rgb1)
	const l2 = getLuminance(rgb2)
	const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

	return ratio.toFixed(2)
}
