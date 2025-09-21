// Utility to test Google Maps API loading
export const testGoogleMapsAPI = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return { success: false, message: 'Not in browser environment' };
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps?.visualization) {
      return { 
        success: true, 
        message: 'Google Maps API already loaded',
        details: {
          mapsVersion: window.google.maps.version,
          hasVisualization: !!window.google.maps.visualization
        }
      };
    }

    // Try to load the API
    const testLoad = new Promise((resolve, reject) => {
      const callbackName = `testGoogleMaps_${Date.now()}`;
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=visualization&loading=async&callback=${callbackName}`;
      script.async = true;
      
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Loading timeout'));
      }, 15000);

      const cleanup = () => {
        clearTimeout(timeout);
        delete (window as any)[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
      
      (window as any)[callbackName] = () => {
        cleanup();
        resolve(true);
      };
      
      script.onerror = () => {
        cleanup();
        reject(new Error('Script loading failed'));
      };
      
      document.head.appendChild(script);
    });

    await testLoad;

    // Verify API is working
    if (!window.google?.maps) {
      return { success: false, message: 'Google Maps API not available after loading' };
    }

    if (!window.google.maps.visualization) {
      return { success: false, message: 'Google Maps Visualization library not available' };
    }

    return { 
      success: true, 
      message: 'Google Maps API loaded successfully',
      details: {
        mapsVersion: window.google.maps.version,
        hasVisualization: !!window.google.maps.visualization,
        availableLibraries: Object.keys(window.google.maps)
      }
    };

  } catch (error) {
    return { 
      success: false, 
      message: `Failed to load Google Maps API: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error: error instanceof Error ? error.message : error }
    };
  }
};

// Quick diagnostic function
export const diagnoseGoogleMaps = () => {
  const diagnostics = {
    browserSupport: typeof window !== 'undefined',
    currentDomain: typeof window !== 'undefined' ? window.location.origin : 'N/A',
    googeObjectExists: typeof window !== 'undefined' && !!window.google,
    mapsObjectExists: typeof window !== 'undefined' && !!window.google?.maps,
    visualizationExists: typeof window !== 'undefined' && !!window.google?.maps?.visualization,
    scriptsInHead: typeof document !== 'undefined' ? 
      Array.from(document.querySelectorAll('script[src*="maps.googleapis.com"]')).length : 0
  };

  console.group('🗺️ Google Maps Diagnostics');
  console.table(diagnostics);
  console.groupEnd();

  return diagnostics;
};