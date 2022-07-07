import Button from "@material-ui/core/Button";
import { AccountCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CakeIcon from "@mui/icons-material/Cake";
import CheckIcon from "@mui/icons-material/Check";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import SaveIcon from "@mui/icons-material/Save";
import ScaleIcon from "@mui/icons-material/Scale";
import StraightenIcon from "@mui/icons-material/Straighten";
import {
  Avatar,
  Box,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import validator from "validator";
import MainLayout from "../components/MainLayout";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: 70,
  },
  box: {
    height: 50,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    margin: 0,
  },
});

const ProfilePage = () => {
  const classes = useStyles();

  const token = sessionStorage.getItem("token");
  const [userId, setUserId] = useState(null);
  const URL = "http://127.0.0.1:8887/profile_pictures/";

  const [fullName, setFullName] = useState(sessionStorage.getItem("fullName"));
  const [uploadImage, setUploadImage] = useState(false);
  const [fakePictureSrc, setFakePictureSrc] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [username, setUsername] = useState(sessionStorage.getItem("username"));
  const [pictureId, setPictureId] = useState(null);
  const [refreshUploadImage, setRefreshUploadImage] = useState(false);
  const [refreshUpdateImage, setRefreshUpdateImage] = useState(false);
  const [bodyStructure, setBodyStructure] = useState("");
  const [position, setPosition] = useState("");
  const [existsBodyStructure, setExistsBodyStructure] = useState(false);
  const [existsPosition, setExistsPosition] = useState(false);
  const [existsImage, setExistsImage] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [emailValidation, setEmailValidation] = useState(true);
  const [phoneValidation, setPhoneValidation] = useState(true);
  const [outlinedValuesFoot, setOutlinedValuesFoot] = useState({
    left: false,
    right: false,
    both: false,
  });
  const [outlinedValuesPosition, setOutlinedValuesPosition] = useState({
    gk: false,
    df: false,
    md: false,
    at: false,
  });

  useEffect(() => {
    getUser();
  }, [existsBodyStructure, existsPosition, existsImage]);

  useEffect(() => {
    if (userId != null) {
      handleGetImage();
    }
  }, [userId, refreshUploadImage, refreshUpdateImage]);

  useEffect(() => {
    if (userId != null) {
      handleGetBodyStructure();
    }
  }, [userId]);

  useEffect(() => {
    if (userId != null) {
      handleGetPosition();
    }
  }, [userId]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 1500);

    return () => {
      clearTimeout(timeId);
    };
  }, [showSuccessMessage]);

  const getUser = async () => {
    await axios
      .get(
        "http://localhost:8080/user/getUserByUsername?username=" + username,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setCurrentUser(response.data);
        setUserId(response.data.id);
        setPictureId(response.data.pictureSrc.id);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleGetImage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/user/getProfilePicture?id=" + userId,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setFakePictureSrc(response.data);
      setUploadImage(true);
      if (fakePictureSrc === "") {
        setExistsImage(false);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const handleUploadImage = async (event) => {
    let fakeSrcPath = event.target.value;
    let pathArray = fakeSrcPath.split("\\");
    let fakePictureSrcForUser = URL + pathArray.slice(-1)[0];
    setFakePictureSrc(fakePictureSrcForUser);

    return axios
      .post(
        "http://localhost:8080/user/uploadPicture",
        {
          id: userId,
          src: fakePictureSrcForUser,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log("image uploaded");
        setRefreshUploadImage(true);
        setRefreshUpdateImage(!refreshUpdateImage);
      });
  };

  const handleUpdateImageInUserTable = (fakePictureSrcForUser) => {
    return axios.put(
      "http://localhost:8080/user/updateTableProfilePicture",
      {
        id: userId,
        src: fakePictureSrcForUser,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };

  const handleUpdateImage = async (event) => {
    let fakeSrcPath = event.target.value;
    let pathArray = fakeSrcPath.split("\\");
    let fakePictureSrcForUser = URL + pathArray.slice(-1)[0];
    setFakePictureSrc(fakePictureSrcForUser);

    return axios
      .put(
        "http://localhost:8080/user/updatePicture",
        {
          id: userId,
          src: fakePictureSrcForUser,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log("image updated");
        setRefreshUpdateImage(!refreshUpdateImage);
      });
  };

  const handleUpdateUser = async () => {
    console.log("the user to be updated:");
    console.log(currentUser);
    await axios
      .put(
        "http://localhost:8080/user/updateUser",
        { id: userId, user: currentUser },
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        console.log(response.data);
        console.log(currentUser);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleGetBodyStructure = async () => {
    await axios
      .get(
        "http://localhost:8080/body-structure/get-body-structure?id=" + userId,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log("this is body structure");
        console.log(response.data);
        setBodyStructure(response.data);
        if (response.data.id != -1) {
          setExistsBodyStructure(true);
        }
        if (response.data.foot === "left") {
          setOutlinedValuesFoot({ ...outlinedValuesFoot, left: true });
        } else if (response.data.foot === "right") {
          setOutlinedValuesFoot({ ...outlinedValuesFoot, right: true });
        } else if (response.data.foot === "both") {
          setOutlinedValuesFoot({ ...outlinedValuesFoot, both: true });
        }
        console.log(outlinedValuesFoot);
      });
  };

  const handleSaveBodyStructure = async () => {
    await axios
      .post(
        "http://localhost:8080/user/saveBodyStructure",
        {
          id: userId,
          bodyStructure: bodyStructure,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        console.log(response);
        console.log(bodyStructure);
        console.log("body structure saved!");
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleUpdateBodyStructure = async () => {
    await axios
      .put(
        "http://localhost:8080/user/updateBodyStructure",
        { id: userId, bodyStructure: bodyStructure },
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        console.log(bodyStructure);
        console.log("body structure updated!");
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleGetPosition = async () => {
    await axios
      .get("http://localhost:8080/position/get-position?id=" + userId, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log("this is the position:");
        console.log(response.data);
        setPosition(response.data);
        if (response.data.id != -1) {
          setExistsPosition(true);
        }

        if (response.data.attacker === 1) {
          setOutlinedValuesPosition({ ...outlinedValuesFoot, at: true });
        }

        if (response.data.defender === 1) {
          setOutlinedValuesPosition({ ...outlinedValuesFoot, df: true });
        }

        if (response.data.goalkeeper === 1) {
          setOutlinedValuesPosition({ ...outlinedValuesFoot, gk: true });
        }

        if (response.data.midfielder === 1) {
          setOutlinedValuesPosition({ ...outlinedValuesFoot, md: true });
        }
      });
  };

  const handleSavePosition = async () => {
    await axios
      .post(
        "http://localhost:8080/user/savePosition",
        {
          id: userId,
          position: position,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        console.log(position);
        handleUpdateTablePosition(position);
        console.log("position saved!");
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleUpdatePosition = async () => {
    await axios
      .put(
        "http://localhost:8080/user/updatePosition",
        {
          id: userId,
          position: position,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        console.log(position);
        console.log("position updated!");
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleUpdateTablePosition = (position) => {
    return axios.put(
      "http://localhost:8080/user/updateTablePosition",
      {
        id: userId,
        position: position,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };

  const saveChanges = async () => {
    console.log(existsBodyStructure);
    console.log(existsPosition);

    if (!existsImage) {
      handleUploadImage();
    } else {
      handleUpdateImage();
    }

    if (validateEmail(currentUser.email)) {
      setEmailValidation(true);
      if (validatePhone(currentUser.phone)) {
        setPhoneValidation(true);
        handleUpdateUser();
      } else {
        setPhoneValidation(false);
      }
    } else {
      setEmailValidation(false);
    }

    if (existsBodyStructure === false) {
      handleSaveBodyStructure();
    } else {
      handleUpdateBodyStructure();
    }

    if (!existsPosition) {
      handleSavePosition();
    } else {
      handleUpdatePosition();
      console.log("does body structure exist?");
      console.log(existsBodyStructure);
    }

    handleUpdateTablePosition(position);
    handleUpdateImageInUserTable(fakePictureSrc);
    setShowSuccessMessage(true);
  };

  const Input = styled("input")({
    display: "none",
  });

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: "#89CFF0",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  function validateEmail(email) {
    return validator.isEmail(email);
  }

  function validatePhone(phone) {
    return validator.isMobilePhone(phone);
  }

  return (
    <MainLayout>
      <Container className={classes.container}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center">
          <Grid item xs={12}>
            {uploadImage && (
              <Avatar
                src={currentUser.tablePictureSrc}
                sx={{ width: 170, height: 170 }}
              />
            )}
            {!uploadImage && (
              <Avatar
                {...stringAvatar(fullName)}
                sx={{ width: 200, height: 200 }}
              />
            )}
            <label htmlFor="icon-button-file">
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={
                  pictureId === null ? handleUploadImage : handleUpdateImage
                }
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span">
                <AddPhotoAlternateIcon />
              </IconButton>
            </label>
          </Grid>
        </Grid>
        <Grid container spacing={12}>
          <Grid item xs={12} md={4} lg={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                margin: "7px 0px",
              }}>
              <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                placeholder="Username"
                value={currentUser.username}
                variant="standard"
                fullWidth
                onChange={(event) => {
                  setCurrentUser({
                    ...currentUser,
                    username: event.target.value,
                  });
                  console.log(currentUser.username);
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                margin: "7px 0px",
              }}>
              <PersonIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                placeholder="First name"
                value={currentUser.firstName}
                variant="standard"
                fullWidth
                onChange={(event) => {
                  setCurrentUser({
                    ...currentUser,
                    firstName: event.target.value,
                  });
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                margin: "7px 0px",
              }}>
              <PersonIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                placeholder="Last Name"
                value={currentUser.lastName}
                variant="standard"
                fullWidth
                onChange={(event) => {
                  setCurrentUser({
                    ...currentUser,
                    lastName: event.target.value,
                  });
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                margin: "7px 0px",
              }}>
              <EmailIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                placeholder="Email"
                value={currentUser.email}
                variant="standard"
                fullWidth
                onChange={(event) => {
                  setCurrentUser({ ...currentUser, email: event.target.value });
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                margin: "7px 0px",
              }}>
              <PhoneIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                placeholder="Phone"
                value={currentUser.phone}
                variant="standard"
                fullWidth
                onChange={(event) => {
                  setCurrentUser({ ...currentUser, phone: event.target.value });
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                margin: "7px 0px",
              }}>
              <CakeIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  openTo="year"
                  placeholder="Birthday"
                  views={["year", "month", "day"]}
                  inputFormat="dd/MM/yyyy"
                  value={currentUser.dateOfBirth}
                  onChange={(newBirthday) => {
                    setCurrentUser({
                      ...currentUser,
                      dateOfBirth: newBirthday,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField variant="standard" fullWidth {...params} />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                margin: "7px 0px",
              }}>
              <PublicIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                placeholder="Country"
                value={currentUser.country}
                variant="standard"
                fullWidth
                onChange={(event) => {
                  setCurrentUser({
                    ...currentUser,
                    country: event.target.value,
                  });
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                margin: "7px 0px",
              }}>
              <StraightenIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                placeholder="Height (cm)"
                value={bodyStructure.height}
                variant="standard"
                fullWidth
                onChange={(event) => {
                  setBodyStructure({
                    ...bodyStructure,
                    height: event.target.value,
                  });
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                margin: "7px 0px",
              }}>
              <ScaleIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                placeholder="Weight (kg)"
                value={bodyStructure.weight}
                variant="standard"
                fullWidth
                onChange={(event) => {
                  setBodyStructure({
                    ...bodyStructure,
                    weight: event.target.value,
                  });
                }}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ margin: 30 }}>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            direction="column"
            justifyContent="center">
            <Grid
              item
              container
              direction="column"
              justifyContent="center"
              alignItems="center">
              <Typography variant="h7" style={{ fontWeight: "bold" }}>
                FOOT
              </Typography>
            </Grid>
            <Button
              style={{ border: "1px solid rgba(24, 117, 208, 1)", margin: 10 }}
              variant={outlinedValuesFoot.left ? "contained" : "outlined"}
              onClick={(event) => {
                setOutlinedValuesFoot({
                  left: !outlinedValuesFoot.left,
                  right: false,
                  both: false,
                });

                setBodyStructure({
                  ...bodyStructure,
                  foot: "left",
                });
              }}>
              LEFT
            </Button>
            <Button
              style={{ border: "1px solid rgba(24, 117, 208, 1)", margin: 10 }}
              variant={outlinedValuesFoot.right ? "contained" : "outlined"}
              onClick={(event) => {
                setOutlinedValuesFoot({
                  left: false,
                  right: !outlinedValuesFoot.right,
                  both: false,
                });

                setBodyStructure({
                  ...bodyStructure,
                  foot: "right",
                });
              }}>
              RIGHT
            </Button>
            <Button
              style={{ border: "1px solid rgba(24, 117, 208, 1)", margin: 10 }}
              variant={outlinedValuesFoot.both ? "contained" : "outlined"}
              onClick={(event) => {
                setOutlinedValuesFoot({
                  left: false,
                  right: false,
                  both: !outlinedValuesFoot.both,
                });

                setBodyStructure({
                  ...bodyStructure,
                  foot: "both",
                });
              }}>
              BOTH
            </Button>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Grid
              item
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              style={{ marginTop: 10 }}>
              <Typography variant="h7" style={{ fontWeight: "bold" }}>
                POSITION
              </Typography>
            </Grid>
            <Button
              style={{ border: "1px solid rgba(24, 117, 208, 1)", margin: 10 }}
              variant={outlinedValuesPosition.gk ? "contained" : "outlined"}
              onClick={() => {
                setOutlinedValuesPosition({
                  gk: !outlinedValuesPosition.gk,
                  df: false,
                  md: false,
                  at: false,
                });

                setPosition({
                  goalkeeper: 1,
                  defender: 0,
                  midfielder: 0,
                  attacker: 0,
                });
              }}>
              GK
            </Button>
            <Button
              style={{ border: "1px solid rgba(24, 117, 208, 1)", margin: 10 }}
              variant={outlinedValuesPosition.df ? "contained" : "outlined"}
              onClick={() => {
                setOutlinedValuesPosition({
                  gk: false,
                  df: !outlinedValuesPosition.df,
                  md: false,
                  at: false,
                });

                setPosition({
                  goalkeeper: 0,
                  defender: 1,
                  midfielder: 0,
                  attacker: 0,
                });
              }}>
              DF
            </Button>
            <Button
              style={{ border: "1px solid rgba(24, 117, 208, 1)", margin: 10 }}
              variant={outlinedValuesPosition.md ? "contained" : "outlined"}
              onClick={() => {
                setOutlinedValuesPosition({
                  gk: false,
                  df: false,
                  md: !outlinedValuesPosition.md,
                  at: false,
                });

                setPosition({
                  goalkeeper: 0,
                  defender: 0,
                  midfielder: 1,
                  attacker: 0,
                });
              }}>
              MD
            </Button>
            <Button
              style={{ border: "1px solid rgba(24, 117, 208, 1)", margin: 10 }}
              variant={outlinedValuesPosition.at ? "contained" : "outlined"}
              onClick={() => {
                setOutlinedValuesPosition({
                  gk: false,
                  df: false,
                  md: false,
                  at: !outlinedValuesPosition.at,
                });

                setPosition({
                  goalkeeper: 0,
                  defender: 0,
                  midfielder: 0,
                  attacker: 1,
                });
              }}>
              AT
            </Button>
          </Grid>
        </Grid>
        {!phoneValidation && (
          <Grid item>
            <Alert severity="error">Incorrect phone!</Alert>
          </Grid>
        )}
        {!emailValidation && (
          <Grid item>
            <Alert severity="error">Incorrect email!</Alert>
          </Grid>
        )}
        {showSuccessMessage && (
          <Box display="flex" justifyContent="center" sx={{ m: 2 }}>
            <Alert icon={<CheckIcon fontSize="inherit" />} severity={"success"}>
              Profile updated successfully!
            </Alert>
          </Box>
        )}
        <Box component="span" className={classes.box} style={{ margin: "0px" }}>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            startIcon={<SaveIcon />}
            onClick={saveChanges}>
            Save
          </Button>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default ProfilePage;
