$(function initializeMap () {

  const fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  const styleArr = [
    {
      featureType: 'landscape',
      stylers: [{ saturation: -100 }, { lightness: 60 }]
    },
    {
      featureType: 'road.local',
      stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
    },
    {
      featureType: 'transit',
      stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
    },
    {
      featureType: 'administrative.province',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      stylers: [{ visibility: 'on' }, { lightness: 30 }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
    }
  ];

  const mapCanvas = document.getElementById('map-canvas');

  const currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  // const iconURLs = {
  //   hotel: '/images/lodging_0star.png',
  //   restaurant: '/images/restaurant.png',
  //   activity: '/images/star-3.png'
  // };

  function drawMarker (type, coords) {
    // TODO: Pan map / recalculate viewport here maybe?
    const latLng = new google.maps.LatLng(coords[0], coords[1]);
    const marker = new google.maps.Marker({
      position: latLng
    });
    marker.setMap(currentMap);
    return marker
  }

  // 0. Fetch the database, parsed from json to a js object
  //const db = fetch('/api').then(r => r.json())

  // // TODO:
  // // 1. Populate the <select>s with <option>s
  // $('select').each(
  //   (_index, select) => {
  //     db.then(db =>
  //       $(select).append(
  //         db[select.dataset.type].map (
  //           item => Object.assign(
  //             $(`<option>${item.name}</option>`)[0]
  //             , {
  //               item: item,
  //             })
  //         )
  //       )
  //     )
  //   })

  // 2. Wire up the add buttons
  // We could do this if we wanted to select by the add
  // dataset item instead:
  //
  //   $('button[data-action="add"]').click(
  // $('button.add').on('click',
  //   evt =>
  //     $(evt.target.dataset.from)
  //       .find('option:selected')
  //       .each((_i, option) => {
  //         const item = option.item
  //             , type = $(option)
  //                 .closest('select')[0]
  //                 .dataset.type
  //
  //         // Make a li out of this item
  //         const li = $(`<li>${item.name} <button class='del'>x</button></li>`)[0]
  //         // Draw a marker on the map and attach the marker to the li
  //         li.marker = drawMarker(type, item.place.location)
  //
  //         // Add this item to our itinerary for the current day
  //         $('.current.day').append(li)
  //       })
  // )

  $('button.add').on('click', function(e) {
    var target = e.target;
    var selected = $(target).siblings('select').find('option:selected')[0];
    //console.log($(target))
    var selectedName = $(selected).text();
    var typeid = $(target).siblings('select').attr('id')
    var currDay = $('.current');  //THIS NEEDS TO BE A NUMBER
    var currString = currDay.text()
        currString = currString.split("day ")
        currString = currString[1].split("x")
        currString = currString[0];  //Ok, now I have the day number
    console.log(currString)

    console.log(typeid)
    switch(typeid) {
      case "hotels":
      $('.current').children('.hotelList').append('<li>' + selectedName + '</li>'); break;
      case "restaurants":
      $('.current').children('.restList').append('<li>' + selectedName + '</li>'); break;
      case "activities":
      $('.current').children('.actList').append('<li>' + selectedName + '</li>'); break;
    }

    addItemToDay(currString, typeid, selectedName);

  })

  // 3. Wire up delete buttons
  $(document).on('click', 'button.del',
    evt => $(evt.target).closest('li').each((_i, li) => {
      li.marker.setMap(null)
      $(li).remove()
    })
  )

  // 4. Deal with adding days
  $('button.addDay').on('click',
    evt => {
      // Deselect all days
      $('.day.current').removeClass('current')

      // Add a new day
      $(evt.target).before(
        $(`<ol class="current day"><h3><span class=day-head></span><button class=delDay>x</button></h3></ol>`)
      )
      postNewDay();
      numberDays();
    }
  )

  function numberDays() {
    $('.day').each(function(index, day) {
      $(day).find('.day-head').text(`day ${index + 1}`)
      return index + 1;
    }
    )
  }

  //TODO: when switching days, display the day's data in the list below it.
  //All of the db data is already in the broswer when the page loads.
  // Add a div under each day that is clicked.

  // 5. Deal with switching days
  $(document).on('click', '.day-head',
    evt => {
      $('div').remove('.showDay')  //remove the div that shows that day's data
      $('.day.current').removeClass('current')

      const $day = $(evt.target).closest('.day')

      $('li').each((_i, li) => li.marker && li.marker.setMap(null))
      $day.addClass('current')
      $day.append('<div class="showDay hotelList"><h4>Hotels</h4></div'); //append a div with hotels

      $day.append('<div class="showDay restList"><h4>Restaurants</h4></div'); //append a div with restaurants
      $day.append('<div class="showDay actList"><h4>Activities</h4></div'); //Append a div with activities
      $day.find('li').each((_i, li) => li.marker.setMap(currentMap))
    }
  )
//TODO:
  //for each item in the array, append the db data into a ul/li to it's appropriate div.

  // 6. Remove a day
  $(document).on('click', 'button.delDay',
    evt => {
      const $day = $(evt.target).closest('.day')
      var dayText = $day.text().split(" ");
            dayNum = dayText[1].split("x")[0]
      if ($day.hasClass('current')) {
        const prev = $day.prev('.day')[0]
            , next = $day.next('.day')[0]
        $day.removeClass('current')
        $(prev || next).addClass('current')
      }
      deleteDay(dayNum)
      $day.find('li').each((_i, li) => li.marker.setMap(currentMap))
      $day.remove()
      numberDays()
    })

  // When we start, add a day
  //Or not, because I don't want it to click every time the user refreshes.
  //$('button.addDay').click()

//BEGIN AJAX STUFF **************************************************
//POPULATE SELECTS: This populates the select buttons.
//*******************************************************************
const populateSelects = (option) => {
  var selectBtn;

   switch (option) {
     case hotels: selectBtn = $('select')[0]; break;
     case restaurants: selectBtn = $('select')[1]; break;
     case activities: selectBtn = $('select')[2]; break;
   }

  $.get('/api/')
  .then(function(allPlaces) {
    var place = "";

    switch(option) {
      case hotels: place="hotels"; break;
      case restaurants: place="restaurants"; break;
      case activities: place="activities"; break;
    }

    var set = allPlaces[place]
    $.each(set, function(index, val) {
      $(selectBtn).append($(`<option>${val.name}</option>`))
    })
  })
}

populateSelects(hotels);
populateSelects(restaurants);
populateSelects(activities);

//*************************************************************************
//getAndDisplayAllDays : Displays all the days when the page loads
//*************************************************************************
//*************************************************************************

function getAndDisplayAllDays() {
  $.ajax({
  method: 'GET',
  url: '/api/days'
  })
  .then(days => {
     console.log('GET response data: ', days)
     $.each(days, function(index, val) {
       $('button.addDay').before(
       $(`<ol class="current day"><h3><span class=day-head></span><button class=delDay>x</button></h3></ol>`)
     )
     numberDays()
     })

 })
  .catch(console.error.bind(console));
}

getAndDisplayAllDays();

//*************************************************************************
//postNewDay: Posts a new day to the database and to the page
//*************************************************************************
//*************************************************************************
function postNewDay() { //sends a request to the route which handles adding a new day to db
  $.ajax({
    method: 'POST',
    url: '/api/days'
    })
    .then(data => { console.log('POST response data: ', data) })
    .catch(console.error.bind(console));
}
//called on line 132

//*************************************************************************
//deleteDay: Deletes the day from the database
//*************************************************************************
//*************************************************************************
//
function deleteDay(id) {
  $.ajax({
    method: 'DELETE',
    url: '/api/days/' + $.param({id: id})
    })
    .then(data => { console.log('DELETE response data: ', data) })
    .catch(console.error.bind(console));
}

//called on line 169

//*************************************************************************
//addItemToDay: Adds a hotel, restaurant, or activity to a day
//*************************************************************************
//*************************************************************************

//when you click the add button, this will send a post request with the day#, the name of the place, and the type of activity
function addItemToDay(dayNum, placeType, placeName) {
  $.ajax({
    method: 'POST',
    url: '/api/add',
    data: {day: dayNum, type: placeType, name: placeName}
    })
    .then(data => { console.log('POST response data: ', data) })
    .catch(console.error.bind(console));
}

//called on line 121

// function ajax1() {
// $.ajax({
// method: 'GET',
// url: '/api/days'
// })
// .then(function (data) { console.log('GET response data: ', data) })
// .catch(console.error.bind(console));
// }
//
// $('#hotels').on('click', function() {
//   $.ajax({
//   method: 'POST',
//   url: '/api/days'
//   })
//   .then(function (data) { console.log('POST response data: ', data) })
//   .catch(console.error.bind(console));
// })


 //ajax1();
// ajax2();


// function logstuff(restaurants) {
//   $.get('/api/restaurants')
//   .then(function (restaurants) {
//     restaurants.forEach(function(restaurant){
//       console.log(restaurant.name);
//     });
//   })
// }
//
// logstuff(restaurants)





});
