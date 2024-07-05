"use client";
import Slider from "react-slick";
import { VerticalScroll } from "./components/VerticalScroll";

export default function Home() {
  // var settings = {
  //   dots: true,
  //   infinite: true,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   vertical: true,
  //   verticalSwiping: true,
  //   swipeToSlide: true,
  //   beforeChange: function (currentSlide, nextSlide) {
  //     console.log("before change", currentSlide, nextSlide);
  //   },
  //   afterChange: function (currentSlide) {
  //     console.log("after change", currentSlide);
  //   },
  // };

  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <main className="">
      <div>
        <VerticalScroll />
        {/* Add more content here to test scrolling */}
      </div>
      {/* <div className=""> */}
      {/* <ul className="link-list">
          <li className="highlighted">Movies</li>
        </ul> */}

      {/* <Slider {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Slider> */}
      {/* </div> */}
    </main>
  );
}
