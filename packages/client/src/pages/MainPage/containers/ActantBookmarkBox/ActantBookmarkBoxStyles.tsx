import styled from "styled-components";

export const StyledContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

export const StyledHeader = styled.div`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

export const StyledFolderList = styled.div`
  width: 100%;
`;
export const StyledFolderWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.space[2]};
  width: 100%;
`;
export const StyledFolderHeader = styled.div`
  cursor: pointer;
  width: 100%;
  height: ${({ theme }) => theme.space[14]};
  display: inline-block;
  background-color: ${({ theme }) => theme.color["gray"][400]};
  padding: ${({ theme }) => theme.space[3]};
`;
export const StyledFolderHeaderText = styled.span`
  vertical-align: text-bottom;
  font-weight: ${({ theme }) => theme.fontWeight["medium"]};
  margin-left: ${({ theme }) => theme.space[2]};
  max-width: calc(100% - 5em);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const StyledFolderHeaderButtons = styled.div`
  display: inline-block;
  float: right;
  align-items: start;
`;
export const StyledFolderContent = styled.div``;
