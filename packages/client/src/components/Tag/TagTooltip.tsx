import { Tooltip } from "components";
import React, { ReactElement } from "react";
import { PopupPosition } from "reactjs-popup/dist/types";

interface TagTooltip {
  label?: string;
  detail?: string;
  text?: string;
  children: ReactElement;
  position?: PopupPosition | PopupPosition[];
  disabled?: boolean;
}
export const TagTooltip: React.FC<TagTooltip> = ({
  label,
  detail,
  text,
  position,
  children,
  disabled,
}) => {
  return (
    <Tooltip
      label={label ? label : "(no label)"}
      detail={detail ? detail : "(no detail)"}
      text={text}
      position={position}
      disabled={disabled}
      tagTooltip
    >
      {children}
    </Tooltip>
  );
};
