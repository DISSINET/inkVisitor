import styled from "styled-components";

export const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  border-width: ${({ theme }) => theme.borderWidth[1]};
  border-style: solid;
  border-color: ${({ theme }) => theme.color["gray"][500]};
  box-shadow: ${({ theme }) => theme.boxShadow["subtle"]};
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

export const StyledTableHeader = styled.div`
  margin-bottom: 0.5rem;
  align-items: flex-end;
`;

interface StyledTr {
  opacity?: number;
}
export const StyledTr = styled.tr<StyledTr>`
  background-color: ${({ theme }) => theme.color["white"]};
  color: ${({ theme }) => theme.color["black"]};
  opacity: ${({ opacity }) => (opacity ? opacity : 1)};
  border-top: 1px solid ${({ theme }) => theme.color["gray"][500]};
  :hover {
    background-color: ${({ theme }) => theme.color["gray"][100]};
  }
`;
export const StyledTd = styled.td`
  padding: ${({ theme }) => theme.space[2]};
  padding-left: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.fontSize["sm"]};
`;
