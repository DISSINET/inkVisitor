import { useEffect, useRef, useState } from "react";
import React from "react";
import { Annotator, example, Highlighted } from "@inkvisitor/annotator/src/lib";
import {
  StyledCanvasWrapper,
  StyledHightlightedText,
  StyledLinesCanvas,
  StyledMainCanvas,
  StyledScrollerCursor,
  StyledScrollerViewport,
} from "./AnnotatorStyles";
import { Button } from "components/basic/Button/Button";
import { useAnnotator } from "./AnnotatorContext";
import TextAnnotatorMenu from "./AnnotatorMenu";
import api from "api";
import { IResponseEntity } from "@shared/types";

export const TextAnnotator = () => {
  const { annotator, setAnnotator } = useAnnotator();

  const mainCanvas = useRef(null);
  const scroller = useRef(null);
  const lines = useRef(null);
  const [highlighted, setSelected] = useState<Highlighted>();

  const [selectedText, setSelectedText] = useState<string>("");
  const [selectedAnchors, setSelectedAnchors] = useState<string[]>([]);
  const [entities, setEntities] = useState<
    Record<string, IResponseEntity | false>
  >({});

  const fetchEntity = async (anchor: string) => {
    const entity = await api.entitiesGet(anchor);
    return entity;
  };

  const addEntityToStore = (eid: string, entity: IResponseEntity | false) => {
    setEntities((prevEntities) => ({
      ...prevEntities,
      [eid]: entity,
    }));
  };

  const handleTextSelection = async (text: string, anchors: string[]) => {
    setSelectedText(text);
    setSelectedAnchors(anchors);

    for (const anchorI in anchors) {
      const anchor = anchors[anchorI];
      if (!entities[anchor]) {
        try {
          const entityRes = await fetchEntity(anchor);
          if (entityRes && entityRes.data) {
            addEntityToStore(anchor, entityRes.data);
          }
        } catch (error) {
          addEntityToStore(anchor, false);
        }
      }
    }
  };

  useEffect(() => {
    if (!mainCanvas.current || !scroller.current || !lines.current) {
      return;
    }

    const annotator = new Annotator(mainCanvas.current, example);
    annotator.setMode("raw");
    annotator.addScroller(scroller.current);
    annotator.addLines(lines.current);
    annotator.onSelectText(({ text, anchors }) => {
      handleTextSelection(text, anchors);
    });
    annotator.onHighlight((entity: string) => {
      return {
        mode: "background",
        style: {
          color: "pink",
        },
      };
    });
    annotator.draw();
    setAnnotator(annotator);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <StyledCanvasWrapper>
        <TextAnnotatorMenu
          anchors={selectedAnchors}
          text={selectedText}
          entities={entities}
        />
        <StyledLinesCanvas ref={lines} width="50px" height="400px" />
        <StyledMainCanvas
          tabIndex={0}
          ref={mainCanvas}
          width="400px"
          height="400px"
        />
        <StyledScrollerViewport ref={scroller}>
          <StyledScrollerCursor />
        </StyledScrollerViewport>
      </StyledCanvasWrapper>
      {highlighted && false && (
        <StyledHightlightedText>{highlighted?.text}</StyledHightlightedText>
      )}
      {annotator && (
        <Button
          label="Toggle raw"
          onClick={() => {
            annotator.setMode(
              annotator.text.mode === "raw" ? "highlight" : "raw"
            );
            annotator.draw();
          }}
        />
      )}
    </div>
  );
};

export default TextAnnotator;
