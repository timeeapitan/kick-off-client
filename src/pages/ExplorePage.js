import { makeStyles } from "@material-ui/styles";
import { Button, Grid } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Match from "../components/Match";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles({
  container: {
    justifyContent: "space-evenly",
  },
});

const ExplorePage = () => {
  const [matches, getMatches] = useState("");
  const classes = useStyles();
  const history = useHistory();

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");

  const [refreshMatches, setRefreshMatches] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDLlvfIHgEFG0GzOLqkNpKbNleec-GVowc",
  });

  useEffect(() => {
    getAllMatches();
  }, [refreshMatches]);

  useEffect(() => {
    getUser();
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
        console.log(response);
        setCurrentUser(response.data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const getAllMatches = () => {
    const token = sessionStorage.getItem("token");

    return axios
      .get("http://localhost:8080/match/getAll", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        const allMatches = response.data;
        getMatches(allMatches);
        console.log(allMatches);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
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

  const handleAddPlayerToMatch = async (matchId) => {
    await axios
      .post(
        "http://localhost:8080/match/addUserToMatch",
        {
          matchId: matchId,
          userId: currentUser.id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setRefreshMatches(!refreshMatches);
        // this.forceUpdate();
        console.log("job done");
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  if (matches.length > 0) {
    return (
      <MainLayout>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, xm: 2, md: 3 }}
          className={classes.container}
          style={{ marginTop: 30 }}>
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
              locationNotes={match.locationNotes}
              startTime={match.startTime}
              duration={match.duration}
              isLoaded={isLoaded}
              soloPlayersMode={match.soloPlayersMode}
              matchId={match.id}
              availableSpots={match.availableSpots}
              handleOnDeleteClick={() => {
                handleOnDeleteClick(match.id);
              }}
              height={120}
              isExplorePage={true}
              id={match.id}
              handleAddPlayerToMatch={() => {
                handleAddPlayerToMatch(match.id);
                setRefreshMatches(!refreshMatches);
              }}
            />
          ))}
        </Grid>
      </MainLayout>
    );
  } else {
    return (
      <MainLayout>
        <Typography display="flex" justifyContent="center">
          <Link href="/login" color="blue" underline="none">
            To view the available matches, please log in the application!
          </Link>
        </Typography>
      </MainLayout>
    );
  }
};

export default ExplorePage;
