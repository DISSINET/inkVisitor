import React, { ReactNode } from "react";
import {
  OptionsType,
  OptionTypeBase,
  GroupedOptionsType,
  ValueType,
} from "react-select";

import { StyledSelect, StyledSelectWrapper } from "./DropdownStyles";
import { Tooltip } from "components";
import theme from "Theme/theme";

interface Dropdown {
  options?: OptionsType<OptionTypeBase> | GroupedOptionsType<OptionTypeBase>;
  value?: ValueType<OptionTypeBase>;
  label?: string;
  onChange: (selectedOption: ValueType<OptionTypeBase>) => void;
  ref?: React.RefObject<ReactNode>;
  width?: number | "full";
  menuWidth?: number;
  hideSelectedOptions?: boolean;
  noDropDownIndicator?: boolean;
  formatOptionLabel?: Function;
  isOptionSelected?: Function;
  getOptionLabel?: Function;
  placeholder?: string;
  isClearable?: boolean;
}
export const Dropdown: React.FC<Dropdown> = ({
  options,
  value,
  label = "",
  onChange,
  width,
  menuWidth,
  isOptionSelected,
  getOptionLabel,
  formatOptionLabel,
  hideSelectedOptions = false,
  noDropDownIndicator = false,
  placeholder = "select..",
  isClearable = false,
}) => {
  return (
    <Tooltip label={label} position={["top center"]} on={["hover"]}>
      <StyledSelectWrapper width={width}>
        <StyledSelect
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder={placeholder}
          isClearable={isClearable}
          {...(getOptionLabel ? { getOptionLabel: getOptionLabel } : {})}
          {...(formatOptionLabel
            ? { formatOptionLabel: formatOptionLabel }
            : {})}
          {...(isOptionSelected ? { isOptionSelected: isOptionSelected } : {})}
          value={value}
          styles={{
            dropdownIndicator: () => {
              return {
                display: noDropDownIndicator ? "none" : "",
              };
            },
            menu: () => {
              return {
                width: menuWidth ? menuWidth : width,
                position: "absolute",
                top: "2em",
                zIndex: 100,
                backgroundColor: "white",
              };
            },
          }}
          onChange={onChange}
          options={options}
          width={width}
          hideSelectedOptions={hideSelectedOptions}
        />
      </StyledSelectWrapper>
    </Tooltip>
  );
};
