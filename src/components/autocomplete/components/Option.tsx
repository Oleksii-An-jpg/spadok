import {ReactNode} from "react";
import clsx from "clsx";
import {Box, BoxProps} from "@chakra-ui/react";

type OptionProps<T> = BoxProps & {
  highlightedIndex: number;
  index: number;
  item: T;
  selectedItem: T | null;
  renderItem: (item: T) => ReactNode;
};

function Option<T>({
  highlightedIndex,
  index,
  selectedItem,
  item,
  renderItem,
  ...props
}: OptionProps<T>) {
  return (
    <Box
      _hover={{ bg: "gray.200" }}
      cursor="pointer"
      className={clsx({
        "bg-gray-200": highlightedIndex === index,
        "font-bold bg-gray-200": selectedItem === item,
      })}
      {...props}
    >
      {renderItem(item)}
    </Box>
  );
}

export default Option;
