import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [passwordReminded, setPasswordReminded] = useState(false);
  const [otp, setOtp] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpError, setOtpError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsEmailValid(true);
    setErrorMessage("");
  };
  global.emails = email;
  console.log(global.emails);
  async function handleRemindPasswordClick(e) {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setIsEmailValid(false);
      return;
    }
  
    try {
      let result = await fetch(`/forgot-password?email=${global.emails}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
        },
      });
  
      // Check if the response is a redirect (status code 304)
      if (result.redirected) {
        // Follow the redirect manually
        result = await fetch(result.url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
          },
        });
      }
  
      if (!result.ok) {
        throw new Error(`Error: ${result.status} - ${result.statusText}`);
      }
  
      result = await result.json();
  
      console.log(result);
  
      let result1 = await fetch(`get-otp?email=${global.emails}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
        },
      });
  
      if (!result1.ok) {
        throw new Error(`Error: ${result1.status} - ${result1.statusText}`);
      }
  
      result1 = await result1.json();
  
      global.otps = result1;
      console.log(global.otps);
  
      setPasswordReminded(true);
    } catch (error) {
      console.error("Error during fetch:", error.message);
  
      // Handle the error appropriately in your frontend
      // For example, set an error state or display a message to the user
      setErrorMessage("An error occurred during the password reminder process.");
    }
  }
  
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  async function handleVerifyOTPClick(e) {
    console.log(otp);

    if (!otp) {
      setOtpError("Please fill in the Enter OTP field.");
      return;
    }

    const otpsAsString = String(global.otps);

    let result = await fetch(`verify-otp?otp=${otp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    });

    console.log(result);

    const trimmedOTP = String(otp).trim();
    const trimmedGlobalOTPS = otpsAsString.trim();

    if (trimmedOTP === trimmedGlobalOTPS) {
      setOtp("");
      setShowChangePassword(true);
      setOtpError("");
    } else {
      setOtpError("Incorrect OTP");
      // console.log("Incorrect OTP");
    }
  }

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  async function handleChangePasswordClick(e) {
    // console.log(newPassword);
    if (!newPassword) {
      setNewPasswordError("Please fill in the new password.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setNewPasswordError(
        "Password must have at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return;
    }

    // console.log(result);
    setPasswordChanged(true);
  }
  const handleGoToHomePage = () => {
    navigate("/");
  };
  return (
    <ThemeProvider theme={createTheme()}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          mt: "7%",
        }}
      >
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box component="form" sx={{ mt: 1 }}>
            <h5>Please enter your email address to search for your account.</h5>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Enter your Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleEmailChange}
              value={email}
            />{" "}
            {!isEmailValid && (
              <Typography variant="body2" color="error">
                Please enter a valid email address.
              </Typography>
            )}
            {errorMessage && (
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            )}
            {!passwordReminded && (
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleRemindPasswordClick}
              >
                Get OTP
              </Button>
            )}
            {passwordReminded && !showChangePassword && (
              <div>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="otp"
                  label="Enter OTP"
                  name="otp"
                  autoComplete="off"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />{" "}
                {otpError && (
                  <Typography variant="body2" color="error">
                    {otpError}
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleVerifyOTPClick}
                >
                  Verify OTP
                </Button>{" "}
              </div>
            )}
            {showChangePassword && !passwordChanged && (
              <div>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="newPassword"
                  label="New Password"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {newPassword.length > 0 && (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
                {newPasswordError && (
                  <Typography variant="body2" color="error">
                    {newPasswordError}
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleChangePasswordClick}
                >
                  Change Password
                </Button>
              </div>
            )}
            {passwordChanged && (
              <div className="text-success">
                "Password Reset Successfully! Your account is now secure and
                ready for use."
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleGoToHomePage}
                >
                  Go to Sign In Page
                </Button>
              </div>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
export default ForgetPassword;
