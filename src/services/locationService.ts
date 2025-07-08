export async function getCurrentLocation(): Promise<string> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          resolve(data.display_name || `${latitude}, ${longitude}`);
        } catch (err) {
          reject('Failed to reverse geocode location');
        }
      },
      (err) => reject('Location access denied')
    );
  });
}
