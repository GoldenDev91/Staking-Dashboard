import React from "react";
import styled from "styled-components";

const Button = ({
  width,
  height,
  type,
  fontSize = "16px",
  children,
  disabled,
  onClick,
  style,
}) => {
  return (
    <>
      {type === "plus" ? (
        <PlusButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
        >
          {children}
        </PlusButton>
      ) : (
        ""
      )}
      {type === "minus" ? (
        <MinusButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
        >
          {children}
        </MinusButton>
      ) : (
        ""
      )}
      {type === "primary" ? (
        <PrimaryButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
        >
          {children}
        </PrimaryButton>
      ) : (
        ""
      )}
      {type === "secondary" ? (
        <SecondaryButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
        >
          {children}
        </SecondaryButton>
      ) : (
        ""
      )}
      {type === "max" ? (
        <MaxButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
        >
          {children}
        </MaxButton>
      ) : (
        ""
      )}
      {type === "connect" ? (
        <ConnectButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
        >
          {children}
        </ConnectButton>
      ) : (
        ""
      )}
    </>
  );
};

const BaseButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins";
  font-size: ${({ fontSize }) => fontSize};
  font-weight: bold;
  max-width: ${({ width }) => width};
  max-height: ${({ height }) => height};
  min-width: ${({ width }) => width};
  min-height: ${({ height }) => height};
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  transition: all 0.3s;
  :disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PlusButton = styled(BaseButton)`
  background: #ebebeb;
  color: #010215;
  border: 1px solid #ebebeb;
  border-radius: 50%;
  line-height: 0px;
  :hover:not([disabled]) {
    background: #ff626e;
    color: white;
    border: #ff626e;
  }
`;

const MinusButton = styled(BaseButton)`
  background: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 50%;
  :hover:not([disabled]) {
    background: #ff626e;
    color: white;
    border: #ff626e;
  }
`;
const PrimaryButton = styled(BaseButton)`
  font-size: 15px;
  border-radius: 10px;
  background-image: linear-gradient(150deg, #57048a 0%, #0047ff 78%);
`;
const SecondaryButton = styled(BaseButton)`
  font-weight: 500;
  background-color: #2c2f4c;
  color: white !important;
  border: 0;
  border-radius: 10px;
  :hover:not([disabled]) {
    background: #0047ff;
  }
`;

const MaxButton = styled(BaseButton)`
  background: #2c2f4c;
  color: white;
  font-size: 16px;
  font-weight: 400;
`;

const ConnectButton = styled(BaseButton)`
  background: transparent none repeat scroll 0 0;
  border: 2px solid #fff;
  color: white;
  border-radius: 100px;
  ::after {
    position: absolute;
    content: "";
    height: calc(100% + 4px);
    width: calc(100% + 4px);
    background-image: linear-gradient(135deg, #0047ff 10%, #57048a);
    top: -2px;
    left: -2px;
    border-radius: 100px;
    opacity: 0;
    transition: all 0.3s ease 0s;
    z-index: -1;
  }
  :hover:not([disabled]) {
    border-color: transparent;
    ::after {
      opacity: 1;
    }
  }
`;
export default Button;
