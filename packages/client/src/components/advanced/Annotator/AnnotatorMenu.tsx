import { IEntity } from "@shared/types";
import React from "react";
import {
  StyledAnnotatorItem,
  StyledAnnotatorItemTitle,
  StyledAnnotatorMenu,
} from "./AnnotatorStyles";
import { EntityTag } from "../EntityTag/EntityTag";
import { EntitySuggester } from "../EntitySuggester/EntitySuggester";
import { classesAll } from "types";

interface TextAnnotatorMenuProps {
  text: string;
  anchors: string[];
  entities: Record<string, IEntity | false>;
  onAnchorAdd: (entityId: string) => void;
  yPosition: number;
  topBottomSelection: boolean;
}

export const TextAnnotatorMenu = ({
  text,
  anchors,
  entities,
  onAnchorAdd,
  yPosition,
  topBottomSelection,
}: TextAnnotatorMenuProps) => {
  return (
    <>
      {text ? (
        <StyledAnnotatorMenu
          style={{
            top: `${yPosition}px`,
            transform: `translate(0%, ${topBottomSelection ? "0%" : "-100%"})`,
          }}
        >
          <StyledAnnotatorItem>
            <StyledAnnotatorItemTitle>Add new anchor</StyledAnnotatorItemTitle>
            <EntitySuggester
              categoryTypes={classesAll}
              initTyped={text.length > 20 ? text.substring(0, 20) : text}
              onSelected={(newAnchorId) => {
                onAnchorAdd(newAnchorId);
              }}
              inputWidth={200}
            />
          </StyledAnnotatorItem>
          <StyledAnnotatorItem>
            <StyledAnnotatorItemTitle>
              Existing anchors
            </StyledAnnotatorItemTitle>
            <div>
              {anchors.map((anchor) => {
                if (entities[anchor]) {
                  return (
                    <EntityTag
                      key={anchor}
                      entity={entities[anchor] as IEntity}
                    />
                  );
                } else {
                  return <React.Fragment key={anchor} />;
                }
              })}
            </div>
          </StyledAnnotatorItem>
        </StyledAnnotatorMenu>
      ) : (
        <></>
      )}
    </>
  );
};

export default TextAnnotatorMenu;