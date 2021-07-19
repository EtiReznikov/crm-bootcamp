import React, { useEffect, useState, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
// import MapPin from './MapPin';
import './Map.scss'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

const MapPin = ({text}) => <div>{text} <i id="pin" className="fa fa-map-marker"></i></div>
function Map(props) {

  const [places, setPlaces] = useState([]);
  const [errorMsg, setError] = useState(false);

  const [userCurrentLocation, SetUserCurrentLocation] = useState({ lat: 0, lng: 0 });
  // const currentLocation= { lat: 0, lng: 0 }
  const zoom = 14

  // Return map bounds based on list of places
  const getMapBounds = (map, maps, places) => {
    const bounds = new maps.LatLngBounds();

    places.forEach((place, key) => {
      console.log(place.location)
      bounds.extend(new maps.LatLng(
        place.location.latLng.lat,
        place.location.latLng.lng,
      ));
    });
    return bounds;
  };

  // Re-center map when resizing the window
  const bindResizeListener = (map, maps, bounds) => {
    maps.event.addDomListenerOnce(map, 'idle', () => {
      maps.event.addDomListener(window, 'resize', () => {
        map.fitBounds(bounds);
      });
    });
  };

  // Fit map to its bounds after the api is loaded
  const apiIsLoaded = (map, maps, places) => {
    // Get bounds by our places
    const bounds = getMapBounds(map, maps, places);
    // Fit map to bounds
    map.fitBounds(bounds);
    // Bind the resize listener
    bindResizeListener(map, maps, bounds);
  };

  useEffect(() => {
    axios.post('http://localhost:991/classes/getClasses/', {
      business_id: localStorage.getItem('business_id'),
    })
      .then((response) => {
        if (response.data === "")
          setPlaces([]);

        else if (Array.isArray(response.data)) {
          setError(false)
          let data = []
          for (const classValue of response.data) {

            let temp = {
              class_id: classValue.class_id,
              class_name: classValue.class_name,
              color: classValue.color,
              location: JSON.parse(classValue.location)
            }
            data[classValue.class_id] = temp
          }
          setPlaces(data);
        }
        else {
          setError(true);
        }
      })
      .catch(function (error) {
        setError(true);
      });
  }, []);
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //   SetUserCurrentLocation({
  //     ...userCurrentLocation,
  //     lat: position.coords.latitude,
  //     lng: position.coords.longitude
  //   })
  // });
  // },[]);
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP__MAP_KEY }}
        defaultCenter={userCurrentLocation}
        defaultZoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, places)}
      >

        <>
          {places.map((place, key) => 
            <MapPin
              text= {key}
              lat={place.location.latLng.lat}
              lng={place.location.latLng.lng}
            />
          
          )}
        </>
        <MapPin lat={32.100744} lng={34.807026}/>
        <MapPin lat={32.0709839} lng={34.7872963}/>

      </GoogleMapReact>
    </div>
  );
}


export default Map;