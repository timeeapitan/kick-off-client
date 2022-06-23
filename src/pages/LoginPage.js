import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/system";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Button,
  Container,
  FormControl,
  Input,
  InputLabel,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import AuthenticationService from "../service/AuthenticationService";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

import { loginUser } from "../service/Service";
import { loginUserWithToken } from "../service/Service";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    "& > :not(style)": {
      m: 1,
      width: 500,
      height: 450,
      marginTop: 30,
    },
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
  text: {
    fontWeight: 600,
    marginTop: 40,
  },

  loginContainer: {
    marginTop: 30,
  },
});

const LoginPage = () => {
  const classes = useStyles();

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
    username: "",
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hasLoginFailed, setHasLoginFailed] = useState(false);

  const history = useHistory();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // const onClickLogin = async (event) => {
  //   event.preventDefault();

  // const response =
  //   await AuthenticationService.executeBasicAuthenticationService(
  //     values.email,
  //     values.password
  //   )
  //     .then(() => {
  //       //   console.log("CACAT");
  //       //   loginUser(values.email, values.password);
  //       //   history.push("/about");
  //       //   setValues({ password: "", email: "" });
  //       AuthenticationService.registerSuccessfulLogin(
  //         values.email,
  //         values.password
  //       );
  //       history.push("/about");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setShowSuccessMessage(false);
  //       setHasLoginFailed(true);
  //     });

  // console.log("This is the response: " + response);
  // };

  const onClickLogin = async (event) => {
    event.preventDefault();
    const response = await loginUser(values.username, values.password);
    history.push("/about");
    console.log(response);
  };

  return (
    <MainLayout>
      <Box className={classes.box}>
        <Paper style={{ borderRadius: 15 }}>
          <Container className={classes.loginContainer}>
            <form>
              <Typography
                variant="h4"
                style={{
                  fontWeight: "bold",
                  textDecorationWidth: 5,
                  "&::before": {
                    content: "",
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 3,
                    width: 30,
                    backgroundColor: "#f44040",
                    borderRadius: 25,
                  },
                }}>
                Login
              </Typography>
              <FormControl
                style={{ width: "100%", margin: "20px 0px" }}
                sx={{ m: 1, width: "25ch" }}
                variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Username
                </InputLabel>
                <Input
                  type="text"
                  placeholder="Enter your email"
                  value={values.username}
                  onChange={handleChange("username")}
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonOutlineRoundedIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl
                style={{ width: "100%", margin: "20px 0px" }}
                sx={{ m: 1, width: "25ch" }}
                variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  type={values.showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}>
                        {values.showPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <HttpsOutlinedIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Button
                variant="contained"
                disableElevation
                fullWidth
                type="submit"
                style={{
                  marginTop: 80,
                  textTransform: "none",
                  fontSize: 17,
                  color: "white",
                }}
                size="large"
                onClick={onClickLogin}>
                Login now
              </Button>
            </form>
            <Container
              style={{
                marginTop: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Typography variant="h7" style={{ marginRight: 10 }}>
                Not a member?
              </Typography>
              <Link
                onClick={() => history.push("/register")}
                underline="hover"
                style={{ cursor: "pointer" }}>
                {"Sign up now"}
              </Link>
            </Container>
          </Container>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default LoginPage;