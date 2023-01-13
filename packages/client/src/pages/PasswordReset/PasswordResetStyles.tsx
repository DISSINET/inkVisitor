import { FaLock } from "react-icons/fa";
import styled from "styled-components";

export const StyledButtonWrap = styled.div``;

export const StyledContent = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const StyledBoxWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 3rem;
`;
export const StyledHeading = styled.h5`
  color: ${({ theme }) => theme.color["primary"]};
  font-weight: ${({ theme }) => theme.fontWeight["normal"]};
  margin-bottom: 1.5rem;
`;
export const StyledInputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid;
  border-bottom-color: ${({ theme }) => theme.color["gray"][400]};
  margin-bottom: 1rem;
`;
export const StyledFaLock = styled(FaLock)`
  margin-right: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.color["primary"]};
`;
export const StyledDescription = styled.div`
  color: ${({ theme }) => theme.color["primary"]};
  font-weight: ${({ theme }) => theme.fontWeight["normal"]};
  font-size: ${({ theme }) => theme.fontSize["sm"]};
  margin-bottom: 0.5rem;
`;