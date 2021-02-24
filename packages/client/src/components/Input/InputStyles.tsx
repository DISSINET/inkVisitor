import styled from "styled-components";
import { space1, space2 } from "Theme/constants";

interface IValueStyle {
  inverted?: boolean;
}
export const Wrapper = styled.div`
  margin-top: ${space2};
  display: flex;
`;
export const Label = styled.span`
  text-align: right;
  margin-right: ${space2};
  vertical-align: top;
  font-weight: bold;
  display: flex;
  align-items: flex-end;
`;
export const StyledInput = styled.input<IValueStyle>`
  text-align: left;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors["white"] : theme.colors["primary"]};
  background-color: ${({ inverted, theme }) =>
    inverted ? theme.colors["primary"] : theme.colors["white"]};
  border-width: ${({ theme }) => theme.borderWidths[2]};
  border-color: ${({ theme }) => theme.colors["primary"]};
  font-size: ${({ theme }) => theme.fontSizes["xs"]};
  padding: ${space1};
  resize: none;
  :focus {
    outline: 0;
  }
`;
export const StyledSelect = styled.select<IValueStyle>`
  text-align: left;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors["white"] : theme.colors["primary"]};
  background-color: ${({ inverted, theme }) =>
    inverted ? theme.colors["primary"] : theme.colors["white"]};
  border-width: ${({ theme }) => theme.borderWidths[2]};
  border-color: ${({ theme }) => theme.colors["primary"]};
  font-size: ${({ theme }) => theme.fontSizes["xs"]};
  font-weight: bold;
  padding: ${space1};
  resize: none;
  :focus {
    outline: 0;
  }
`;
export const StyledTextArea = styled.textarea<IValueStyle>`
  text-align: left;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors["white"] : theme.colors["primary"]};
  background-color: ${({ inverted, theme }) =>
    inverted ? theme.colors["primary"] : theme.colors["white"]};
  border-width: ${({ theme }) => theme.borderWidths[2]};
  border-color: ${({ theme }) => theme.colors["primary"]};
  font-size: ${({ theme }) => theme.fontSizes["xs"]};
  padding: ${space1};
  resize: none;
  line-height: 1.2;
  :focus {
    outline: 0;
  }
`;
