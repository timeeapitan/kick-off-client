import { makeStyles } from "@material-ui/styles";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import FinalMap from "../google-maps-api/FinalMap";
import MainLayout from "./MainLayout";

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: "block",
  },
  title: {
    marginTop: 50,
    textDecoration: "underline",
  },
  box: {
    height: 50,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    margin: 0,
  },
  dialogPaper: {
    minHeight: "70vh",
    maxHeight: "70vh",
  },
  containerStyle: { height: 150 },
});

const MatchForm = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");
  const [showNext, setShowNext] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);

  const [matchTitle, setMatchTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [finalDate, setFinalDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [finalStartTime, setFinalStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [locationLat, setLocationLat] = useState("");
  const [locationLng, setLocationLng] = useState("");
  const [locationNotes, setLocationNotes] = useState("");
  const [noOfTeams, setNoOfTeams] = useState("");
  const [noOfPlayersPerTeam, setNoOfPlayersPerTeam] = useState("");
  const [cost, setCost] = useState("");
  const [availableSpots, setAvailableSpots] = useState(null);
  const [soloPlayersMode, setSoloPlayersMode] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [showLocationComponent, setShowLocationComponent] = useState(false);
  const [map, setMap] = useState(null);
  const latitude = parseInt(sessionStorage.getItem("locationLat"));
  const longitude = parseInt(sessionStorage.getItem("locationLng"));
  const center = {
    lat: latitude,
    lng: longitude,
  };
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const formRef = useRef();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getTeamsByAdmin();
  }, [currentUser]);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    window.google.maps.event.addListenerOnce(map, "zoom_changed", function () {
      map.setZoom(15);
    });
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

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
        setCurrentUser(response.data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleOnChangeTarget = (event) => {
    setSoloPlayersMode(event.target.value);
  };

  const handleOnChangeTitle = (event) => {
    setMatchTitle(event.target.value);
    handleSetAvailableSpots();
  };

  const handleOnChangeDuration = (event) => {
    setDuration(event.target.value);
  };

  const handleOnChangeLocation = () => {
    handleCloseDialog();
    setShowLocationComponent(true);
  };

  const handleOpenDialog = (event) => {
    setOpen(true);
  };

  const handleCloseDialog = (event, reason) => {
    if (reason && reason == "backdropClick") {
      return;
    }

    setShowLocationComponent(false);
    setOpen(false);
  };

  const handleSetAvailableSpots = () => {
    console.log("this is the solo players mode " + soloPlayersMode);
    if (soloPlayersMode) {
      setAvailableSpots(noOfTeams * noOfPlayersPerTeam);
    } else {
      setAvailableSpots(2);
      setNoOfPlayersPerTeam(0);
      setNoOfTeams(0);
    }
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();

    console.log("number of available spots " + availableSpots);

    formRef.current.reportValidity();
    const token = sessionStorage.getItem("token");
    axios
      .post(
        "http://localhost:8080/match/addMatch",
        {
          matchTitle: matchTitle,
          date: date,
          startTime: startTime,
          duration: duration,
          locationLat: locationLat,
          locationLng: locationLng,
          noOfTeams: noOfTeams,
          locationNotes: locationNotes,
          noOfPlayersPerTeam: noOfPlayersPerTeam,
          cost: cost,
          soloPlayersMode: soloPlayersMode,
          availableSpots: availableSpots,
          admin: currentUser,
        },
        { headers: { Authorization: token } }
      )
      .then(() => {
        if (!soloPlayersMode) {
          setShowNext(true);
        } else {
          history.push("/matches");
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getTeamsByAdmin = async () => {
    await axios
      .get(
        "http://localhost:8080/team/getTeamsByAdminOnly?adminId=" +
          currentUser.id,
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        setTeams(response.data);
      });
  };

  const handleAddTeamToMatch = async () => {
    await axios
      .post(
        "http://localhost:8080/match/addTeamToMatchByAdminAndTitle",
        {
          teamId: selectedTeam,
          adminId: currentUser.id,
          title: matchTitle,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then(() => {
        setMatchTitle("");
        setDate("");
        setFinalDate("");
        setStartTime("");
        setLocationLat("");
        setLocationLng("");
        setNoOfPlayersPerTeam("");
        setCost("");
        setSoloPlayersMode("");
        history.push("/matches");
      });
  };

  return (
    <MainLayout>
      <Container style={{ marginBottom: 100 }}>
        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          gutterBottom
          className={(classes.title, classes.field)}
          display="flex"
          justifyContent="center">
          Schedule a new match
        </Typography>
        <form autoComplete="on" onSubmit={handleSubmit} required ref={formRef}>
          <Typography
            variant="h6"
            color="textSecondary"
            component="h2"
            gutterBottom
            className={classes.field}>
            Target
          </Typography>
          <FormControl
            className={classes.field}
            fullWidth
            required
            error={titleError}>
            <InputLabel>Target</InputLabel>
            <Select
              label="Target"
              value={soloPlayersMode}
              onChange={handleOnChangeTarget}>
              <MenuItem value={true}>For solo players</MenuItem>
              <MenuItem value={false}>For teams</MenuItem>
            </Select>
          </FormControl>
          <Typography
            variant="h6"
            color="textSecondary"
            component="h2"
            gutterBottom
            className={classes.field}>
            Title of the match
          </Typography>
          <TextField
            value={matchTitle}
            onChange={handleOnChangeTitle}
            className={classes.field}
            fullWidth
            label="Match title"
            variant="outlined"
            required
            error={titleError}
          />
          <Typography
            variant="h6"
            color="textSecondary"
            component="h2"
            gutterBottom
            className={classes.field}>
            Date and start time
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container>
              <Grid style={{ marginRight: 20, marginBottom: 10 }}>
                <DatePicker
                  openTo="day"
                  views={["year", "month", "day"]}
                  value={finalDate}
                  onChange={(newDate) => {
                    var finalDateForForm = moment(newDate).format("YYYY-MM-DD");
                    console.log(finalDateForForm);
                    setDate(finalDateForForm);
                    console.log(date);
                    setFinalDate(newDate);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  className={classes.field}
                />
              </Grid>
              <Grid style={{ marginRight: 20, marginBottom: 10 }}>
                <TimePicker
                  value={finalStartTime}
                  onChange={(newTime) => {
                    var finalTimeForForm = moment(newTime).format("HH:mm:ss");
                    setStartTime(finalTimeForForm);
                    setFinalStartTime(newTime);
                    console.log(finalStartTime);
                  }}
                  views={["hours", "minutes", "seconds"]}
                  inputFormat="HH:mm:ss"
                  renderInput={(params) => <TextField {...params} />}
                  className={classes.field}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
          <Typography
            variant="h6"
            color="textSecondary"
            component="h2"
            gutterBottom
            className={classes.field}>
            Duration
          </Typography>
          <FormControl
            className={classes.field}
            fullWidth
            required
            error={titleError}>
            <InputLabel>Duration</InputLabel>
            <Select
              label="Duration"
              value={duration}
              onChange={handleOnChangeDuration}>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={11}>11</MenuItem>
              <MenuItem value={12}>12</MenuItem>
            </Select>
          </FormControl>
          <Typography
            variant="h6"
            color="textSecondary"
            component="h2"
            gutterBottom
            className={classes.field}>
            Location
          </Typography>
          {locationLat != null && locationLng != null ? (
            <Button
              variant="contained"
              disableElevation
              className={classes.field}
              color="secondary"
              size="medium"
              onClick={handleOpenDialog}>
              <LocationOnRoundedIcon style={{ marginRight: 10 }} />
              Search a location
            </Button>
          ) : (
            <Typography>The chosen location</Typography>
          )}

          {showLocationComponent && (
            <Box
              sx={{
                width: 600,
                paddingTop: 2,
                paddingBottom: 2,
              }}
              fullWidth>
              <GoogleMap
                mapContainerClassName={classes.containerStyle}
                center={center}
                options={options}
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}>
                <Marker position={center} />
              </GoogleMap>
            </Box>
          )}
          <Dialog
            open={open}
            onClose={handleCloseDialog}
            maxWidth={"sm"}
            fullWidth
            classes={{ paper: classes.dialogPaper }}>
            <DialogTitle>
              Search for a place
              {handleCloseDialog ? (
                <IconButton
                  aria-label="close"
                  onClick={handleCloseDialog}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}>
                  <CloseIcon />
                </IconButton>
              ) : null}
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  padding: "15px",
                }}
                fullWidth>
                <FinalMap lat={45.9432} lng={24.9668} />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOnChangeLocation}>Done</Button>
            </DialogActions>
          </Dialog>
          <Typography
            variant="h6"
            color="textSecondary"
            component="h2"
            gutterBottom
            className={classes.field}>
            Location notes
          </Typography>
          <TextField
            onChange={(event) => setLocationNotes(event.target.value)}
            className={classes.field}
            multiline
            rows={3}
            fullWidth
            label="Location notes"
            variant="outlined"
            required
            error={titleError}
          />
          {soloPlayersMode && (
            <>
              <Typography
                variant="h6"
                color="textSecondary"
                component="h2"
                gutterBottom
                className={classes.field}>
                Number of teams
              </Typography>
              <FormControl
                className={classes.field}
                fullWidth
                required
                error={titleError}>
                <InputLabel>No of teams</InputLabel>
                <Select
                  label="No of teams"
                  value={noOfTeams}
                  onChange={(event) => setNoOfTeams(event.target.value)}>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={7}>7</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={9}>9</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={11}>11</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                </Select>
              </FormControl>
              <Typography
                variant="h6"
                color="textSecondary"
                component="h2"
                gutterBottom
                className={classes.field}>
                Number of players per team
              </Typography>
              <FormControl
                className={classes.field}
                fullWidth
                required
                error={titleError}>
                <InputLabel>No of players</InputLabel>
                <Select
                  label="No of players"
                  value={noOfPlayersPerTeam}
                  onChange={(event) => {
                    setNoOfPlayersPerTeam(event.target.value);
                    console.log(noOfPlayersPerTeam);
                  }}>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={7}>7</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={9}>9</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={11}>11</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <Typography
            variant="h6"
            color="textSecondary"
            component="h2"
            gutterBottom
            className={classes.field}>
            Cost
          </Typography>
          <TextField
            onChange={(event) => {
              setCost(event.target.value);
              console.log("LAT" + sessionStorage.getItem("locationLat"));
              setLocationLat(sessionStorage.getItem("locationLat"));
              setLocationLng(sessionStorage.getItem("locationLng"));
              handleSetAvailableSpots();
            }}
            className={classes.field}
            multiline
            rows={3}
            fullWidth
            label="Cost information"
            variant="outlined"
            required
            error={titleError}
          />
          {!showNext && (
            <Box
              component="span"
              m={1}
              className={classes.box}
              style={{ margin: "0px" }}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                onClick={handleSubmitForm}>
                Done
              </Button>
            </Box>
          )}
        </form>
        {showNext && (
          <>
            <Typography
              variant="h6"
              color="textSecondary"
              component="h2"
              gutterBottom
              className={classes.field}>
              You have scheduled a match for teams only. Add one of your teams
              to the event.
            </Typography>
            <FormControl
              className={classes.field}
              fullWidth
              required
              error={titleError}>
              <InputLabel>Teams</InputLabel>
              <Select
                label="Teams"
                value={selectedTeam}
                onChange={(event) => setSelectedTeam(event.target.value)}>
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              component="span"
              m={1}
              className={classes.box}
              style={{ margin: "0px" }}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                onClick={handleAddTeamToMatch}>
                Done
              </Button>
            </Box>
          </>
        )}
      </Container>
    </MainLayout>
  );
};

export default MatchForm;
