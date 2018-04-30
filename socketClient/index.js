// import { merge } from 'lodash';
import { NEW_PRICE } from '../graphql/topics';
import getPubSub from '../graphql/utils/getPubSub.js';

import { subscribeBitfinex } from './bitfinex';
import { subscribeBinance } from './binance';

let result = [];

const compose = (_data) => {
	const pubsub = getPubSub();
	const { currency, data } = _data;
	const { exchange } = data;

	const currencyIndex = result.findIndex((_currency) => {
		return _currency.name === currency;
	});

	if (currencyIndex === -1) {
		result.push({
			name: currency,
			exchanges: [data]
		});
	} else {
		const exchangeIndex = result[currencyIndex].exchanges.findIndex((_exchange) => {
			return _exchange.exchange === exchange;
		});

		if (exchangeIndex === -1) {
			result[currencyIndex].exchanges.push(data);
		} else {
			const exchangeData = result[currencyIndex].exchanges[exchangeIndex];

			exchangeData.pct = data.pct;
			exchangeData.price = data.price;
			exchangeData.vol = data.vol;
		}
	}

	// console.log(JSON.stringify(result));
	// console.log('new price');

	// pubsub.publish(NEW_PRICE, { newPrice: {message: 'price has been changed' }});
	// pubsub.publish(NEW_PRICE, { result });
	pubsub.publish(NEW_PRICE, { newPrice: result });


	// console.log(result);
};

subscribeBitfinex(compose);
subscribeBinance(compose);
