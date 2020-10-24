
var map;
var superchargers = [
    {
        title: 'Bar',
        latitude: 42.695961,
        longitude: 23.327274,
    },
];

// Icons: https://www.mappity.org/
function initMap() {
    var map = new google.maps.Map( document.getElementById( 'map' ), {
        center: {lat: 42.695961, lng: 23.327274},
        zoom: 15
    } );

    // Pan to Current Location
    
    const locationButton = document.createElement( "button" );
    locationButton.className = 'btn btn-light';
    locationButton.textContent = "Покажи ме на картата";
    locationButton.classList.add( "custom-map-control-button" );
    map.controls[google.maps.ControlPosition.TOP_CENTER].push( locationButton );
    locationButton.addEventListener( "click", () => {
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
                    marker = new google.maps.Marker( {
                        position: new google.maps.LatLng( position.coords.latitude, position.coords.longitude ),
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
    } );
    
    var userMarker = null;
    map.addListener( "click", ( mapsMouseEvent ) => {
        const pos = JSON.parse(JSON.stringify( mapsMouseEvent.latLng.toJSON(), null, 2 ));
        if (userMarker) {
            userMarker.setMap(null);
        }
        userMarker = new google.maps.Marker( {
            position: new google.maps.LatLng( pos.lat, pos.lng ),
            icon: {
                url: '../assets/img/user.png',
                scaledSize: new google.maps.Size( 45, 45 )
            },
            map: map,
        } );
    } );


    superchargers.forEach( function ( sc ) {
        var marker = new google.maps.Marker( {
            position: new google.maps.LatLng( sc.latitude, sc.longitude ),
            icon: {
                url: '../assets/img/restaurant_marker.png',
                scaledSize: new google.maps.Size( 45, 45 )
            },
            map: map,
            title: sc.title,
            animation: google.maps.Animation.DROP
        } );
    } );
}

/*
Init in .pug with:

  style.
    #map {
      width: 100%;
      height: 500px;
    }

  #map
  script(src='/js/map.js')
  script(async defer src=`https://maps.googleapis.com/maps/api/js?key=${google_map_api_key}&callback=initMap`)
*/
