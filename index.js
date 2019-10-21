'use strict';
 
const yelp = require('yelp-fusion');
const httpStatus = require('http-status-codes');
const client = yelp.client('Y8s6dW3uAs-TZ34YRekghk7llJxJuj3JjNAcLtADi-OZ02Dl66_soagZHv-eTyQFHC8fGWfxblXrZxyW3msB1GARItcv2KG0qhzgowweVi4qxdw3fijzXeIyKKd2XXYx');

const LOCATION = 'Alpharetta';
const CATEGORY = 'icecream';
const LIMIT = 5;

const validateReview = (response) => {
	return new Promise((resolve, reject) => {
		if(response.statusCode == httpStatus.OK) {
			resolve(JSON.parse(response.body).reviews);
		}
	});
}

const processReview = (reviews) => {
	return new Promise((resolve, reject) => {
		resolve(reviews[0].text);
	});
}

const fetchReview = (shopAlias) => {
	return new Promise((resolve, reject) => {
		client.reviews(shopAlias).then(
			validateReview
		).then(
			processReview
		).then(
			resolve
		).catch(e => {
			console.log(e);
		});
	});
}

const validateSearch = (response) => {
	return new Promise((resolve, reject) => {
		if(response.statusCode == httpStatus.OK) {
			resolve(JSON.parse(response.body).businesses);
		}
	});
}

const processSearch = (shops) => {
	return new Promise(async (resolve, reject) => {
		console.log('Processing results...');

		const reviews = new Object();

		await Promise.all(shops.map(async (shop) => {
			const review = await fetchReview(shop.alias);
			reviews[shop.id] = review.split("\n").join();
		}));

		resolve({"shops": shops, "reviews": reviews});
	});
}

const displayShops = (results) => {
	return new Promise((resolve, reject) => {
		console.log("Following are the Top 5 Ice Cream Shops in Alpharetta \n");

		results.shops.forEach((shop) => {
			console.log(shop.name + "\nReview - ( " + results.reviews[shop.id] + " )\n");
		});
	});
}

console.log('Fetching Top 5 Ice Cream Shops in Alpharetta...');
 
client.search({
	location: LOCATION,
	categories: CATEGORY,
	sort_by: 'rating',
	limit: LIMIT,
}).then(
	validateSearch
).then(
	processSearch
).then(
	displayShops
).catch(e => {
	console.log('Error occurred. Please find details below.');
	console.error(e);
});
