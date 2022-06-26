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
import Alert from "@mui/material/Alert";

const useStyles = makeStyles({
  container: {
    justifyContent: "space-evenly",
  },
  linkContainer: {
    justifyContent: "center",
    margin: "30px",
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
  const [show, setShow] = useState(false);

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

  useEffect(() => {
    const timeId = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [show]);

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
        setRefreshMatches(!refreshMatches);
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
        setShow(!show);
        console.log("job done");
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  if (matches.length > 0) {
    return (
      <MainLayout>
        <Grid justifyContent="center">
          {show ? (
            <Alert
              severity="success"
              variant="outlined"
              sx={{
                justifyContent: "center",
                margin: "0px 150px",
                color: "#483D8B",
              }}>
              You have successfully joined a match! Check out the details for
              more information.
            </Alert>
          ) : (
            <Typography
              variant="h5"
              style={{ marginTop: 10 }}
              display="flex"
              justifyContent="center">
              Choose a match and join the other players!
            </Typography>
          )}
        </Grid>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, xm: 2, md: 3 }}
          className={classes.container}
          style={{ marginTop: 20 }}>
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
              availableSpots={
                match.availableSpots > 0 ? match.availableSpots : 0
              }
              handleOnDeleteClick={() => {
                handleOnDeleteClick(match.id);
              }}
              height={120}
              isExplorePage={true}
              id={match.id}
              handleAddPlayerToMatch={() => {
                handleAddPlayerToMatch(match.id);
              }}
            />
          ))}
        </Grid>
      </MainLayout>
    );
  } else {
    return (
      <MainLayout>
        <Grid container className={classes.linkContainer}>
          <Typography display="flex" justifyContent="center">
            <Link href="/login" color="blue" underline="none">
              To view the available matches, please log in or create an account!
            </Link>
          </Typography>
        </Grid>
      </MainLayout>
    );
  }
};

export default ExplorePage;
