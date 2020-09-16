/**
 * Home画面の画像スライドを設定
 * 
 */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import Slider from "react-slick";
import Grid from '@material-ui/core/Grid';

export default function TopImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true
  };

  return (
    <Slider {...settings}>
        <Grid container justify="center">
            <Grid item xs={12} sm={6}>
                <div>
                    <h1>香川県からレビュー！</h1>
                    <img src="https://aws-hcs-image.s3-ap-northeast-1.amazonaws.com/no_image.png"></img>
                </div>
            </Grid>
        </Grid>
        <Grid container justify="center">
            <Grid item xs={12} sm={6}>
                <div>
                    <h1>徳島県からレビュー！</h1>
                    <img src="https://aws-hcs-image.s3-ap-northeast-1.amazonaws.com/no_image.png"></img>
                </div>
            </Grid>
        </Grid>
        <Grid container justify="center">
            <Grid item xs={12} sm={6}>
                <div>
                    <h1>岡山県からレビュー！</h1>
                    <img src="https://aws-hcs-image.s3-ap-northeast-1.amazonaws.com/no_image.png"></img>
                </div>
            </Grid>
        </Grid>
            {/* <div>
                <h3>4</h3>
            </div>
            <div>
                <h3>5</h3>
            </div>
            <div>
                <h3>6</h3>
            </div> */}
    </Slider>
  );
}