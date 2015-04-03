var root = 'static/';
var build_root = 'build/';

module.exports = {
	build_root: build_root,
	jsx: root + 'js/app/*',
	jsx_dest: build_root + 'js/app',

	js_min: build_root + 'js/app/*',
	js_root: build_root + 'js/app',

	css: root + 'css/*',
	css_dest: build_root + 'css'

}