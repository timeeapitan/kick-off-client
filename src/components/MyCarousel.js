import { makeStyles } from "@material-ui/styles";
import { CardMedia, Grid } from "@mui/material";
import React from "react";
import Carousel from "react-material-ui-carousel";
import image_1 from "../assets/carousel/image_1.jpg";
import image_2 from "../assets/carousel/image_2.jpg";
import image_3 from "../assets/carousel/image_3.jpg";
import image_4 from "../assets/carousel/image_4.jpg";
import image_5 from "../assets/carousel/image_5.jpg";

const useStyles = makeStyles({
  carousel: {
    maxHeight: "500px",
    maxWidth: "700px",
    margin: "auto",
  },
});

export const MyCarousel = () => {
  const classes = useStyles();
  const items = [image_1, image_2, image_3, image_4, image_5];
  return (
    <div>
      <Grid className={classes.carousel}>
        <Carousel stopAutoPlayOnHover interval={3000} animation="fade" swipe>
          {items.map((item) => (
            <CardMedia component="img" image={item} key={item} />
          ))}
        </Carousel>
      </Grid>
    </div>
  );
};
