import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CRITICAL_ZONES = [
  { name: 'Tiruvannamalai (Incident)', pos: [12.2253, 79.0747] as [number, number] },
  { name: 'Chennai Coast', pos: [13.0827, 80.2707] as [number, number] },
];

const SAFE_ZONES = [
  { name: 'Coimbatore Relief Center', pos: [11.0168, 76.9558] as [number, number] },
  { name: 'Salem Safe Zone', pos: [11.6643, 78.1460] as [number, number] },
];

const GROUND_STATIONS = [
  { name: 'Shadnagar NRSC', pos: [17.0700, 78.2100] as [number, number] },
];

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function LiveMap() {
  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
      <MapContainer 
        center={[11.1271, 78.6569]} 
        zoom={7} 
        className="h-full w-full"
        style={{ background: '#050505' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {CRITICAL_ZONES.map((zone, i) => (
          <React.Fragment key={i}>
            <Marker position={zone.pos} icon={redIcon}>
              <Popup>
                <div className="text-black">
                  <h3 className="font-bold text-red-600 uppercase">Critical Zone</h3>
                  <p>{zone.name}</p>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={zone.pos} 
              radius={20000} 
              pathOptions={{ color: 'red', fillOpacity: 0.2 }} 
            />
          </React.Fragment>
        ))}

        {SAFE_ZONES.map((zone, i) => (
          <Marker key={i} position={zone.pos} icon={greenIcon}>
            <Popup>
              <div className="text-black">
                <h3 className="font-bold text-green-600 uppercase">Safe Zone</h3>
                <p>{zone.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {GROUND_STATIONS.map((station, i) => (
          <Marker key={i} position={station.pos} icon={blueIcon}>
            <Popup>
              <div className="text-black">
                <h3 className="font-bold text-blue-600 uppercase">Ground Station</h3>
                <p>{station.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend Overlay */}
      <div className="absolute bottom-8 right-8 z-[1000] bg-telemetry-bg border border-white/10 p-4 rounded-xl space-y-2 text-[10px] uppercase font-bold">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Critical Zones</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-radar-green" />
          <span>Safe Zones</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-satellite-blue" />
          <span>Ground Stations</span>
        </div>
      </div>
    </div>
  );
}
