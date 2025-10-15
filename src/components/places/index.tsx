"use client";
import Script from "next/script";
import {
    ChangeEventHandler,
    forwardRef,
    ForwardRefRenderFunction,
    ReactNode,
    useCallback, useMemo,
    useState,
} from "react";
import AutocompleteService = google.maps.places.AutocompleteService;
import SearchAutocomplete, { ControlProps } from "@/components/autocomplete";
import PlacesService = google.maps.places.PlacesService;
import {
  UseComboboxGetInputPropsOptions,
  UseComboboxSelectedItemChange,
} from "downshift";
import { Box, InputProps, VStack, Text } from "@chakra-ui/react";
import {useBoolean} from "usehooks-ts";

type AutocompleteSuggestion = {
  id: google.maps.places.AutocompletePrediction["place_id"];
  title: google.maps.places.StructuredFormatting["main_text"];
  subtitle: google.maps.places.StructuredFormatting["secondary_text"];
};

export type WrappedPlacesAutocompleteInputViewProps = {
  onSelectPlace: (
    suggestion: AutocompleteSuggestion,
    placeResult: google.maps.places.PlaceResult | null,
  ) => void;
  request?: Partial<google.maps.places.AutocompletionRequest>;
  renderItem?: (item: AutocompleteSuggestion) => ReactNode;
  onReady?: () => void;
} & Omit<UseComboboxGetInputPropsOptions, "size"> &
  ControlProps<InputProps>;

export const WrappedPlacesAutocompleteInputView: ForwardRefRenderFunction<
  HTMLInputElement,
  WrappedPlacesAutocompleteInputViewProps
> = (
  {
    onSelectPlace,
    onChange,
    invalid,
    required,
    value = "",
    request,
      onReady,
    renderItem = (item) => (
      <Box px={3} py={1}>
        <VStack align="stretch" gap={0.5}>
          <Text>{item.title}</Text>
          <Text color="gray.500" fontSize="sm">
            {item.subtitle}
          </Text>
        </VStack>
      </Box>
    ),
    ...props
  },
  ref,
) => {
  const { setTrue, setFalse, value: ready } = useBoolean(false);
  const [autocompleteService, setAutocompleteService] =
    useState<AutocompleteService>();
  const [placesService, setPlacesService] = useState<PlacesService>();
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);

    const searchOptions: Omit<google.maps.places.AutocompletionRequest, 'input'> = useMemo(() => {
        return {
            componentRestrictions: {
                country: 'ua',
            },
            language: 'uk',
            types: [
                'country',
                'political',
                'locality',
                'sublocality',
            ],
        };
    }, []);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      onChange?.(e);
      if (ready && autocompleteService && e.target.value) {
        const { predictions } = await autocompleteService.getPlacePredictions({
          input: e.target.value,
          ...searchOptions,
          ...request,
        });

          setSuggestions(
              predictions.map((prediction) => ({
                  title: prediction.structured_formatting.main_text,
                  subtitle: prediction.structured_formatting.secondary_text,
                  id: prediction.place_id,
              })),
          );
      }
    },
    [ready, autocompleteService],
  );

  const handleSelect = useCallback(
    ({
      selectedItem,
    }: UseComboboxSelectedItemChange<AutocompleteSuggestion>) => {
      if (!placesService || !selectedItem) {
        return;
      }
      placesService.getDetails(
        {
          placeId: selectedItem.id,
            fields: ['address_components', 'geometry', 'place_id'],
            region: 'uk',
            language: 'uk'
        },
        (placeResult) => {
          if (!placeResult) {
            return;
          }
          onSelectPlace?.(selectedItem, placeResult);
        },
      );
    },
    [onSelectPlace, placesService],
  );

  return (
    <>
      <Script
        onReady={() => {
          setTrue();
          setAutocompleteService(new google.maps.places.AutocompleteService());
          setPlacesService(
            new google.maps.places.PlacesService(document.createElement("div")),
          );

            onReady?.();
        }}
        onLoadStart={setFalse}
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&v=weekly`}
      />
      <SearchAutocomplete
        onSelectedItemChange={handleSelect}
        ref={ref}
        inputProps={{
          ...props,
          value,
          onChange: handleChange,
          invalid,
          required,
        }}
        menuProps={{
            className: 'text-sm'
        }}
        items={suggestions}
        renderItem={renderItem}
        itemToString={(item) => item?.title || ""}
      />
    </>
  );
};

export const PlacesAutocompleteInput = forwardRef(
  WrappedPlacesAutocompleteInputView,
);
