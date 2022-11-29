import {
  AutoPlacement,
  BasePlacement,
  VariationPlacement,
  VirtualElement,
} from "@popperjs/core";
import React, {
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { usePopper } from "react-popper";
import { useSpring } from "react-spring";
import { Colors } from "types";
import {
  StyledContainer,
  StyledContent,
  StyledLabel,
  StyledRow,
} from "./TooltipNewStyles";

interface TooltipNew {
  // for debugging
  instanceName: string;
  // essential
  visible: boolean;
  referenceElement: Element | VirtualElement | null;
  // content
  label?: string;
  content?: ReactElement[] | ReactElement;
  tagGroup?: boolean;
  // style
  color?: typeof Colors[number];
  position?: AutoPlacement | BasePlacement | VariationPlacement;
  noArrow?: boolean;
  offsetX?: number;
  offsetY?: number;

  disabled?: boolean;
  disableAutoPosition?: boolean;
  onMouseOut?: () => void;
}
export const TooltipNew: React.FC<TooltipNew> = ({
  instanceName,
  // essential
  visible = false,
  referenceElement,
  // content
  label = "",
  content,
  tagGroup = false,
  // style
  color = "black",
  position = "bottom",
  noArrow = false,
  offsetX = 0,
  offsetY = 7,

  disabled = false,
  disableAutoPosition = false,
  onMouseOut = () => console.log("default"),
}) => {
  const [popperElement, setPopperElement] =
    useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes, update, state, forceUpdate } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: position,
      modifiers: [
        { name: "arrow", options: { element: arrowElement } },
        {
          name: "offset",
          options: {
            offset: [offsetX, offsetY],
          },
        },
        {
          name: "flip",
          enabled: !disableAutoPosition,
          options: {
            fallbackPlacements: ["auto"],
          },
        },
      ],
    }
  );

  const animatedTooltip = useSpring({
    opacity: visible ? 1 : 0,
    config: { mass: 2, friction: 2, tension: 100, clamp: true },
  });

  useEffect(() => {
    if (visible) console.log(instanceName);
  }, [visible]);

  // Needed for state update
  useEffect(() => {
    if (!update) {
      return;
    }
    if (visible) {
      update();
    }
  }, [update, visible, label, content]);

  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    visible ? setShowTooltip(true) : setShowTooltip(false);
  }, [visible]);

  const [tooltipHovered, setTooltipHovered] = useState(false);

  return (
    <>
      {!disabled && (showTooltip || tooltipHovered) && (
        <StyledContainer
          ref={setPopperElement}
          style={{ ...styles.popper, ...animatedTooltip }}
          color={color}
          onMouseLeave={() => {
            onMouseOut();
            setTooltipHovered(false);
          }}
          arrowoffset={-offsetY}
          onMouseEnter={() => {
            setTooltipHovered(true);
          }}
          {...attributes.popper}
        >
          {!noArrow && (
            <div ref={setArrowElement} style={styles.arrow} id="arrow" />
          )}
          <div>
            {label && (
              <StyledContent>
                <StyledRow>
                  <StyledLabel>{label}</StyledLabel>
                </StyledRow>
              </StyledContent>
            )}
            {content && (
              <StyledContent tagGroup={tagGroup}>{content}</StyledContent>
            )}
          </div>
        </StyledContainer>
      )}
    </>
  );
};
