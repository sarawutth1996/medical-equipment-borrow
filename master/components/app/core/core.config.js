angular
	.module('app.core')
	.config(coreConfig)

coreConfig.$inject = ['dynamicNumberStrategyProvider'];
function coreConfig(dynamicNumberStrategyProvider) {	
	dynamicNumberStrategyProvider.addStrategy('price', {
		numInt: 7,
		numSep: '.',
		numPos: true,
		numNeg: false,
		numRound: 'round',
		numThousand: true,
		numThousandSep: ','
	});

	dynamicNumberStrategyProvider.addStrategy('priceShow', {
		numFixed: true,
		numSep: '.',
		numPos: true,
		numNeg: false,
		numRound: 'round',
		numThousand: true,
		numThousandSep: ','
	});

}