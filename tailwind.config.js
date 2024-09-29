/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./public/**/*.html', './src/**/*.js', './views/**/*.ejs'],
	theme: {
		extend: {
			fontFamily: {
				roboto: ['Roboto', 'sans-serif'],
				shantell: ['Shantell Sans', 'sans'],
			},
			colors: {
				navcolor: '#ccaf60',
			},
		},
	},
	plugins: [],
};
