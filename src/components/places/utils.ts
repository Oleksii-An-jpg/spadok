export type Address = {
    country: string;
    state: string;
    region: string;
    city: string;
    id: string;
    latLng: {
        lat: number,
        lng: number
    }
    line?: string
};

const addressComponentsMap = {
    country: ['country'],
    state: [
        'administrative_area_level_1',
    ],
    region: [
        'administrative_area_level_2'
    ],
    city: [
        'locality',
        'sublocality',
        'sublocality_level_1',
        'sublocality_level_2',
        'sublocality_level_3',
        'sublocality_level_4',
    ],
};

const addressTemplate: Address = Object.freeze({
    country: '',
    state: '',
    region: '',
    city: '',
    id: '',
    latLng: {
        lat: 50.46362376799382,
        lng: 30.45292139053345
    }
});

const assignAddressComponent = (
    address: Address,
    component: google.maps.GeocoderAddressComponent,
    [addressKey, components]: [string, string[]],
) => {
    if (components.indexOf(component.types[0]) !== -1) {
        switch (addressKey) {
            case 'region':
            case 'state':
                address[addressKey] = component.short_name;
                break;
            case 'country':
            case 'city':
                address[addressKey] = component.long_name;
                break;
        }
    }
};

const assignAddressComponents = (
    address: Address,
    component: google.maps.GeocoderAddressComponent,
) => {
    Object.entries(addressComponentsMap).forEach(
        ([addressKey, components]) =>
            assignAddressComponent(address, component, [addressKey, components]),
    );
};

export const parseAddress = (placeResult: google.maps.places.PlaceResult) => {
    const address: Address = {
        ...addressTemplate,
    };

    if (placeResult.geometry?.location) {
        address.latLng = {
            lat: placeResult.geometry.location.lat(),
            lng: placeResult.geometry.location.lng()
        }
    }

    if (placeResult.place_id) {
        address.id = placeResult.place_id
    }

    if (!placeResult.address_components) {
        return address;
    }

    placeResult.address_components.forEach((component) =>
        assignAddressComponents(address, component),
    );

    return address;
};

export const getTextFromPrediction = (prediction: google.maps.places.AutocompletePrediction) => {
    return [prediction.structured_formatting.main_text, prediction.structured_formatting.secondary_text].filter(Boolean).join(', ')
}

export const getTextFromAddress = (address: Address) => {
    return [address.city, address.region, address.state, address.country].filter(Boolean).join(', ')
}