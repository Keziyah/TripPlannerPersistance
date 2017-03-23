var Promise = require('bluebird');
var router = require('express').Router();

var db = require('../../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Place = db.model('place');
var Day = db.model('day');

//********DAY INFORMATION **********///////
//*****************************************//
//*****************************************//

router.get('/', (req, res, next) => {
	//let option = req.params.option;
	Promise.props({
		hotels: Hotel.findAll({include: [Place]}),
		restaurants: Restaurant.findAll({include: [Place]}),
		activities: Activity.findAll({include: [Place]})
	})
	.then(place => res.json(place))
	.catch(next)
})

router.get('/days', (req, res, next) => {  //get a list of all the days to post to homepage when it's first loaded
	//get all the days from the database, send them
	//use jquery's $.get to get all the days and display them
	Day.findAll({})
	.then(days => res.json(days))
	.catch(next)

  //res.send("YOU GOT ALL THE DAYS YAY CONGRATULATIONS")

})

// router.get('/days/:id', (req, res, next) => {  //get a specific day
// 	res.send("YOU GOT A DAY OMG YOURE SO COOL")
//
// })

router.post('/add', (req, res, next) => {
	//console.log("REQ BODY", req.body) //this works. now we need to use that info to add the days to the db.
	var day = Number(req.body.day);
	var table = req.body.type;
	var name = req.body.name;

	//add the name to the db according to the appropritate table
	//somehow join the table on the specific day.

})

router.post('/days', (req, res, next) => {
	///console.log("REQ BODY", req.body)
	//create a new day and send it back
	Day.count()
	.then(count => {
		Day.create({number: count + 1})
		.then(newDay => res.send(newDay))
	})
	.catch(next)

	// Day.create({number: 5})
	// .then(function(newDay) {
	// 	res.send(newDay)
	// 	//console.log(newDay)
	// })
	// .catch(next)

	//res.send("YOURE TRYING TO POST A DAY OMG AWESOME")
})

// Promise.all([
// 	Hotel.findAll({ include: [Place] }),
// 	Restaurant.findAll({ include: [Place] }),
// 	Activity.findAll({ include: [Place] })
// ])
// .spread(function(hotels, restaurants, activities) {
// 	res.render('index', {
// 		hotels: hotels,
// 		restaurants: restaurants,
// 		activities: activities
// 	})
// })
// .catch(next)

// router.post('/days/:id', (req, res, next) => {  //add a day
// 	res.send("YOU MADE A DAY OMG YOURE SO COOL")
// })

//the parameter will look like id=6
router.delete('/days/:idObj', (req, res, next) => { //delete a day
	///use sequelize destroy to delete the day from the database
	var idObj = req.params.idObj;
	id = idObj.split("=")[1];

	Day.findOne({
		where: {
			number: id
		}
	})
	.then(function(day) {
		day.destroy();
		res.send("You destroyed a day.")
	})
	.catch(next)
})

//********ADD/REMOVE ACTIVITIES **********///////
//*****************************************//
//*****************************************//


// router.delete('/days/:id/:item', (req, res, next) => {
//
// })





module.exports = router;
