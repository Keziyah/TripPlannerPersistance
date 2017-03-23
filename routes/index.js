var Promise = require('bluebird');
var router = require('express').Router();
var apiRoutes = require('./api/days.js');

var db = require('../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Place = db.model('place');
var Day = db.model('day');

router.use('/api', apiRoutes)

router.get('/', function(req, res, next) {
	Promise.all([
		Hotel.findAll({ include: [Place] }),
		Restaurant.findAll({ include: [Place] }),
		Activity.findAll({ include: [Place] })
	])
	.spread(function(hotels, restaurants, activities) {
		res.render('index', {
			hotels: hotels,
			restaurants: restaurants,
			activities: activities
		})
	})
	.catch(next)
})


//THINGS THAT SHOULD GO IN API/DAYS.js
//************************************

//END API/DAYS.js
//******************************************************************************




// Example:
//
// Use Fetch (built in browser API):
//
//   fetch('/api').then(res => json()).then(doSomethingWithIt)
//
// Use jQuery's $.get:
//
//   $.get('/api').then(doSomethingWithIt)
//
// Or:
//
//   $.ajax('/api', {method: 'get'}).then(doSomethingWithIt)
//
// router.get('/api/:option', (req, res, next) =>
// 	var option = req.params.option;
// 	Promise.props({
// 		hotels: Hotel.findAll({ include: [Place] }),
// 		restaurants: Restaurant.findAll({ include: [Place] }),
// 		activities: Activity.findAll({ include: [Place] })
// 	})
// 		.then(place => res.json(place[option]))
// 		.catch(next)
// )

// router.get('/api/', (req, res, next) => {
// 	//let option = req.params.option;
// 	Promise.props({
// 		hotels: Hotel.findAll({include: [Place]}),
// 		restaurants: Restaurant.findAll({include: [Place]}),
// 		activities: Activity.findAll({include: [Place]})
// 	})
// 	.then(place => res.json(place))
// 	.catch(next)
// })

//router.use('/api', apiRoutes);

// Use Fetch (built in browser API):
//
//   IDK, look it up on MDN?
//
// Use jQuery's $.post:
//
//   $.post('/api/echo', {hello: 'world'}).then(doSomethingWithIt)
// router.post('/api/echo', (req, res) => res.json(req.body))
//
// router.post('/api/hotels',
// 	(req, res, next) =>
// 		Hotel.create(req.body)
// 			.then(hotel => res.json(hotel))
// 			.catch(next))

// $.get('/api/restaurants')
// .then(function (restaurants) {
//   restaurants.forEach(function(restaurant){
//     console.log(restaurant.name);
//   });
// })
// .catch( console.error.bind(console) );

module.exports = router;
