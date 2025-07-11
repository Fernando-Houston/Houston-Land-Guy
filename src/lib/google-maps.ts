import { Loader } from '@googlemaps/js-api-loader';

let loader: Loader | null = null;
let googleMapsLoaded = false;

export const initGoogleMaps = () => {
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }
  return loader;
};

export const loadGoogleMaps = async () => {
  if (googleMapsLoaded) return;
  
  const loader = initGoogleMaps();
  await loader.load();
  googleMapsLoaded = true;
};

export const createAutocompleteInput = async (
  inputElement: HTMLInputElement,
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void
) => {
  await loadGoogleMaps();
  
  const autocomplete = new google.maps.places.Autocomplete(inputElement, {
    types: ['address'],
    componentRestrictions: { country: 'us' },
    fields: ['address_components', 'geometry', 'name', 'formatted_address']
  });

  autocomplete.setBounds(
    new google.maps.LatLngBounds(
      new google.maps.LatLng(29.5, -95.8),
      new google.maps.LatLng(30.2, -94.8)
    )
  );

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      onPlaceSelect(place);
    }
  });

  return autocomplete;
};

export const extractAddressComponents = (place: google.maps.places.PlaceResult) => {
  const components = place.address_components || [];
  
  const getComponent = (type: string): string => {
    const component = components.find(c => c.types.includes(type));
    return component?.long_name || '';
  };

  return {
    streetNumber: getComponent('street_number'),
    streetName: getComponent('route'),
    city: getComponent('locality'),
    state: getComponent('administrative_area_level_1'),
    zipCode: getComponent('postal_code'),
    neighborhood: getComponent('neighborhood') || getComponent('sublocality'),
    formatted: place.formatted_address || ''
  };
};