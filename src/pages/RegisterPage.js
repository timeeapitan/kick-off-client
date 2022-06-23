import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/system";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Button,
  Container,
  FormControl,
  Input,
  InputLabel,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import validator from "validator";
import MainLayout from "../components/MainLayout";
import { registerUser } from "../service/Service";
import { useEffect } from "react";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    "& > :not(style)": {
      m: 1,
      width: 500,
      height: 630,
      marginTop: 30,
    },
    marginBottom: 150,
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
    marginBottom: 50,
  },
});

const RegisterPage = () => {
  const classes = useStyles();
  const formRef = useRef();

  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
    confirmedPassword: "",
    showConfirmedPassword: false,
    fullName: "",
    username: "",
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [validation, setValidation] = useState(null);
  const [show, setShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  useEffect(() => {
    const timeId = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [show]);

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

  const handleClickShowConfirmedPassword = () => {
    setValues({
      ...values,
      showConfirmedPassword: !values.showConfirmedPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleFullNameChange = (event) => {
    setValues({ ...values, fullName: event.target.value });
    let insertedValue = event.target.value.split(" ");
    console.log(insertedValue);

    if (insertedValue.length > 2) {
      setFirstName(insertedValue[0] + " " + insertedValue[1]);
      setLastName(insertedValue[2]);
    } else {
      setFirstName(insertedValue[0]);
      setLastName(insertedValue[1]);
    }
  };

  const register = async (event) => {
    event.preventDefault();

    formRef.current.reportValidity();
    if (values.password === values.confirmedPassword) {
      console.log(validateEmail(values.email));
      if (validateEmail(values.email)) {
        const response = await registerUser(
          firstName,
          lastName,
          values.email,
          values.username,
          values.password
        );

        setValues({
          email: "",
          password: "",
          confirmedPassword: "",
          fullName: "",
          username: "",
        });
        setFirstName("");
        setLastName("");
        setSeverity("success");
        setAlertMessage("Registered successfully!");
        setShow(true);
      } else {
        setSeverity("error");
        setAlertMessage("Incorrect email format!");
        setShow(true);
      }
    }
  };

  function validateEmail(email) {
    if (validator.isEmail(email)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <MainLayout>
      <Box className={classes.box}>
        <Paper style={{ borderRadius: 15 }}>
          <Container className={classes.loginContainer}>
            <form ref={formRef}>
              <Grid container spacing={10}>
                <Grid item>
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
                    Register
                  </Typography>
                </Grid>
                {show && (
                  <Grid item>
                    <Alert severity={severity}>{alertMessage}</Alert>
                  </Grid>
                )}
              </Grid>
              <FormControl
                style={{ width: "100%", margin: "20px 0px" }}
                sx={{ m: 1, width: "25ch" }}
                variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Full name
                </InputLabel>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={values.fullName}
                  onChange={handleFullNameChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonOutlineIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl
                style={{ width: "100%", margin: "20px 0px" }}
                sx={{ m: 1, width: "25ch" }}
                variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Email
                </InputLabel>
                <Input
                  type="text"
                  placeholder="Enter your email"
                  required
                  value={values.email}
                  onChange={handleChange("email")}
                  startAdornment={
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl
                style={{ width: "100%", margin: "20px 0px" }}
                sx={{ m: 1, width: "25ch" }}
                variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Username
                </InputLabel>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  required
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
                  required
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
              <FormControl
                style={{ width: "100%", margin: "20px 0px" }}
                sx={{ m: 1, width: "25ch" }}
                variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Confirm password
                </InputLabel>
                <Input
                  type={values.showConfirmedPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  value={values.confirmedPassword}
                  onChange={handleChange("confirmedPassword")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmedPassword}
                        onMouseDown={handleMouseDownPassword}>
                        {values.showConfirmedPassword ? (
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
                  marginTop: 20,
                  textTransform: "none",
                  fontSize: 17,
                  color: "white",
                }}
                size="large"
                onClick={register}>
                Register now
              </Button>
            </form>
            <Container
              style={{
                marginTop: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Typography variant="h7" style={{ marginRight: 10 }}>
                Already a member?
              </Typography>
              <Link
                onClick={() => history.push("/login")}
                underline="hover"
                style={{ cursor: "pointer" }}>
                {"Sign in"}
              </Link>
            </Container>
          </Container>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default RegisterPage;
