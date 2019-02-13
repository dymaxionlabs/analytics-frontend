import React from "react";
import { Image } from "semantic-ui-react";

const Logo = () => (
  <a href="//www.dymaxionlabs.com" target="_blank">
    <Image
      src="/static/logo.png"
      style={{
        position: "absolute",
        right: 10,
        bottom: 25,
        zIndex: 1000
      }}
    />
  </a>
);

export default Logo;
