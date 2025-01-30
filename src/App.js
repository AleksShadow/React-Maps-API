import React from "react";
import CustomMap from "./Components/CustomMap";
import { APIProvider } from "@vis.gl/react-google-maps";
import "./App.css";

const App = () => {
    return (
        <div className="app">
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <CustomMap />
        </APIProvider>
        </div>
    );
};

export default App;