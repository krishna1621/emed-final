import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: "#E9F8FF",
  color: "#053559",
  borderRadius: 0,
  height: "30px",
  cursor: "pointer",
  "& .MuiSelect-selectMenu": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: "inherit",
  },
}));
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#E9F8FF",
  color: "#053559",
  "&:hover": {
    backgroundColor: "#90B2D8",
    color: "#053559",
    textTransform: "inherit",
    transition: "1s",
  },
}));
export const Year = () => {
  const theme = useTheme();
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  let displayYear;
  if (currentMonth >= 10) {
    displayYear = currentYear + 1;
  } else {
    displayYear = currentYear;
  }
  const options = [];
  for (let year = 2016; year <= 2024; year++) {
    options.push({
      value: year,
      label: String(year),
    });
  }
  const defaultOption = options.find(
    (option) => option.label === String(displayYear)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    defaultOption ? defaultOption.value : ""
  );

  const handleOptionClick = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  };

  global.years = selectedYear;
  // console.log(global.years);
  const isSmOrMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const componentMargin = isSmOrMd ? 1 : 5;
  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ ml: componentMargin }}>
        <StyledSelect
          labelId="year-dropdown-label"
          id="year-dropdown"
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onOpen={() => setIsOpen(true)}
          value={selectedYear}
          onChange={(e) => handleOptionClick(e.target.value)}
          endAdornment={
            <InputAdornment sx={{ cursor: "pointer", marginLeft: "-20px" }} />
          }
        >
          {options.map((option) => (
            <StyledMenuItem
              key={option.value}
              value={option.value}
              theme={theme}
            >
              {option.label}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </form>
  );
};
