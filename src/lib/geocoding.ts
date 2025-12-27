const geocodeCache = new Map<string, { lat: number; lng: number }>();

export async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
  if (geocodeCache.has(location)) {
    return geocodeCache.get(location)!;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
      {
        headers: {
          'User-Agent': 'OrchidsTravelApp/1.0',
        },
      }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      geocodeCache.set(location, result);
      return result;
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
