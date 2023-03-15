import React, { useState } from "react";

export default function ImagePlaceHolder(props) {
  let [height, setHeight] = useState(200);
  let image = new Image();
  image.src = props.src;

  image.onload = function () {
    setHeight(image.naturalHeight);
  };

  return (
    <div className="imagePlaceholder" style={{ height: `${height}px` }}></div>
  );
}
