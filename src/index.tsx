import React from "react";
import ReactDOM from "react-dom";
import { initializeIcons } from "@uifabric/icons";
import { loadTheme } from "@fluentui/react";

import App from "./App";

import "./index.scss";

initializeIcons();

loadTheme({
  defaultFontStyle: {
    fontFamily: "Monaco, Menlo, Consolas",
    fontWeight: "regular",
  },
  fonts: {
    small: {
      fontSize: "11px",
    },
    medium: {
      fontSize: "13px",
    },
    large: {
      fontSize: "20px",
      fontWeight: "semibold",
    },
    xLarge: {
      fontSize: "22px",
      fontWeight: "semibold",
    },
  },
});

ReactDOM.render(<App />, document.getElementById("root"));
