'use strict';
 
const yelp = require('yelp-fusion');
const httpStatus = require('http-status-codes');
const client = yelp.client('Y8s6dW3uAs-TZ34YRekghk7llJxJuj3JjNAcLtADi-OZ02Dl66_soagZHv-eTyQFHC8fGWfxblXrZxyW3msB1GARItcv2KG0qhzgowweVi4qxdw3fijzXeIyKKd2XXYx');

const validateSearch = (response) => {
	return new Promise((resolve, reject) => {
		if(response.statusCode == httpStatus.OK) {
			console.log('Going to peocess results');
			resolve(JSON.parse(response.body).businesses);
		}
	});
}

const fetchReview = (shopAlias) => {
	//console.log(shopAlias);
	return new Promise((resolve, reject) => {
		client.reviews(shopAlias).then(response => {
			console.log(response);
		}).catch(e => {
			console.log(e);
		});
	});
}

const processSearch = (shops) => {
	console.log('Search here 2');
	//console.log(shops);
	shops.forEach(async (shop) => {
		//console.log(shop);
		let review = await fetchReview(shop.alias);
		console.log(reviews);
	});
}
 
client.search({
	term: 'ice cream shop',
	location: 'Alpharetta',
	categories: 'icecream',
	sort_by: 'rating',
	limit: 5,
}).then(
	validateSearch
).then(
	processSearch
).catch(e => {
	console.log('Error occurred. Please find details below.');
	console.error(e);
});
