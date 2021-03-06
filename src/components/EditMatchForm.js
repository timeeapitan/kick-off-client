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
import { useHistory, useParams } from "react-router-dom";
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
    minWidth: "80vh",
    maxWidth: "80vh",
  },
  containerStyle: { height: 150 },
  buttonContainer: {
    justifyContent: "center",
    margin: "30px",
  },
});

const EditMatchForm = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const params = useParams();
  const matchId = params.id;
  const token = sessionStorage.getItem("token");

  const [matchTitle, setMatchTitle] = useState("");
  const [date, setDate] = useState("");
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
  const [soloPlayersMode, setSoloPlayersMode] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [showLocationComponent, setShowLocationComponent] = useState(true);
  const [open, setOpen] = useState(false);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({
    lat: 45.7935607,
    lng: 24.1212945,
  });

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const formRef = useRef();

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

  useEffect(() => {
    getMatchById(matchId);
  }, [matchId]);

  useEffect(() => {
    setCenter({
      lat: sessionStorage.getItem("locationLat"),
      lng: sessionStorage.getItem("locationLng"),
    });

    setLocationLat(sessionStorage.getItem("locationLat"));
    setLocationLng(sessionStorage.getItem("locationLng"));
  }, [locationLat, locationLng]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleOnChangeTarget = (event) => {
    setSoloPlayersMode(event.target.value);
  };

  const handleOnChangeTitle = (event) => {
    setMatchTitle(event.target.value);
  };

  const handleOnChangeDuration = (event) => {
    setDuration(event.target.value);
  };

  const handleOnChangeLocation = () => {
    setLocationLat(sessionStorage.getItem("locationLat"));
    setLocationLng(sessionStorage.getItem("locationLng"));
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
    setOpen(false);
  };

  const convertTime = (time) => {
    let finalTime = moment(time).format("hh:mm:ss");
    return finalTime;
  };

  const getMatchById = async () => {
    await axios
      .get("http://localhost:8080/match/getMatchById?id=" + matchId, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setSoloPlayersMode(response.data.soloPlayersMode);
        setMatchTitle(response.data.matchTitle);
        setFinalDate(response.data.date);
        const date = new Date(
          response.data.date + " " + response.data.startTime
        );
        setFinalStartTime(date);
        console.log("the final start time is: ");
        console.log(response.data.startTime);
        setDuration(response.data.duration);
        setLocationNotes(response.data.locationNotes);
        setNoOfTeams(response.data.noOfTeams);
        setNoOfPlayersPerTeam(response.data.noOfPlayersPerTeam);
        setCost(response.data.cost);
        setCenter({
          lat: response.data.locationLat,
          lng: response.data.locationLng,
        });
        setShowLocationComponent(true);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();

    formRef.current.reportValidity();
    const token = sessionStorage.getItem("token");

    axios
      .put(
        "http://localhost:8080/match/editMatch",
        {
          id: matchId,
          matchTitle: matchTitle,
          date: date != "" ? date : finalDate,
          startTime: startTime,
          duration: duration,
          locationLat: locationLat,
          locationLng: locationLng,
          locationNotes: locationNotes,
          noOfTeams: noOfTeams,
          noOfPlayersPerTeam: noOfPlayersPerTeam,
          soloPlayersMode: soloPlayersMode,
          cost: cost,
        },
        { headers: { Authorization: token } }
      )
      .then((res) => {
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
          Edit the selected match
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
              <Grid style={{ marginRight: 20 }}>
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
              <Grid>
                <TimePicker
                  value={finalStartTime}
                  onChange={(newTime) => {
                    var finalTimeForForm = moment(newTime).format("HH:mm:ss");
                    setStartTime(finalTimeForForm);
                    setFinalStartTime(newTime);
                    console.log(finalStartTime);
                  }}
                  views={["hours", "minutes", "seconds"]}
                  inputFormat="hh:mm:ss"
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
            maxWidth={"xs"}
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
                  display: "flex",
                  flexDirection: "column",
                  padding: "15px",
                }}
                fullWidth>
                <FinalMap />
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
            value={locationNotes}
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
            }}
            className={classes.field}
            value={cost}
            multiline
            rows={3}
            fullWidth
            label="Cost information"
            variant="outlined"
            required
            error={titleError}
          />
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
        </form>
      </Container>
    </MainLayout>
  );
};

export default EditMatchForm;
