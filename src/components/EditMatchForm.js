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
import axios from "axios";
import moment from "moment";
import { useState } from "react";
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
    minWidth: "80vh",
    maxWidth: "80vh",
  },
});

const EditMatchForm = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [matchTitle, setMatchTitle] = useState(props.match.matchTitle);
  const [date, setDate] = useState(new Date());
  const [finalDate, setFinalDate] = useState(props.match.finalDate);
  const [startTime, setStartTime] = useState("");
  const [finalStartTime, setFinalStartTime] = useState(
    props.match.finalStartTime
  );
  const [duration, setDuration] = useState(props.match.duration);
  const [locationLat, setLocationLat] = useState(props.match.locationLat);
  const [locationLng, setLocationLng] = useState(props.match.locationLng);
  const [locationNotes, setLocationNotes] = useState(props.match.locationNotes);
  const [noOfTeams, setNoOfTeams] = useState(props.match.noOfTeams);
  const [noOfPlayersPerTeam, setNoOfPlayersPerTeam] = useState(
    props.match.noOfPlayersPerTeam
  );
  const [cost, setCost] = useState(props.match.cost);
  const [soloPlayersMode, setSoloPlayersMode] = useState(
    props.match.soloPlayersMode
  );
  const [titleError, setTitleError] = useState(false);
  const [open, setOpen] = useState(false);

  const dialogStyle = { maxWidth: 1000, backgroundColor: "transparent" };

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

  const handleOnChangeLocation = () => {};

  const handleOpenDialog = (event) => {
    setOpen(true);
  };

  const handleCloseDialog = (event, reason) => {
    if (reason && reason == "backdropClick") {
      return;
    }

    setOpen(false);
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
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
          noOfPlayersPerTeam: noOfPlayersPerTeam,
          cost: cost,
          soloPlayersMode: soloPlayersMode,
        },
        { headers: { Authorization: token } }
      )
      .then((res) => {
        console.log(res);
        console.log(res.data);
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
          className={(classes.title, classes.field)}>
          Edit the selected match
        </Typography>

        <form autoComplete="on" onSubmit={handleSubmit}>
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
            "Altceva"
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
                {/* <TextField
                label="Enter a place"
                variant="standard"
                fullWidth
                margin="dense"
              /> */}
                <FinalMap />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={(handleCloseDialog, handleOnChangeLocation)}>
                Done
              </Button>
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
