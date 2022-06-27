import { makeStyles } from "@material-ui/styles";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import Geocode from "react-geocode";
import { useHistory } from "react-router-dom";
import MatchDetails from "./MatchDetails";

const useStyles = makeStyles({
  card: {
    margin: 10,
    width: 500,
  },
  containerStyle: { height: 150 },
  primaryDate: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#edf1fc",
    width: "4rem",
    height: "4rem",
  },
  primaryDateDay: {
    color: "#4e73e5",
    fontWeight: "500",
    fontSize: "1.5rem",
    lineHeight: 1,
  },
  primaryDateMonth: {
    color: "#4e73e5",
    fontSize: "1rem",
    lineHeight: 1,
    textTransform: "uppercase",
  },
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
});

const Match = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const center = { lat: props.locationLat, lng: props.locationLng };

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");

  const [map, setMap] = React.useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [disable, setDisable] = useState(false);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    window.google.maps.event.addListenerOnce(map, "zoom_changed", function () {
      map.setZoom(15);
    });
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const restructuredDate = new Date(props.date);
  const month = restructuredDate.toLocaleString("default", { month: "short" });
  const day = restructuredDate.toLocaleDateString("default", {
    day: "numeric",
  });
  const fromHour = props.startTime.toString().substring(0, 2);
  const fromMinutes = props.startTime.toString().substring(3, 5);

  const finalHour = computeHours(props.startTime, props.duration);
  const finalInterval = finalHour + ":" + fromMinutes;

  function computeHours(startTime, duration) {
    var beginningHour = startTime.toString().substring(0, 2);
    var finalHour = 0;

    if (parseInt(beginningHour.substring(0, 1)) > 0) {
      finalHour = parseInt(beginningHour) + duration;
    } else {
      finalHour = parseInt(beginningHour.substring(1, 2)) + duration;
      if (finalHour < 10) {
        return "0" + finalHour;
      }
    }

    return finalHour.toString();
  }

  const weekday = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const dayOfTheWeek = weekday[restructuredDate.getDay()];

  const [address, setAddress] = React.useState("");

  Geocode.setApiKey("AIzaSyDLlvfIHgEFG0GzOLqkNpKbNleec-GVowc");
  Geocode.setLanguage("en");
  Geocode.fromLatLng(props.locationLat, props.locationLng).then(
    (response) => {
      var mapAddress = response.results[0].formatted_address;
      setAddress(mapAddress);
    },
    (error) => {
      console.error(error);
    }
  );

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const [anchorElNav, setAnchorElNav] = useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOnOpenPopUp = () => {
    setOpenPopUp(true);
    setAnchorElNav(null);
  };

  const handleClosePopUp = () => {
    setOpenPopUp(false);
    setAnchorElNav(null);
  };

  const handleEditButton = () => {
    history.push("/edit-match/" + props.id);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const playerInMatch = players.some((player) => {
      return player[2] == currentUser.username;
    });

    if (playerInMatch) {
      setDisable(true);
    }

    if (props.availableSpots == 0) {
      setDisable(true);
    }
  }, [players]);

  useEffect(() => {
    getAllPlayers();
  }, [props.matchId, refresh]);

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
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const getAllPlayers = async () => {
    await axios
      .get(
        "http://localhost:8080/match/getPlayersFromMatch?matchId=" +
          props.matchId,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setPlayers(response.data);
        console.log("PLAYERS");
        console.log(response.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        backgroundColor: "#92a1cf",
        border: 1,
        borderColor: "#92a1cf",
        borderLeftWidth: 3,
        borderRightWidth: 3,
      }}
      className={classes.card}>
      <CardHeader
        sx={{ height: 50 }}
        action={
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "flex", lg: "flex" },
            }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              className={classes.root}
              disableRipple>
              <MoreVertIcon />
            </IconButton>
            {!props.isExplorePage && (
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: "block",
                }}>
                <MenuItem onClick={handleOnOpenPopUp}>Delete</MenuItem>
                <Dialog open={openPopUp} onClose={handleClosePopUp}>
                  <DialogTitle>{"Delete a match"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete the selected match?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={props.handleOnDeleteClick} autoFocus>
                      Yes
                    </Button>
                    <Button onClick={handleClosePopUp}>No</Button>
                  </DialogActions>
                </Dialog>
                <MenuItem onClick={handleEditButton}>Edit</MenuItem>
              </Menu>
            )}
            {props.isExplorePage && (
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: "block",
                }}>
                <MenuItem onClick={handleOnOpenPopUp}>See details</MenuItem>
                <MatchDetails
                  openPopUp={openPopUp}
                  handleClosePopUp={handleClosePopUp}
                  players={players}
                  cost={props.cost}
                  locationNotes={props.locationNotes}
                />
              </Menu>
            )}
          </Box>
        }
        title={props.title}
      />
      <CardMedia
      // component="img"
      // height="100"
      // image={image_1}
      // alt="Missing image"
      >
        {props.isLoaded && (
          <GoogleMap
            mapContainerClassName={classes.containerStyle}
            center={center}
            options={options}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}>
            <Marker position={center} />
          </GoogleMap>
        )}
      </CardMedia>
      <CardContent sx={{ height: props.height }}>
        <Grid container spacing={3}>
          <Grid item>
            <div className={classes.primaryDate}>
              <span className={classes.primaryDateDay}>{day}</span>
              <span className={classes.primaryDateMonth}>{month}</span>
            </div>
          </Grid>
          <Grid item alignItems="center" justifyContent="center">
            <Typography variant="body2" color="textSecondary" fontWeight="bold">
              {dayOfTheWeek}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {fromHour}:{fromMinutes}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {finalInterval}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="body2"
              color="textSecondary"
              display="flex"
              alignItems="flex-start">
              <LocationOnSharpIcon
                style={{ fill: "#9F2B68" }}
                fontSize="small"
              />
              {address.split(",")[0].replace("Strada", "")}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              display="flex"
              justifyContent="center">
              {props.soloPlayersMode ? "Solo players" : "For teams"}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              display="flex"
              justifyContent="center">
              {props.noOfTeams + " teams"} x {"  "}
              {props.noOfPlayersPerTeam + " players"}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              display="flex"
              justifyContent="center">
              available spots: {props.availableSpots}
            </Typography>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" style={{ marginTop: 5 }}>
          {props.isExplorePage && (
            <Button
              variant="contained"
              size="small"
              sx={{
                disabled: "#808080",
                backgroundColor: "darkslateblue",
                color: "white",
              }}
              disabled={disable}
              onClick={() => {
                props.handleAddPlayerToMatch();
                setRefresh(!refresh);
              }}>
              I want to participate
            </Button>
          )}
        </Box>
      </CardContent>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
};

export default Match;
