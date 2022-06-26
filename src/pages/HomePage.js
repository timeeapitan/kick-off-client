import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/styles";
import CheckBoxTwoToneIcon from "@mui/icons-material/CheckBoxTwoTone";
import SportsSoccerTwoToneIcon from "@mui/icons-material/SportsSoccerTwoTone";
import SportsTwoToneIcon from "@mui/icons-material/SportsTwoTone";
import { CardMedia, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import soccer from "../assets/logo/soccer-ball.gif";
import MainLayout from "../components/MainLayout";
import { MyCarousel } from "../components/MyCarousel";
import "./HomePage.css";
import football_player from "../assets/home page/football_player.png";
import discussion from "../assets/home page/discussion.png";

const useStyles = makeStyles({
  bold: {
    fontWeight: 600,
  },
  container: {
    marginBottom: 50,
    marginTop: 20,
  },
  italic: {
    fontStyle: "italic",
  },
  item: {
    margin: "10px 0px",
  },
  body: {
    paddingTop: "1000px",
    marginTop: "100vh",
  },
  carousel: {
    margin: "30px 600px",
  },
});

const HomePage = () => {
  const classes = useStyles();

  return (
    <MainLayout>
      <Container style={{ padding: 50 }} disableGutters>
        <Grid
          container
          columnSpacing={3}
          justifyContent="space-around"
          className={classes.container}>
          <Typography variant="h2" align="justify" className={classes.bold}>
            Kick-off
          </Typography>
          <Grid
            container
            columnSpacing={12}
            justifyContent="space-around"
            className={classes.container}>
            <Grid item xs={12} md={6} lg={6}>
              <Typography
                variant="h5"
                align="justify"
                className={classes.italic}>
                You cannot play soccer alone!
              </Typography>
              <br></br>
              <Typography variant="h6" align="justify">
                Kick-off is a platform that gives you the simplest way of
                meeting soccer amateurs and of organizing matches in 2 strokes
                and 3 moves.
              </Typography>
              <br></br>
              <Typography variant="h5" align="justify" className={classes.bold}>
                Our goal
              </Typography>
              <Typography variant="h6" align="justify">
                To take the motives out of the vocabulary and people out of the
                house. It has never been easier to create teams and organize
                soccer matches wherever you are.
              </Typography>
              <br></br>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Box
                component="img"
                src={soccer}
                display="flex"
                alignItems="center"
                justifyContent="center"></Box>
            </Grid>
          </Grid>
          <Typography variant="h5" align="center" className={classes.bold}>
            Ideal for players and for team managers
          </Typography>
          <Grid
            container
            justifyContent="space-around"
            className={classes.container}
            columnSpacing={12}>
            <Grid item xs={12} md={6} lg={6} className={classes.item}>
              <Typography variant="h6" align="justify">
                We encourage people to invite their friends and play soccer
                together. Anytime, a player can also become a manager once he
                creates a team or organizes a soccer match.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={6} className={classes.item}>
              <Typography variant="h6" align="justify">
                Kick-off is not just for players. Team managers will be able to
                manage their matches and players more efficiently using the data
                and tools provided by the app.
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-around"
            className={classes.container}
            columnSpacing={12}>
            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              className={classes.item}
              display="flex"
              justifyContent="center">
              <Box
                component="img"
                sx={{
                  height: 233,
                  width: 350,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt="Goalkeeper"
                src={football_player}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6} className={classes.item}>
              <Typography
                variant="h4"
                align="justify"
                style={{ marginBottom: "5px", fill: "#179fa3" }}>
                Player
              </Typography>
              <Typography
                variant="h6"
                display="flex"
                align="justify"
                alignItems="center">
                <SportsSoccerTwoToneIcon
                  style={{ marginRight: "5px", fill: "#179fa3" }}
                />
                Create a player profile
              </Typography>
              <Typography
                variant="h6"
                display="flex"
                align="justify"
                alignItems="center">
                <SportsSoccerTwoToneIcon
                  style={{ marginRight: "5px", fill: "#179fa3" }}
                />
                Connect with other players
              </Typography>
              <Typography
                variant="h6"
                display="flex"
                align="justify"
                alignItems="center">
                <SportsSoccerTwoToneIcon
                  style={{ marginRight: "5px", fill: "#179fa3" }}
                />
                Rate your mates and the sport field
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-around"
            className={classes.container}
            columnSpacing={12}>
            <Grid item xs={12} md={6} lg={6} className={classes.item}>
              <Typography
                variant="h4"
                align="justify"
                style={{ marginBottom: "5px" }}>
                Manager
              </Typography>
              <Typography
                variant="h6"
                align="justify"
                display="flex"
                alignItems="flex-start">
                <SportsTwoToneIcon
                  style={{ marginRight: "5px", fill: "#179fa3" }}
                />
                Find a sport field and organize a match at a given date.
              </Typography>
              <Typography
                variant="h6"
                align="justify"
                display="flex"
                alignItems="flex-start">
                <SportsTwoToneIcon
                  style={{ marginRight: "5px", fill: "#179fa3" }}
                />
                Improve your team's componence by analyzing the players'
                profiles and by inviting them to join your team.
              </Typography>
              <Typography
                variant="h6"
                display="flex"
                align="justify"
                alignItems="center">
                <SportsTwoToneIcon
                  style={{ marginRight: "5px", fill: "#179fa3" }}
                />
                Rate your mates and the sport field
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              className={classes.item}
              display="flex"
              justifyContent="center">
              <Box
                component="img"
                sx={{
                  height: 233,
                  width: 350,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt="Discussion between managers"
                src={discussion}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} md={12} lg={12}>
              <Typography variant="h5" align="center" className={classes.bold}>
                Kick-off for amateur players
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Typography variant="h6" align="center">
                The app includes the following data necessary for creating teams
                and scheduling matches:
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-around"
            className={classes.container}
            columnSpacing={10}>
            <Grid item xs={12} md={12} lg={2} className={classes.item}>
              <Typography variant="h6" align="center" alignItems="flex-start">
                <CheckBoxTwoToneIcon
                  style={{ marginRight: "5px", fill: "#179fa3" }}
                />
                the area where the user wants to play football
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              lg={2}
              className={classes.item}
              alignItems="flex-start">
              <Typography variant="h6" align="center">
                <CheckBoxTwoToneIcon
                  style={{ marginRight: "5px", fill: "#179fa3" }}
                />
                favorite position
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              lg={2}
              className={classes.item}
              alignItems="flex-start">
              <Typography variant="h6" align="center">
                <CheckBoxTwoToneIcon
                  style={{ marginRight: "5px", fill: "#179fa3" }}
                />
                favorite leg
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              lg={2}
              className={classes.item}
              alignItems="flex-start">
              <Typography variant="h6" align="center">
                <CheckBoxTwoToneIcon
                  style={{ marginRight: "5px", fill: "#179fa3" }}
                />
                player rating
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <MyCarousel className={classes.carousel} />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default HomePage;
