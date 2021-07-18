import React, { useEffect, useState , useCallback} from 'react';
import GoogleMapReact from 'google-map-react';
import MapPin from './MapPin';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Map (props) {
  const [userCurrentLocation, SetUserCurrentLocation] = useState({ lat: 32.07014, lng : 34.7866475 });
  // const currentLocation= { lat: 0, lng: 0 }
    const zoom= 11
  

    useEffect(() => {
      navigator.geolocation.getCurrentPosition(function(position) {
      SetUserCurrentLocation({
        ...userCurrentLocation,
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    });
    },[]);
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        {/* <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP__MAP_KEY }}
          defaultCenter={userCurrentLocation}
          defaultZoom={zoom}
        >
          
          <MapPin />
        </GoogleMapReact> */}
      </div>
    );
  }


export default Map;