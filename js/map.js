var map;
var markers = [];
function initMap() {
var sanDiego = {lat: 32.7913085, lng: -117.1523774};
// Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: sanDiego,
        zoom: 11
    });
// Create a marker for each location
    for(var i = 0; i < locations.length; i++) {
        var title = locations[i].title;
        var position = locations[i].location;
        var yelpTitle = locations[i].yelpTitle;

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP,
            title: title,
            yelpTitle: yelpTitle,
            id: i,
        });
        markers.push(marker);
        marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);
        });
        marker.addListener('click', function() {
            toggleBounce(this);
        });
        var yelp_url = 'https://api.yelp.com/v2/business/' + yelpTitle;
        getAjax(yelp_url, i);

    }
    

    var infoWindow = new google.maps.InfoWindow();
    
    //Content to be displayed in infoWindow
    function populateInfoWindow(marker, infowindow) {
        var address = marker.yelpData.location.display_address.join(' ');
        var content;
        content = '<div>';
        content += ('<strong>' + marker.yelpData.name + ' ' + '</strong>');
        content += (' <a target="_blank" href=' + marker.yelpData.url + '><i class="fa fa-external-link" aria-hidden="true"></i></a>');
        content += '<br>';
        content += ('<img src="' + marker.yelpData.rating_img_url_small + '" alt="Number of yelp stars"' +'/>')
        content += '<br>';
        content += marker.yelpData.display_phone;
        content += '<br>';
        content += address;
        content += '</div>';
        infowindow.marker = marker;
        infowindow.open(map, marker);
        infowindow.setContent(content);       
    }
    
    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
}

var locations = [
        {title: 'El Patron',
         yelpTitle: 'el-patron-traditional-mexican-grill-san-diego',
         location: {lat: 32.9190785, lng: -117.1230289},
        },
        {title: 'Tacos El Gordo',
         yelpTitle: 'tacos-el-gordo-chula-vista-3',
         location: {lat: 32.6382757, lng: -117.1124098},
        },
        {title: 'Lucha Libre Taco Shop',
         yelpTitle: 'lucha-libre-gourmet-taco-shop-san-diego',
         location: {lat: 32.7495285, lng: -117.1563436},
        },
        {title: "Lolita's Taco Shop",
         yelpTitle: 'lolitas-taco-shop-san-diego',
         location: {lat: 32.8323715, lng: -117.1626472},
        },
        {title: 'Tacos El Panson',
         yelpTitle: 'tacos-el-panson-san-diego',
         location: {lat: 32.8325007, lng: -117.2304995},
        }
    ];

//Array of just the location titles
var titlesArray = locations.map(function(value) {
    return value.title;
});
function viewModel() {
    var self = this;
    //Value for the search box
    this.inputValue = ko.observable($('#input').val());
    this.titles = ko.observableArray(titlesArray);
    this.filteredTitles = ko.computed(function(){
       return self.titles().filter(function(value){
           return value.toLowerCase().includes(self.inputValue().toLowerCase());
       }); 
    });

}
ko.applyBindings(new viewModel());

// Adds event listener to search box
// Removes marker for a location if it doesn't fit the search criteria
$('#input').on('input', function() {
    var inputValue = $('#input').val();
    for(var i = 0; i < markers.length; i++) {
        //if the input value does not include the title, set that marker to hide.
        if(markers[i].title.toLowerCase().includes(inputValue.toLowerCase()) === false) {
            markers[i].setVisible(false);
        } else {
            markers[i].setVisible(true);
        }
    }
});

// Add event listener to the list items
// When clicked, triggers info window for that restaurant
$('ul').on('click', function(event) {
    for(var i = 0; i < markers.length; i++) {
        if(markers[i].title.includes(event.target.innerHTML)) {
            google.maps.event.trigger(markers[i], 'click');
        }
    }
});



/// YELP API CODE
//  ---------------------------------------------
const YELP_BASE_URL = 'https://api.yelp.com/v2/';
const YELP_KEY = 'MRwDQFLrZ7dbekGz6EeUiw';
const YELP_TOKEN = '8mO8yunLu4sp8CuTNRb6jB-_-TxxZT6b';
const YELP_KEY_SECRET = '4wwZHNzEy4iIKvmyw4oaezNuRM0';
const YELP_TOKEN_SECRET = 'r0EVFUDW2yxFP5UA-XiAHyu7NMI';

function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

// Makes an ajax call to retrieve yelp API data
// Success function sets API data as a property of a marker
function getAjax(yelp_url, i) {

    var parameters = {
      oauth_consumer_key: YELP_KEY,
      oauth_token: YELP_TOKEN,
      oauth_nonce: nonce_generate(),
      oauth_timestamp: Math.floor(Date.now()/1000),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version : '1.0',
      callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    };

    var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;

    var settings = {
      url: yelp_url,
      data: parameters,
      cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
      dataType: 'jsonp',
      success: function(results) {
          markers[i].yelpData = results;
      },
      error: function(error) {
        alert('Unable to retrieve Yelp API data.');
      }
    };
    $.ajax(settings);
}
