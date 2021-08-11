import React, { Component } from 'react';
import axios from 'axios';
import './Map.scss';
import ErrorComponents from '../SubComponents/ErrorComponenet/ErrorComponent'
class Map extends Component {
    constructor(props) {
        super(props);
        this.locations = [];
        this.map = null;
        this.errorState = false;
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

                    let marker, i;
                    let infowindow = new window.google.maps.InfoWindow;
                    for (i = 0; i < this.locations.length; i++) {
                        if (this.locations[i].location.latLng) {
                            marker = new window.google.maps.Marker({
                                icon: {
                                    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
                                    fillColor: this.locations[i].color,
                                    fillOpacity: 0.99,
                                    strokeWeight: 1,
                                    rotation: 0,
                                    scale: 1
                                },

                                position: new window.google.maps.LatLng(this.locations[i].location.latLng.lat, this.locations[i].location.latLng.lng),
                                map: this.map,
                                title: this.locations[i].title
                            });
                        }

                        window.google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent(marker.title);
                                infowindow.open(this.map, marker);
                            }
                        })(marker, i));
                    }


                })
                .catch(function (error) {
                    console.log(error)
                    // this.errorState = true;
                })
        }
    }

    componentDidMount() {
        this.getLocations();
    }

    render() {
        return (
            <div data-role="page" id="map_result">
                {this.errorState && <ErrorComponents />}
                {!this.errorState &&
                    <div data-role="content" >
                        <div id="map"></div>
                    </div>
                }
            </div>
        );
    }
}

export default Map;