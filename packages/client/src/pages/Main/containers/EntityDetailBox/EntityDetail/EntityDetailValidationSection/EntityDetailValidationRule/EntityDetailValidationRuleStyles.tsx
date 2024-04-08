import styled from "styled-components";

export const StyledBorderLeft = styled.div`
  border-left: 2px solid;
  border-left-color: ${({ theme }) => theme.color["danger"]};
  padding-left: 1rem;
  padding-right: 2rem;
`;
export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1rem;
`;
export const StyledSentence = styled.p`
  margin-top: 0.1rem;
  font-size: ${({ theme }) => theme.fontSize["xs"]};
  color: ${({ theme }) => theme.color["danger"]};
  &:before: {
    content: '"';
  }
  &:after: {
    content: '"';
  }
`;
export const StyledSentenceEntity = styled.span`
  font-weight: bold;
`;

export const StyledLabel = styled.div`
  display: grid;
  text-align: right;
  align-items: start;
  margin-top: 0.2rem;
  color: ${({ theme }) => theme.color["info"]};
  font-size: ${({ theme }) => theme.fontSize["xs"]};
`;
export const StyledValue = styled.div`
  display: grid;
  align-items: center;
`;
export const StyledFlexList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
