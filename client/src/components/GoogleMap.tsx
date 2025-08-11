import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  address?: string;
  coordinates?: string;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
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
  height = '320px'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');

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
      zoom: 13,
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
          
          // Reverse geocode to get address
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: newLat, lng: newLng } },
            (results: any, status: any) => {
              if (status === 'OK' && results[0]) {
                onLocationSelect?.(newLat, newLng, results[0].formatted_address);
              } else {
                onLocationSelect?.(newLat, newLng, `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`);
              }
            }
          );
        });
        
        setMarker(newMarker);
      }
      
      // Reverse geocode to get address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            onLocationSelect?.(lat, lng, results[0].formatted_address);
          } else {
            onLocationSelect?.(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        }
      );
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
        map.setZoom(16);
        
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
            
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: newLat, lng: newLng } },
              (results: any, status: any) => {
                if (status === 'OK' && results[0]) {
                  onLocationSelect?.(newLat, newLng, results[0].formatted_address);
                } else {
                  onLocationSelect?.(newLat, newLng, `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`);
                }
              }
            );
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
          
          map.setCenter({ lat, lng });
          map.setZoom(16);
          
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
              
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode(
                { location: { lat: newLat, lng: newLng } },
                (results: any, status: any) => {
                  if (status === 'OK' && results[0]) {
                    onLocationSelect?.(newLat, newLng, results[0].formatted_address);
                  } else {
                    onLocationSelect?.(newLat, newLng, `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`);
                  }
                }
              );
            });
            
            setMarker(newMarker);
          }
          
          onLocationSelect?.(lat, lng, results[0].formatted_address);
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