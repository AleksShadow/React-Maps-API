// import "./App.css";
import React, { useEffect, useState } from "react";
import {
  Map,
  //Marker,
  AdvancedMarker,
  Pin,
  InfoWindow
} from "@vis.gl/react-google-maps";

const CustomMap = () => {

  const [markerLocation, setMarkerLocation] = useState([]);
  const [openMarker, setOpenMarker] = useState(false);

  const url = "https://jsonplaceholder.typicode.com/users";

  console.log("Started again...")
  
  const selectAddress = (id) => {
    const newList = markerLocation.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          isActive: true,
        };
        return updatedItem;
      } else {
          const updatedItem = {
            ...item,
            isActive: false,
          };
          return updatedItem;
      };
      return item;
    });
    setMarkerLocation(newList);
    window.location.href = `#location_${id}`;
  }


  useEffect(() => {

      fetch(url)
      .then(response => response.json())
      .then(locationArray => {
  
          let newMarkerLocations = locationArray.map((location) => {
               return {
                 ...location,
                isActive: false,}
          })
          // Convert string coordinates to numbers
          newMarkerLocations.forEach(function(record) {
              record.address.geo.lat = +record.address.geo.lat
              record.address.geo.lng = +record.address.geo.lng
          });
          setMarkerLocation(newMarkerLocations);
        })
  }, [])
    

  const hasMarkers = markerLocation.length > 0;
  console.log(markerLocation);
              
  let markerLocationCenter = hasMarkers ? markerLocation[0].address.geo : {lat: 0, lng: 0}
  
  return (
    <div className="row ml-5 mr-3">
      <div className="map-container">
        <Map
          style={{ borderRadius: "10px" }}
          defaultZoom={1}
          defaultCenter={markerLocationCenter}
          gestureHandling={"greedy"}
          // disableDefaultUI
          mapId={process.env.REACT_APP_MAP_ID}
          >

          {hasMarkers
            ? markerLocation.map((location) => {
              return (<AdvancedMarker
                        key={location.id}
                        position={location.address.geo}
                        onClick={() => selectAddress(location.id)}
                        zIndex={location.isActive ? 10 : 1}
                        className="custom-marker"
                        style={{transform: `scale( ${location.isActive ?  1.3 : 1} )`}}
                      >

                      {location.isActive
                          ? <Pin
                          background={"#ed4c3e"}
                          borderColor={"#cc2623"}
                          glyphColor={"#bb1411"}
                          />
                          : <Pin
                          background={"#1965c4"}
                          borderColor={"#6d0aa5"}
                          glyphColor={"#fff"}
                        />}
                      {location.isActive &&
                                            <InfoWindow
                                            position={location.address.geo}pixelOffset={[0, -40]}
                                            onClick={() => {
                                              selectAddress(location.id);
                                              }}>
                      <p>Address: {location.address.city} {location.address.street}</p>
                      </InfoWindow>}
                      </AdvancedMarker>)
            })
            : "Loading..."
          }

            </Map>
      </div>
      <div className="scroll-container col-md-4" id="right">

            {markerLocation.map((record) => {
              return (
              <div id={`location_${record.id}`} onClick={() => selectAddress(record.id)} className={record.isActive ? 'address active' : 'address'}>
                
                <div key={record.id}><b><a href={record.website}>{record.name}</a></b>
                  <div>Email: {record.email}</div>
                  <div>Phone: {record.phone}</div>
                  <div>Website: <a href={record.website}>{record.website}</a></div>
                  <div>Address: {record.address.street} {record.address.suite} {record.address.city}</div>
                </div><hr></hr>
              </div>
              )}
            )}

      </div>
    </div>
  );
}

export default CustomMap;