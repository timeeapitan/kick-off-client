import { makeStyles } from "@material-ui/styles";
import { Button, Grid } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Match from "../components/Match";

const useStyles = makeStyles({
  buttonContainer: {
    justifyContent: "center",
    margin: "30px",
  },
  container: {
    justifyContent: "space-evenly",
  },
});

const MatchesPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");

  const [matches, getMatches] = useState("");
  const [refreshMatches, setRefreshMatches] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDLlvfIHgEFG0GzOLqkNpKbNleec-GVowc",
  });

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      if (currentUser !== null) {
        getAllMatchesByAdmin();
      }
    }
    return () => {
      ignore = true;
    };
  }, [refreshMatches, currentUser]);

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

  const getAllMatchesByAdmin = async () => {
    await axios
      .get(
        "http://localhost:8080/match/getAllByAdmin?adminId=" + currentUser.id,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        const allMatches = response.data;
        getMatches(allMatches);
        console.log(allMatches);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  const handleOnClickButton = () => {
    history.push("/schedule");
  };

  const handleOnDeleteClick = async (id) => {
    await axios
      .delete("http://localhost:8080/match/deleteMatch?id=" + id, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response);
        setRefreshMatches(!refreshMatches);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  if (matches.length > 0) {
    return (
      <MainLayout>
        <Grid container className={classes.buttonContainer}>
          <Button
            variant="contained"
            style={{ color: "white" }}
            onClick={handleOnClickButton}>
            Schedule a new match
          </Button>
        </Grid>

        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, xm: 2, md: 3 }}
          className={classes.container}>
          {matches.map((match) => (
            <Match
              key={match.id}
              title={match.matchTitle}
              date={match.date}
              locationLat={match.locationLat}
              locationLng={match.locationLng}
              noOfTeams={match.noOfTeams}
              noOfPlayersPerTeam={match.noOfPlayersPerTeam}
              cost={match.cost}
              startTime={match.startTime}
              duration={match.duration}
              isLoaded={isLoaded}
              soloPlayersMode={match.soloPlayersMode}
              matchId={match.id}
              availableSpots={match.availableSpots}
              handleOnDeleteClick={() => {
                handleOnDeleteClick(match.id);
              }}
              height={100}
              isExplorePage={false}
            />
          ))}
        </Grid>
      </MainLayout>
    );
  } else {
    return (
      <MainLayout>
        <Grid container className={classes.buttonContainer}>
          <Button
            variant="contained"
            style={{ color: "white" }}
            onClick={handleOnClickButton}>
            Schedule a new match
          </Button>
        </Grid>
        <h3>No matches yet</h3>
      </MainLayout>
    );
  }
};

export default MatchesPage;