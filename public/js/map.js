var map;
var markers = [];
var userPosition = null;
let restaurants = null;
var maxDistance = Infinity;
var maxPrice = Infinity;
var checks = new Set();

function filterMarkers() {
    if ( !userPosition || !restaurants ) {
        return;
    }

    // Init distances
    if ( restaurants.length > 0 && restaurants[0].distance === undefined ) {
        for ( let i = 0; i < restaurants.length; i++ ) {
            restaurants[i].distance =measure( userPosition.lat, userPosition.lng, restaurants[i].xCoordinate, restaurants[i].yCoordinate );
            if ( isNaN( restaurants[i].distance)) {
                restaurants[i].distance = Infinity;
            }
        }
    }

    for ( let i = 0; i < markers.length; i++ ) {
        if ( restaurants[i].distance <= maxDistance && restaurants[i].price <= maxPrice ) {
            markers[i].setMap( map );
        } else {
            markers[i].setMap( null );
        }
    }
}

let distanceSlider = document.getElementById( 'slider-distance' );
distanceSlider.addEventListener( 'change', ( target ) => {
    maxDistance = target.target.value;
    filterMarkers();
} );

let priceSlider = document.getElementById( 'slider-price' );
priceSlider.addEventListener( 'change', ( target ) => {
    maxPrice = target.target.value;
    filterMarkers();
} );

// Icons: https://www.mappity.org/
function initMap() {
    restaurants = restaurant_list;

    map = new google.maps.Map( document.getElementById( 'map' ), {
        // Set start position
        center: {lat: 42.695961, lng: 23.327274},
        zoom: 15
    } );

    // Pan to Current Location button
    const locationButton = document.createElement( "button" );
    locationButton.className = 'btn btn-light';
    locationButton.textContent = "Покажи ме на картата";
    locationButton.classList.add( "custom-map-control-button" );
    map.controls[google.maps.ControlPosition.TOP_CENTER].push( locationButton );
    locationButton.addEventListener( "click", zoomOnMe );

    function zoomOnMe() {
        // Try HTML5 geolocation.
        if ( navigator.geolocation ) {
            const infowindow = new google.maps.InfoWindow( {
                content: 'Вие сте тук',
            } );

            navigator.geolocation.getCurrentPosition(
                ( position ) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    userPosition = pos;
                    marker = new google.maps.Marker( {
                        position: new google.maps.LatLng( pos.lat, pos.lng ),
                        icon: {
                            url: '../assets/img/user.png',
                            scaledSize: new google.maps.Size( 45, 45 )
                        },
                        map: map,
                        title: 'Вие сте тук',
                        animation: google.maps.Animation.DROP,
                    } );
                    marker.addListener( "click", () => {
                        infowindow.open( map, marker );
                    } );
                    map.setCenter( pos );
                },
                () => {
                    //- handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        }
    }
    zoomOnMe();

    // Put marker on click

    // var userMarker = null;
    // map.addListener( "click", ( mapsMouseEvent ) => {
    //     const pos = JSON.parse(JSON.stringify( mapsMouseEvent.latLng.toJSON(), null, 2 ));
    //     if (userMarker) {
    //         userMarker.setMap(null);
    //     }
    //     userMarker = new google.maps.Marker( {
    //         position: new google.maps.LatLng( pos.lat, pos.lng ),
    //         icon: {
    //             url: '../assets/img/user.png',
    //             scaledSize: new google.maps.Size( 45, 45 )
    //         },
    //         map: map,
    //     } );
    // } );

    // Add markers for restaurants
    var restaurantWindow = null;
    restaurants.forEach( function ( sc ) {
        // Custom pop-up window on click
        if (!sc.score) {
            sc.score = 'Няма';
        }
        if (!sc.price || sc.price === 0) {
            sc.price = Infinity;
        }
        if (!sc.count) {
            sc.count = 'Няма';
        }
        var restaurantPopupContent = `<h4>${sc.restaurantName}</h4>Рейтинг: ${sc.score}<br>Цена: ${sc.price}<br>Налични: ${sc.count}<br><a href="/restaurants/${sc.id}">Поръчай сега!</a>`;
        const infowindow = new google.maps.InfoWindow( {
            content: restaurantPopupContent,
        } );
        let icon = 'marker_red_restaurant.png';
        if (sc.features && sc.features.includes('shop')) {
            icon = 'marker_shop.png';
        } else if ( sc.features && sc.features.includes( 'vegan' ) ) {
            icon = 'marker_green_restaurant.png';
        } else if ( sc.features && sc.features.includes( 'keto' ) ) {
            icon = 'marker_blue_restaurant.png';
        } else if ( sc.features && sc.features.includes( 'sugar' ) ) {
            icon = 'marker_cyan_restaurant.png';
        } else if ( sc.features && sc.features.includes( 'gluten' ) ) {
            icon = 'marker_pink_restaurant.png';
        }
        var marker = new google.maps.Marker( {
            position: new google.maps.LatLng( sc.xCoordinate, sc.yCoordinate ),
            icon: {
                url: '../assets/img/' + icon,
                scaledSize: new google.maps.Size( 45, 45 )
            },
            map: map,
            title: sc.restaurantName,
            animation: google.maps.Animation.DROP
        } );

        // Close old pop-ups
        marker.addListener( "click", () => {
            if ( restaurantWindow ) {
                restaurantWindow.close();
            }
            infowindow.open( map, marker );
            restaurantWindow = infowindow;
        } );
        markers.push( marker );
    } );
}

function measure( lat1, lon1, lat2, lon2 ) {  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
        Math.cos( lat1 * Math.PI / 180 ) * Math.cos( lat2 * Math.PI / 180 ) *
        Math.sin( dLon / 2 ) * Math.sin( dLon / 2 );
    var c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
    var d = R * c;
    return d * 1000; // meters
}
