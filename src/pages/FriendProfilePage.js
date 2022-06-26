import { makeStyles } from "@material-ui/styles";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Avatar, Button, Container, Grid, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const FriendProfilePage = (props) => {
  const classes = useStyles();
  const user = props.user;

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");

  const [buttonText, setButtonText] = useState("Add friend");
  const [buttonColor, setButtonColor] = useState("#ffc107");
  const [currentUser, setCurrentUser] = useState({});

  const [friendUser, setFriendUser] = useState({});
  const [friendBodyStructure, setFriendBodyStructure] = useState("");
  const [friendPosition, setFriendPosition] = useState("");
  const [friendProfilePicture, setFriendProfilePicture] = useState("");

  const [existsFriendship, setExistsFriendship] = useState(false);
  const [refreshFriendship, setRefreshFriendship] = useState(false);

  const [openPopUp, setOpenPopUp] = useState(false);
  const [show, setShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const params = useParams();
  const friendId = params.id;

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    getFriend();
    getFriendProfilePicture();
    getFriendBodyStructure();
    getFriendPosition();
    checkFriendship();
  }, [currentUser, refreshFriendship]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [show]);

  const getCurrentUser = async () => {
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
        setCurrentUser(response.data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const getFriend = async () => {
    await axios
      .get("http://localhost:8080/user/getUserById?id=" + friendId, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setFriendUser(response.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getFriendProfilePicture = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/user/getProfilePicture?id=" + friendId,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setFriendProfilePicture(response.data);
    } catch (err) {
      throw new Error(err);
    }
  };

  const getFriendBodyStructure = async () => {
    await axios
      .get(
        "http://localhost:8080/body-structure/get-body-structure?id=" +
          friendId,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setFriendBodyStructure(response.data);
      });
  };

  const getFriendPosition = async () => {
    await axios
      .get("http://localhost:8080/position/get-position?id=" + friendId, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.data.attacker === 1) {
          setFriendPosition("attacker");
        }

        if (response.data.defender === 1) {
          setFriendPosition("defender");
        }

        if (response.data.goalkeeper === 1) {
          setFriendPosition("goalkeeper");
        }

        if (response.data.midfielder === 1) {
          setFriendPosition("midfielder");
        }
      });
  };

  const handleAddFriend = async () => {
    await axios
      .post(
        "http://localhost:8080/friendship/addFriend",
        {
          userId: currentUser.id,
          friendId: friendId,
        },
        { headers: { Authorization: token } }
      )
      .then((response) => {
        setButtonColor("#bf360c");
        setButtonText("Delete friend");
        setRefreshFriendship(!refreshFriendship);
        setShow(true);
        setAlertMessage("Friend added successfully");
        setSeverity("info");
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleDeleteFriend = async () => {
    await axios
      .delete(
        "http://localhost:8080/friendship/deleteFriendship?firstUserId=" +
          currentUser.id +
          "&secondUserId=" +
          friendId,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        setButtonColor("#ffc107");
        setButtonText("Add friend");
        setRefreshFriendship(!refreshFriendship);
        handleClosePopUp();
        setShow(true);
        setAlertMessage("Friend deleted successfully");
        setSeverity("success");
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const checkFriendship = async () => {
    const response = await axios.get(
      "http://localhost:8080/friendship/existsFriendship?firstUserId=" +
        currentUser.id +
        "&secondUserId=" +
        friendId,
      { headers: { Authorization: token } }
    );
    setExistsFriendship(response.data);
    if (response.data) {
      setButtonColor("#bf360c");
      setButtonText("Delete friend");
    }
  };

  const handleOpenPopUp = () => {
    setOpenPopUp(true);
  };

  const handleClosePopUp = () => {
    setOpenPopUp(false);
  };

  return (
    <MainLayout>
      <Container className={classes.container}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center">
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Avatar
                src={friendUser.tablePictureSrc}
                alt="Profile picture"
                sx={{ width: 170, height: 170 }}
              />
            </Box>
            <Box display="flex" justifyContent="center">
              <Typography variant="h5">
                {friendUser.username + "  #" + friendUser.id}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <Typography variant="h5">
                {friendUser.firstName} {friendUser.lastName}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" style={{ marginTop: 30 }}>
          <Button
            variant="contained"
            style={{ backgroundColor: buttonColor }}
            onClick={existsFriendship ? handleOpenPopUp : handleAddFriend}>
            {buttonText}
          </Button>
        </Box>
        {show && (
          <Box display="flex" justifyContent="center" sx={{ m: 2 }}>
            <Alert
              icon={
                severity === "success" ? (
                  <CheckIcon fontSize="inherit" />
                ) : (
                  <InfoOutlinedIcon fontSize="inherit" />
                )
              }
              severity={severity}>
              {alertMessage}
            </Alert>
          </Box>
        )}
        <Dialog open={openPopUp} onClose={handleClosePopUp}>
          <DialogTitle>{"Delete a friend"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete{" "}
              {friendUser.firstName + " " + friendUser.lastName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteFriend} autoFocus>
              Yes
            </Button>
            <Button onClick={handleClosePopUp}>No</Button>
          </DialogActions>
        </Dialog>
        <Grid container spacing={3} style={{ marginTop: 10 }}>
          <Grid item xs={6} md={6} lg={6}>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6" fontWeight="bold" color="secondary">
                Email
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6" fontWeight="bold" color="secondary">
                Phone
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6" fontWeight="bold" color="secondary">
                Birthday
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6" fontWeight="bold" color="secondary">
                Country
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6" fontWeight="bold" color="secondary">
                Height
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6" fontWeight="bold" color="secondary">
                Weight
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6" fontWeight="bold" color="secondary">
                Foot
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6" fontWeight="bold" color="secondary">
                Position
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Box display="flex" justifyContent="flex-start">
              <Typography variant="h6">
                {friendUser.email !== null
                  ? friendUser.email
                  : "No email provided"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start">
              <Typography variant="h6">
                {friendUser.phone !== null
                  ? friendUser.phone
                  : "No phone number provided"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start">
              <Typography variant="h6">
                {friendUser.dateOfBirth !== null
                  ? moment(friendUser.dateOfBirth).format("MMMM Do YYYY")
                  : "No birthday provided"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start">
              <Typography variant="h6">
                {friendUser.country !== null
                  ? friendUser.country
                  : "No country provided"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start">
              <Typography variant="h6">
                {friendBodyStructure.height !== null
                  ? friendBodyStructure.height + " cm"
                  : "No height provided"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start">
              <Typography variant="h6">
                {friendBodyStructure.weight !== null
                  ? friendBodyStructure.weight + " kg"
                  : "No weight provided"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start">
              <Typography variant="h6">
                {friendBodyStructure.foot !== null
                  ? friendBodyStructure.foot
                  : "No foot provided"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start">
              <Typography variant="h6">
                {friendPosition !== null
                  ? friendPosition
                  : "No position provied"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default FriendProfilePage;
