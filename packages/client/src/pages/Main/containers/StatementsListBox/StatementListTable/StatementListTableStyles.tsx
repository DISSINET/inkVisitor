import { COLLAPSED_TABLE_WIDTH } from "Theme/constants";
import styled from "styled-components";

interface StyledTable {
  $contentWidth: number;
  $isListMode: boolean;
}
export const StyledTable = styled.table<StyledTable>`
  width: ${({ $contentWidth }) => $contentWidth};
  min-width: ${({}) => `${COLLAPSED_TABLE_WIDTH / 10}rem`};
  border-spacing: 0;
  border-collapse: collapse;
  border-width: ${({ theme }) => theme.borderWidth[1]};
  border-style: solid;
  border-color: ${({ theme }) => theme.color["gray"][500]};
  box-shadow: ${({ theme }) => theme.boxShadow["subtle"]};
  overflow-x: ${({ $isListMode }) => ($isListMode ? "auto" : "hidden")};
  transition: width 0.3s ease;
`;
export const StyledTHead = styled.thead`
  border-width: ${({ theme }) => theme.borderWidth[1]};
  border-style: solid;
  border-color: ${({ theme }) => theme.color["gray"][500]};
  background: ${({ theme }) => theme.color["gray"][100]};
  color: ${({ theme }) => theme.color["gray"][700]};
  font-size: ${({ theme }) => theme.fontSize["sm"]};
`;
export const StyledTh = styled.th`
  text-align: left;
  padding-right: ${({ theme }) => theme.space[2]};
  padding-left: ${({ theme }) => theme.space[2]};
  font-weight: normal;
`;

interface StyledTr {
  $isOpened?: boolean;
  $isSelected?: boolean;
  opacity?: number;
}
export const StyledTr = styled.tr<StyledTr>`
  height: ${({ theme }) => theme.space[16]};
  background-color: ${({ theme, $isOpened, $isSelected }) =>
    $isOpened
      ? theme.color["tableOpened"]
      : $isSelected
      ? theme.color["tableSelection"]
      : theme.color["white"]};
  color: ${({ theme, $isOpened }) =>
    $isOpened ? theme.color["primary"] : theme.color["black"]};
  opacity: ${({ opacity }) => (opacity ? opacity : 1)};
  border-top: 1px solid ${({ theme }) => theme.color["gray"][500]};
  border-left: ${({ theme, $isOpened }) =>
    $isOpened ? "4px solid " + theme.color["success"] : ""};
  cursor: ${({ $isOpened }) => ($isOpened ? "default" : "pointer")};
  td:first-child {
    padding-left: ${({ theme, $isOpened }) => ($isOpened ? "0.9rem" : "")};
    width: 1%;
  }
  td:last-child {
    padding-right: ${({ theme }) => theme.space[4]};
  }
  &:hover {
    background-color: ${({ theme, $isSelected }) =>
      $isSelected
        ? theme.color["tableSelectionHover"]
        : theme.color["gray"][100]};
  }
`;

interface StyledTd {}
export const StyledTd = styled.td<StyledTd>`
  padding: ${({ theme }) => theme.space[2]};
  padding-left: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.fontSize["sm"]};
  height: ${({ theme }) => theme.space[16]};
`;

export const StyledTdMove = styled.td`
  cursor: move;
  width: 1%;
`;

interface StyledFocusedCircle {
  checked: boolean;
}
export const StyledFocusedCircle = styled.span<StyledFocusedCircle>`
  position: absolute;
  background-color: ${({ theme }) => theme.color.focusedCheckbox};
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.color.focusedCheckbox};
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
`;
export const StyledCheckboxWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.color["black"]};
  cursor: pointer;
`;

export const StyledAbbreviatedLabel = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  min-width: 5rem;
  font-size: ${({ theme }) => theme.fontSize["xs"]};
`;
