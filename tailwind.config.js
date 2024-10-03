/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	content: ['./public/**/*.html', './src/**/*.js', './views/**/*.ejs'],
	theme: {
		extend: {
			fontFamily: {
				roboto: ['Roboto', 'sans-serif'],
				shantell: ['Shantell Sans', 'sans'],
			},
			colors: {
				navcolor: '#ccaf60',
				yellownote: '#ffffa2',
				pinknote: '#ff7ecd',
			},
		},
	},
	plugins: [],
};
