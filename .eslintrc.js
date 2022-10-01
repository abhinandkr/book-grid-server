module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
	},
	'extends': [
		'google',
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
	},
	'plugins': [
		'@typescript-eslint',
	],
	'rules': {
		'require-jsdoc': 0,
		'valid-jsdoc': 0,
		'spaced-comment': 0,
		'indent': [1, 'tab'],
		'no-tabs': 0,
		'padded-blocks': 0,
		'linebreak-style': 0,
	},
};
