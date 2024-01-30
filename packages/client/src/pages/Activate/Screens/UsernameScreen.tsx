import api from "api";
import { Button, Input, ModalInputWrap } from "components";
import {
  StyledButtonWrap,
  StyledDescription,
  StyledErrorText,
  StyledInputRow,
  StyledMail,
} from "pages/PasswordReset/PasswordResetPageStyles";
import React, { useState } from "react";
import { FaUserTag } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { TbMailFilled } from "react-icons/tb";
import { useNavigate } from "react-router";
import {
  StyledFaTag,
  StyledUserActivatedDescription,
} from "./ActivateSreensStyles";

const USERNAME_ALREADY_USED_ERROR = `Username is already used. 
Please select a new one`;
const USERNAME_TOO_SHORT_ERROR = `Username is too short.
Please select a new one`;
const USERNAME_TOO_LONG_ERROR = `Username is too long.
Please select a new one`;

interface UsernameScreen {
  hash: string;
  email: string;
  password: string;
  passwordRepeat: string;
}
export const UsernameScreen: React.FC<UsernameScreen> = ({
  hash,
  email,
  password,
  passwordRepeat,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState<false | string>(false);
  const [continueScreen, setContinueScreen] = useState(false);
  const [username, setUsername] = useState("");

  const handleActivation = () => {
    if (username.length < 4) {
      setError(USERNAME_TOO_SHORT_ERROR);
    } else if (username.length > 10) {
      setError(USERNAME_TOO_LONG_ERROR);
    } else {
      try {
        const res: any = api
          .activation(hash, password, passwordRepeat, username)
          .then((res) => {
            if (res.status === 200) {
              setContinueScreen(true);
            }
          });
      } catch (err) {
        if (err && (err as any).error === "UserNotUnique") {
          setError(USERNAME_ALREADY_USED_ERROR);
        }
      }
    }
  };

  const handleLogin = () => {
    try {
      api.signIn(username, password).then((res) => {
        navigate("/");
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!continueScreen ? (
        <>
          <p>Choose username for user</p>
          <StyledMail>
            <TbMailFilled size={14} style={{ marginRight: "0.5rem" }} />
            {email}
          </StyledMail>
          <StyledDescription>
            The username has to be unique and <br />
            between 4 and 10 characters long.
          </StyledDescription>
          <ModalInputWrap>
            <StyledInputRow>
              <StyledFaTag size={14} $isError={error !== false} />
              <Input
                placeholder="username"
                onChangeFn={(text: string) => setUsername(text)}
                value={username}
                changeOnType
                autoFocus
                required
                borderColor={error !== false ? "danger" : "primary"}
              />
            </StyledInputRow>
          </ModalInputWrap>
          {error !== false && <StyledErrorText>{error}</StyledErrorText>}
          <StyledButtonWrap>
            <Button
              disabled={username.length < 2}
              icon={<FaUserTag />}
              label="Set username"
              color="success"
              onClick={handleActivation}
            />
          </StyledButtonWrap>
        </>
      ) : (
        <>
          <p>User</p>
          <StyledMail>
            <span style={{ width: "100%" }}>
              <FaUserTag size={14} style={{ marginRight: "0.5rem" }} />
            </span>
            {username}
          </StyledMail>
          <StyledUserActivatedDescription style={{ marginBottom: "2rem" }}>
            has been activated.
          </StyledUserActivatedDescription>
          <StyledUserActivatedDescription style={{ marginBottom: "1rem" }}>
            We wish you happy coding.
          </StyledUserActivatedDescription>
          <StyledButtonWrap>
            <Button
              icon={<FiLogIn />}
              label="login continue"
              color="success"
              onClick={handleLogin}
            />
          </StyledButtonWrap>
        </>
      )}
    </>
  );
};
