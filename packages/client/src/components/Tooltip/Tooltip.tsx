import React, { ReactElement } from "react";
import { AiOutlineTag } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { BsCardText } from "react-icons/bs";
import { PopupPosition, EventType } from "reactjs-popup/dist/types";

import { StyledDetail, StyledLabel, StyledPopup } from "./TooltipStyles";

interface Tooltip {
  children: ReactElement;
  position?: PopupPosition | PopupPosition[];
  on?: EventType | EventType[];
  label?: string;
  detail?: string;
  text?: string;
  disabled?: boolean;
  attributes?: React.ReactElement[];
  tagTooltip?: boolean;
}
export const Tooltip: React.FC<Tooltip> = ({
  children,
  position = ["bottom center", "right center", "top center"],
  on = ["hover", "focus"],
  label = "",
  detail,
  text,
  attributes,
  tagTooltip = false,
  disabled = false,
}) => {
  return (
    <StyledPopup
      trigger={children}
      mouseLeaveDelay={0}
      position={position}
      on={on}
      disabled={disabled}
    >
      <div>
        {attributes ? (
          attributes
        ) : (
          <>
            <StyledLabel>
              {tagTooltip && <AiOutlineTag />}
              {label}
            </StyledLabel>
            <StyledDetail>
              {text && <BsCardText />}
              {text}
            </StyledDetail>
            <StyledDetail>
              {tagTooltip && <BiCommentDetail />}
              {detail}
            </StyledDetail>
          </>
        )}
      </div>
    </StyledPopup>
  );
};
