"use client";
import {
  useCombobox,
  UseComboboxGetInputPropsOptions,
  UseComboboxProps,
  UseComboboxReturnValue,
} from "downshift";
import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  JSX,
  ForwardRefRenderFunction,
  useImperativeHandle,
  ForwardedRef,
} from "react";
import clsx from "clsx";
import Option from "./components/Option";
import {
    Box, createListCollection,
    Field,
    Input,
    InputProps,
    Listbox,
    FieldRootProps
} from "@chakra-ui/react";

type BaseControlProps<T> = FieldRootProps &
  T & {
    isLoading?: boolean;
    label?: JSX.Element;
    helperText?: string;
    errorMessage?: string;
    render: (props: T) => JSX.Element;
  };

export type ControlProps<T> = Omit<BaseControlProps<T>, "render">;

function ControlView<T>(
  {
    disabled,
    invalid,
    required,
    helperText,
    errorMessage,
    render,
      label,
    ...rest
  }: BaseControlProps<T>,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <Field.Root
      disabled={disabled}
      invalid={invalid}
      required={required}
      ref={ref}
    >
      {label && <Field.Label fontSize="small">{label}</Field.Label>}
      {render(rest as T)}
      {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
      {errorMessage && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
    </Field.Root>
  );
}

const Control = forwardRef(ControlView) as <T>(
  props: BaseControlProps<T> & { ref?: Ref<HTMLDivElement> },
) => ReturnType<typeof ControlView>;

interface InputFieldProps extends InputProps {
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  isLoading?: boolean;
}
const InputFieldView: ForwardRefRenderFunction<
  HTMLInputElement,
  ControlProps<InputFieldProps>
> = ({ leftElement, rightElement, isLoading, ...props }, ref) => {
  return (
    <Control<InputProps>
      {...props}
      render={(props) => (
        <Field.Root alignItems="center">
          <Input autoComplete="off" {...props} ref={ref} />
        </Field.Root>
      )}
    />
  );
};

const InputField = forwardRef(InputFieldView);

export type SearchAutocompleteProps<T> = Partial<UseComboboxProps<T>> & {
  items: T[];
  renderItem: (item: T) => ReactNode;
  inputProps: Omit<UseComboboxGetInputPropsOptions, "size"> &
    ControlProps<InputProps>;
  menuProps?: HTMLAttributes<HTMLUListElement>;
  comboboxRef?: ForwardedRef<UseComboboxReturnValue<T>>;
};

function SearchAutocompleteView<
  T extends {
    id: string | number;
  },
>(
  {
    inputProps: { as, width, height, id, size, color, label, ...input },
    menuProps,
    comboboxRef,
    ...props
  }: SearchAutocompleteProps<T>,
  ref: Ref<HTMLInputElement>,
) {
  const combobox = useCombobox<T>(props);

  useImperativeHandle(comboboxRef, () => combobox, [combobox]);
  const collection = createListCollection<T>({
      items: props.items
  });

  const {
    getInputProps,
    getItemProps,
    getMenuProps,
    isOpen,
    highlightedIndex,
    selectedItem,
  } = combobox;
  const inputProps = getInputProps(input, {
    suppressRefError: true,
  });

  return (
    <Box className="relative w-full">
      <Box className="gap-1">
        <InputField
          {...inputProps}
          size={size}
          id={id}
          label={label}
          as={as}
          width={width}
          height={height}
          color={color}
          ref={ref}
        />
      </Box>
        <ul {...getMenuProps({
            ...menuProps,
            className: clsx(
                "absolute z-10 mt-1 max-h-80 w-full overflow-scroll bg-white p-0 shadow-md",
                menuProps?.className,
                {
                    hidden: !(isOpen && props.items.length),
                },
            ),
        })}>
            <Listbox.Root
                collection={collection}
                key={props.items.length}
            >
                {isOpen
                    ? props.items.map((item, index) => (
                        <Option
                            key={index}
                            highlightedIndex={highlightedIndex}
                            selectedItem={selectedItem}
                            {...getItemProps({
                                index,
                                item,
                            })}
                            renderItem={props.renderItem}
                            index={index}
                            item={item}
                        />
                    ))
                    : null}
            </Listbox.Root>
        </ul>
    </Box>
  );
}

const SearchAutocomplete = forwardRef(SearchAutocompleteView) as <T>(
  props: SearchAutocompleteProps<T> & { ref?: Ref<HTMLInputElement> },
) => ReturnType<typeof SearchAutocompleteView>;

export default SearchAutocomplete;
