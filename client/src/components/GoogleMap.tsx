import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  coordinates: string;
}

interface GoogleMapProps {
  address?: string;
  coordinates?: string;
  onLocationSelect?: (locationData: LocationData) => void;
  className?: string;
  height?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function GoogleMap({ 
  address, 
  coordinates, 
  onLocationSelect, 
  className = '',
  height = '380px'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');

  // Process location data helper function
  const processLocationData = (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat, lng } },
      (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const result = results[0];
          const components = result.address_components;
          
          // Extract city, state from address components
          let city = '';
          let state = '';
          
          for (const component of components) {
            const types = component.types;
            
            if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name; // Use short name for state (e.g., CA, NY)
            }
          }
          
          const locationData: LocationData = {
            lat,
            lng,
            address: result.formatted_address,
            city: city || '',
            state: state || '',
            coordinates: `${lat.toFixed(6)},${lng.toFixed(6)}`
          };
          
          onLocationSelect?.(locationData);
        } else {
          const locationData: LocationData = {
            lat,
            lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            city: '',
            state: '',
            coordinates: `${lat.toFixed(6)},${lng.toFixed(6)}`
          };
          
          onLocationSelect?.(locationData);
        }
      }
    );
  };

  // Load Google Maps API
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key not found');
      return;
    }

    if (window.google) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps');
    
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
    
    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 100,
      center: defaultLocation,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });



    // Add click listener for coordinate selection
    newMap.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      // Update marker position
      if (marker) {
        marker.setPosition({ lat, lng });
      } else {
        const newMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map: newMap,
          draggable: true,
        });
        
        newMarker.addListener('dragend', () => {
          const position = newMarker.getPosition();
          const newLat = position.lat();
          const newLng = position.lng();
          processLocationData(newLat, newLng);
        });
        
        setMarker(newMarker);
      }
      
      processLocationData(lat, lng);
    });

    setMap(newMap);
  }, [isLoaded, map, marker, onLocationSelect]);

  // Update map based on address or coordinates
  useEffect(() => {
    if (!map || !window.google) return;

    if (coordinates) {
      // Parse coordinates (format: "lat,lng")
      const [lat, lng] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const position = { lat, lng };
        map.setCenter(position);
        map.setZoom(18); // Increased zoom level for closer view of coordinates
        
        if (marker) {
          marker.setPosition(position);
        } else {
          const newMarker = new window.google.maps.Marker({
            position,
            map,
            draggable: true,
          });
          
          newMarker.addListener('dragend', () => {
            const markerPosition = newMarker.getPosition();
            const newLat = markerPosition.lat();
            const newLng = markerPosition.lng();
            processLocationData(newLat, newLng);
          });
          
          setMarker(newMarker);
        }
      }
    } else if (address && address.trim()) {
      // Geocode the address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          
          // Determine zoom level based on location type
          const geocodeResult = results[0];
          let zoomLevel = 50; // Default high zoom for specific addresses
          
          // Check if it's a specific building/home address vs general area
          const hasStreetNumber = geocodeResult.address_components.some((component: any) => 
            component.types.includes('street_number')
          );
          
          if (hasStreetNumber) {
            zoomLevel = 50; // Very close zoom for specific house/building addresses
          } else {
            // Check for premise or subpremise (specific building within complex)
            const hasPremise = geocodeResult.address_components.some((component: any) => 
              component.types.includes('premise') || component.types.includes('subpremise')
            );
            zoomLevel = hasPremise ? 50 : 40; // Closer for buildings, moderate for general areas
          }
          
          map.setCenter({ lat, lng });
          map.setZoom(zoomLevel);
          
          if (marker) {
            marker.setPosition({ lat, lng });
          } else {
            const newMarker = new window.google.maps.Marker({
              position: { lat, lng },
              map,
              draggable: true,
            });
            
            newMarker.addListener('dragend', () => {
              const markerPosition = newMarker.getPosition();
              const newLat = markerPosition.lat();
              const newLng = markerPosition.lng();
              
              processLocationData(newLat, newLng);
            });
            
            setMarker(newMarker);
          }
          
          // Extract location data from geocoded result
          const addressResult = results[0];
          const components = addressResult.address_components;
          
          let city = '';
          let state = '';
          
          for (const component of components) {
            const types = component.types;
            
            if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            }
          }
          
          const locationData: LocationData = {
            lat,
            lng,
            address: addressResult.formatted_address,
            city: city || '',
            state: state || '',
            coordinates: `${lat.toFixed(6)},${lng.toFixed(6)}`
          };
          
          onLocationSelect?.(locationData);
        } else {
          setError('Address not found');
        }
      });
    }
  }, [map, address, coordinates, marker, onLocationSelect]);

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-dashed border-red-300 dark:border-red-600 flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-red-600" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-600 animate-pulse" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}