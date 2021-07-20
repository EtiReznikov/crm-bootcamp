import React, { Component } from 'react';
import axios from 'axios';
import './Map.scss'
class Map extends Component {
    constructor(props) {
        super(props);
        this.locations = [
            ['Title A', 32.0853, 34.7818, 1],
            ['Title A', 32.0854, 34.7818, 2],
            ['Title A', 32.0855, 34.7818, 3],
            ['Title A', 32.0900, 34.7818, 4],
        ]
        this.map = null;
        this.getLocations = () => {
            axios.post('http://localhost:991/classes/getClasses/', {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    let data = []
                    for (const classValue of response.data) {
                        let temp = {
                            'title': classValue.class_name,
                            'color': classValue.color,
                            location: JSON.parse(classValue.location),
                            id: classValue.class_id
                        }
                        data.push(temp)


                    }
                    this.locations = data;

                    this.map = new window.google.maps.Map(document.getElementById('map'), {
                        zoom: 14,
                        center: new window.google.maps.LatLng(32.0853, 34.7818),
                        mapTypeId: window.google.maps.MapTypeId.ROADMAP
                    });

                    var marker, i;
                    var infowindow = new window.google.maps.InfoWindow;
                    for (i = 0; i < this.locations.length; i++) {
                        marker = new window.google.maps.Marker({
                           icon:{ 
                            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                            fillColor: this.locations[i].color,
                            fillOpacity: 0.9,
                            strokeWeight: 0,
                            rotation: 0,
                            scale: 1
                        },
                            position: new window.google.maps.LatLng(this.locations[i].location.latLng.lat, this.locations[i].location.latLng.lng),
                            map: this.map,
                            title: this.locations[i].title
                          
                        });

                        window.google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent(marker.title);
                                infowindow.open(this.map, marker);
                            }
                        })(marker, i));
                    }


                })
                .catch(function (error) {
                })
        }
    }

    componentDidMount() {
        this.getLocations();
    }

    render() {
        return (
            <div data-role="page" id="map_result">
                <div data-role="content" >
                    <div id="map"></div>
                </div>
            </div>
        );
    }
}

export default Map;