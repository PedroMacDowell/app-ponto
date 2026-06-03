import * as Location from 'expo-location';

export const LocationService = {
  async getLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissao de localizacao:', error);
      return false;
    }
  },

  async getCurrentLocation() {
    try {
      const hasPermission = await this.getLocationPermission();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date().toISOString(),
      };

      locationData.address = await this.getAddressFromCoordinates(
        locationData.latitude,
        locationData.longitude
      );

      return locationData;
    } catch (error) {
      console.error('Erro ao obter localizacao:', error);
      return null;
    }
  },

  async getAddressFromCoordinates(latitude, longitude) {
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      return this.formatAddress(address);
    } catch (error) {
      console.error('Erro ao obter endereco:', error);
      return null;
    }
  },

  formatAddress(address) {
    if (!address) return null;

    const street = [address.street, address.streetNumber]
      .filter(Boolean)
      .join(', ');
    const cityLine = [address.district, address.city || address.subregion]
      .filter(Boolean)
      .join(' - ');
    const regionLine = [address.region, address.postalCode]
      .filter(Boolean)
      .join(', ');

    return [street, cityLine, regionLine].filter(Boolean).join(' | ');
  },

  formatCoordinates(latitude, longitude) {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  },

  formatLocation(location) {
    if (!location) return 'Localizacao indisponivel';
    return (
      location.address ||
      this.formatCoordinates(location.latitude, location.longitude)
    );
  },
};
