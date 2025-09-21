import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';

interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  type: string;
  count: number;
  location: string;
}

interface GoogleMapsHeatmapProps {
  data: HeatmapPoint[];
  selectedTypes: string[];
  onPointClick?: (point: HeatmapPoint) => void;
}

// Google Maps API loader with proper async loading
class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private loadPromise: Promise<void> | null = null;
  private isLoaded = false;

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async load(): Promise<void> {
    // Return existing promise if already loading
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Return immediately if already loaded
    if (this.isLoaded && window.google?.maps?.visualization) {
      return Promise.resolve();
    }

    // Create loading promise
    this.loadPromise = this.loadScript();
    
    try {
      await this.loadPromise;
      this.isLoaded = true;
    } catch (error) {
      this.loadPromise = null; // Reset on error so we can try again
      throw error;
    }

    return this.loadPromise;
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google?.maps?.visualization) {
        resolve();
        return;
      }

      // Remove any existing scripts to avoid conflicts
      const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      existingScripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });

      // Create unique callback name
      const callbackName = `initGoogleMaps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=visualization&loading=async&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      
      // Set up timeout
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Google Maps API loading timeout'));
      }, 30000); // 30 second timeout

      const cleanup = () => {
        clearTimeout(timeout);
        delete (window as any)[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
      
      // Global callback function
      (window as any)[callbackName] = () => {
        cleanup();
        // Verify that all required APIs are loaded
        if (window.google?.maps?.visualization) {
          resolve();
        } else {
          reject(new Error('Google Maps visualization API not available'));
        }
      };
      
      script.onerror = (error) => {
        cleanup();
        reject(new Error('Failed to load Google Maps API script'));
      };
      
      // Add to head
      document.head.appendChild(script);
    });
  }
}

// Singleton loader instance
const googleMapsLoader = GoogleMapsLoader.getInstance();

export function GoogleMapsHeatmap({ data, selectedTypes, onPointClick }: GoogleMapsHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const heatmapLayer = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        // Wait for component to be fully mounted
        await new Promise(resolve => setTimeout(resolve, 50));
        
        if (!isMounted) return;

        // Check if map container exists and is visible
        if (!mapRef.current) {
          setError('Map container not found - component may not be mounted properly');
          return;
        }

        // Ensure container has dimensions
        const containerRect = mapRef.current.getBoundingClientRect();
        if (containerRect.width === 0 || containerRect.height === 0) {
          setError('Map container has no dimensions - check CSS styling');
          return;
        }

        console.log('Loading Google Maps API...');
        setError(null);

        // Load Google Maps API
        await googleMapsLoader.load();
        
        if (!isMounted) return;

        // Verify API is available
        if (!window.google?.maps) {
          throw new Error('Google Maps API not available after loading');
        }

        console.log('Initializing map instance...');

        // Initialize map centered on India
        const mapConfig = {
          center: { lat: 20.5937, lng: 78.9629 }, // Center of India
          zoom: 5,
          mapTypeId: 'roadmap' as google.maps.MapTypeId,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          // Additional options for better performance
          gestureHandling: 'cooperative',
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        };

        mapInstance.current = new google.maps.Map(mapRef.current, mapConfig);

        // Wait for map to be fully initialized
        await new Promise<void>((resolve) => {
          const listener = mapInstance.current!.addListener('idle', () => {
            google.maps.event.removeListener(listener);
            resolve();
          });
        });

        if (!isMounted) return;

        console.log('Map initialized successfully');
        setIsLoaded(true);
        toast.success('Google Maps loaded successfully');

      } catch (error) {
        console.error('Failed to initialize Google Maps:', error);
        if (isMounted) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          setError(`Failed to load Google Maps: ${errorMessage}`);
          toast.error('Failed to load Google Maps');
        }
      }
    };

    // Start initialization after a brief delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapInstance.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // Clear existing heatmap
    if (heatmapLayer.current) {
      heatmapLayer.current.setMap(null);
    }

    // Filter data based on selected types
    const filteredData = data.filter(point => selectedTypes.includes(point.type));

    if (filteredData.length === 0) return;

    // Create heatmap data
    const heatmapData = filteredData.map(point => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      weight: point.intensity * point.count
    }));

    // Create heatmap layer
    heatmapLayer.current = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: mapInstance.current
    });

    // Configure heatmap
    heatmapLayer.current.set('radius', 50);
    heatmapLayer.current.set('opacity', 0.6);
    heatmapLayer.current.set('gradient', [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]);

    // Add markers for high-intensity points
    filteredData
      .filter(point => point.intensity > 0.6)
      .forEach(point => {
        const marker = new google.maps.Marker({
          position: { lat: point.lat, lng: point.lng },
          map: mapInstance.current,
          title: `${point.location}: ${point.count} reports`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: getTypeColor(point.type),
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: Math.max(6, point.intensity * 10)
          }
        });

        // Add click listener
        marker.addListener('click', () => {
          onPointClick?.(point);
          
          // Show info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
                  ${point.location}
                </h3>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  ${point.count} ${point.type.replace('-', ' ')} reports
                </p>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #999;">
                  Intensity: ${Math.round(point.intensity * 100)}%
                </p>
              </div>
            `
          });

          infoWindow.open(mapInstance.current, marker);
        });

        markers.current.push(marker);
      });

  }, [data, selectedTypes, isLoaded, onPointClick]);

  const getTypeColor = (type: string): string => {
    const colors = {
      'phishing': '#ef4444',
      'otp-fraud': '#f97316',
      'fake-promotion': '#eab308',
      'deepfake': '#a855f7',
      'other': '#6b7280'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  if (error) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Failed</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Check your internet connection</p>
            <p>• Verify Google Maps API key</p>
            <p>• Try refreshing the page</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative min-h-[400px]">
      <div 
        ref={mapRef} 
        className="w-full h-full absolute inset-0"
        style={{ 
          minHeight: '400px',
          background: '#f5f5f5' // Fallback background while loading
        }}
      />
      
      {/* Map Legend */}
      {isLoaded && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border z-10">
          <h4 className="text-sm font-semibold mb-2">Scam Intensity</h4>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-2 bg-gradient-to-r from-cyan-400 to-red-600 rounded"></div>
            <span>Low → High</span>
          </div>
        </div>
      )}

      {/* Attribution */}
      {isLoaded && (
        <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded text-xs text-gray-600 z-10">
          © Google Maps
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black text-white text-xs p-2 rounded z-20">
          <div>Loaded: {isLoaded ? 'Yes' : 'No'}</div>
          <div>API: {window.google?.maps ? 'Available' : 'Not available'}</div>
          <div>Container: {mapRef.current ? 'Found' : 'Not found'}</div>
        </div>
      )}
    </div>
  );
}

// Type declarations for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        LatLng: any;
        Marker: any;
        InfoWindow: any;
        SymbolPath: any;
        visualization: {
          HeatmapLayer: any;
        };
      };
    };
  }
}
