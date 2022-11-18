import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const DropDown = ({
  data,
  value,
  setValue,
  width,
  height,
  borderRadius = "15px",
  padding = "6px 22px 6px 22px",
  fontSize,
  center = false,
}) => {
  const [dropdownopen, setDropDownOpen] = useState(false);

  const dialog = useRef();

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dialog && dialog.current && !dialog.current.contains(event.target)) {
        setDropDownOpen(false);
      }
    });
  }, []);

  return (
    <DropDownPanel
      onClick={() => setDropDownOpen(!dropdownopen)}
      active={dropdownopen}
      ref={dialog}
      ml={"15px"}
      width={width}
      height={height ?? 'auto'}
      borderRadius={borderRadius}
      padding={padding}
      fontSize={fontSize}
      center={center ? "center" : undefined}
    >
      <Box>{data[value]}</Box>
      <Box>{dropdownopen ? <AiFillCaretUp /> : <AiFillCaretDown />}</Box>
      <DropDownBody
        active={dropdownopen}
        width={width}
        borderRadius={borderRadius}
        padding={padding}
        fontSize={fontSize}
        center={center ? "center" : undefined}
      >
        {data.map((data, i) => {
          return (
            <Box
              key={i}
              onClick={() => {
                setValue(i);
              }}
            >
              {data}
            </Box>
          );
        })}
      </DropDownBody>
    </DropDownPanel>
  );
};

const DropDownBody = styled.div`
  position: absolute;
  left: 0px;
  max-width: ${({ width }) => width};
  min-width: ${({ width }) => width};
  > div {
    display: flex;
    align-items: center;
    justify-content: ${({ center }) => (center ? "center" : "unset")};
    padding: ${({ padding }) => padding};
    :hover {
      background: #91d257d1;
    }
  }
  background-image: linear-gradient(
    to top,
    #3e8940,
    #80ab46 60%,
    #e4de4f 95%,
    #ff6600 130%
  );
  border-bottom-left-radius: ${({ borderRadius }) => borderRadius};
  border-bottom-right-radius: ${({ borderRadius }) => borderRadius};
  overflow: hidden;
  height: ${({ active, height }) => (active ? height : "0")};
  z-index: 100;
`;

const DropDownPanel = styled(Box)`
  z-index: 100;
  background-image: linear-gradient(
    to bottom,
    #3e8940,
    #80ab46 60%,
    #e4de4f 95%,
    #ff6600 130%
  );
  border-top-left-radius: ${({ borderRadius }) => borderRadius}!important;
  border-top-right-radius: ${({ borderRadius }) => borderRadius}!important;
  border-bottom-left-radius: ${({ active, borderRadius }) =>
    active ? 0 : borderRadius}!important;
  border-bottom-right-radius: ${({ active, borderRadius }) =>
    active ? 0 : borderRadius}!important;
  max-width: ${({ width }) => width};
  min-width: ${({ width }) => width};
  max-height: ${({ height }) => height};
  min-height: ${({ height }) => height};
  padding: ${({ padding }) => padding};
  display: flex;
  align-items: center;
  justify-content: ${({ center }) => (center ? "center" : "unset")};
  font-weight: 600;
  font-size: ${({ fontSize }) => fontSize};
  color: white;
  cursor: pointer;
  position: relative;
  > div:nth-child(3) {
    top: ${({ height }) => height};
  }
`;

export default DropDown;
