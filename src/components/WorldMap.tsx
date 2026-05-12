import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, IconOptions } from "leaflet";
import { useEffect, useState } from "react";
import { MapPin, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Region {
  id: string;
  name: string;
  center: [number, number];
  spots: string[];
  description: string;
}

const regions: Region[] = [
  {
    id: "south-asia",
    name: "India",
    center: [20, 78],
    spots: ["Rajasthan", "Kerala", "Uttar Pradesh", "Karnataka", "Odisha", "Meghalaya"],
    description: "Statewise India circuits, sacred cities, wildlife, coastlines, and royal heritage."
  },
  {
    id: "southeast-asia",
    name: "Southeast Asia",
    center: [15, 105],
    spots: ["Vietnam", "Bali", "Thailand", "Singapore"],
    description: "Lush landscapes, vibrant street food, and ancient temples."
  },
  {
    id: "europe",
    name: "Europe",
    center: [48, 15],
    spots: ["Greece", "Switzerland", "Italy", "France"],
    description: "Historic architecture, high fashion, and culinary masterpieces."
  },
  {
    id: "east-asia",
    name: "East Asia",
    center: [36, 138],
    spots: ["Japan", "South Korea", "Taiwan"],
    description: "Future-meets-tradition, cherry blossoms, and neon nights."
  },
  {
    id: "africa",
    name: "North Africa",
    center: [31, -7],
    spots: ["Morocco", "Egypt", "Tunisia"],
    description: "Endless deserts, bustling souks, and ancient wonders."
  },
  {
    id: "middle-east",
    name: "Middle East",
    center: [25, 45],
    spots: ["Dubai", "Jordan", "Oman"],
    description: "Luxury skyscrapers, desert adventures, and hospitality."
  },
  {
    id: "oceania",
    name: "Oceania",
    center: [-25, 133],
    spots: ["Australia", "New Zealand", "Fiji"],
    description: "Stunning coastlines, outdoor adventures, and unique wildlife."
  }
];

interface WorldMapProps {
  onRegionSelect: (regionId: string) => void;
  selectedRegionId?: string | null;
  className?: string;
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 4, { animate: true });
    } else {
      map.setView([20, 10], 2.5, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function WorldMap({ onRegionSelect, selectedRegionId, className = "" }: WorldMapProps) {
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const navigate = useNavigate();

  // Leaflet icons initialized inside component to avoid top-level issues
  const customIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  } as IconOptions);

  const activeIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [30, 46],
    iconAnchor: [15, 46],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  } as IconOptions);

  useEffect(() => {
    if (selectedRegionId) {
      const region = regions.find(r => r.id === selectedRegionId);
      if (region) setActiveRegion(region);
    } else {
      setActiveRegion(null);
    }
  }, [selectedRegionId]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[500px] w-full ${className}`}>
      <MapContainer
        center={[20, 10]}
        zoom={2.5}
        minZoom={2}
        zoomControl={false}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ background: "#f8fafc" }}
      >
        <MapController center={activeRegion?.center || null} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {regions.map((region) => (
          <Marker 
            key={region.id} 
            position={region.center} 
            icon={activeRegion?.id === region.id ? activeIcon : customIcon}
            eventHandlers={{
              click: () => {
                setActiveRegion(region);
                onRegionSelect(region.id);
              },
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-lg">{region.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{region.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {region.spots.map(spot => (
                    <Badge key={spot} variant="secondary" className="text-[10px] px-2 py-0">
                      {spot}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 text-[10px] rounded-full px-2"
                    onClick={() => onRegionSelect(region.id)}
                  >
                    Explore
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 text-[10px] rounded-full px-2 gap-1"
                    onClick={() => navigate(`/contact?destination=${encodeURIComponent(region.name)}`)}
                  >
                    <Calendar className="w-3 h-3" />
                    Plan Trip
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Overlay controls or info could go here */}
      <div className="absolute top-4 left-4 z-[400] pointer-events-none">
        <div className="bg-background/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Global Exploration</h4>
          <p className="text-sm font-medium">Click markers to discover regions</p>
        </div>
      </div>
    </div>
  );
}
