import styled from "styled-components";
import Popup from "reactjs-popup";
import { Colors } from "types";

interface StyledPopup {
  color: typeof Colors[number];
}
export const StyledPopup = styled(Popup)<StyledPopup>`
  &-content {
    color: ${({ theme }) => theme.color["white"]};
    background-color: ${({ theme, color }) => theme.color[color]};
    min-width: ${({ theme }) => theme.space[8]};
    font-size: ${({ theme }) => theme.fontSize["xxs"]};

    border-radius: ${({ theme }) => theme.borderRadius["sm"]};

    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 40rem;
  }
  &-arrow {
    color: ${({ theme, color }) => theme.color[color]};
  }
  [role="tooltip"]&-content {
  }
  &-overlay {
  }
  [data-popup="tooltip"]&-overlay {
  }
`;

interface StyledContentWrap {
  tagGroup?: boolean;
}
export const StyledContentWrap = styled.div<StyledContentWrap>`
  margin: ${({ theme, tagGroup }) =>
    `${theme.space[2]} ${tagGroup ? theme.space[2] : theme.space[3]}`};
`;

export const StyledRow = styled.div`
  display: flex;
`;
export const StyledLabel = styled.p`
  max-width: 35rem;
  font-weight: ${({ theme }) => theme.fontWeight["bold"]};
  word-wrap: break-word;
`;
