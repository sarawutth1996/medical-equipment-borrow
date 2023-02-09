angular
	.module('app.utils')
	.directive('svgReplace', svgReplace);

svgReplace.$inject = ['$compile', '$http', '$templateCache', '$timeout']
function svgReplace($compile, $http, $templateCache, $timeout) {

	let directive = {
		restrict: 'A',
		replace: true,
		link: link
	};
	return directive;

	function link(scope, element, attrs) {
		$timeout(function () {

			let src = attrs.src;
			if (!src || src.indexOf('.svg') < 0)
				throw "only support for SVG images";
			// return /*only support for SVG images*/;

			$http.get(src, {
				cache: $templateCache
			}).then(function mySuccess(res) {
				let view = $compile(res.data)(scope);
				element.replaceWith(view);
			})

		});
	}
}