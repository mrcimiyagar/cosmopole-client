import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  Article,
  Audiotrack,
  OndemandVideo,
  Photo,
} from "@mui/icons-material";

export default function FoldersToggleButtons() {
  const [alignment, setAlignment] = React.useState("photo");

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div style={{ height: 32, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.35)' }}>
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        style={{ height: '100%' }}
        aria-label="text alignment"
      >
        <ToggleButton
          value="photo"
          aria-label="left aligned"
          style={{
            width: 40,
            color: "rgba(0, 101, 87, 1)",
            borderColor: "transparent",
            borderRadius: "16px 0px 0px 16px",
          }}
        >
          <Photo />
        </ToggleButton>
        <ToggleButton
          value="audio"
          aria-label="centered"
          style={{ width: 40, color: "rgba(05,98,190,1)", borderColor: "transparent" }}
        >
          <Audiotrack />
        </ToggleButton>
        <ToggleButton
          value="video"
          aria-label="left aligned"
          style={{ width: 40, color: "rgba(210, 54, 5, 1)", borderColor: "transparent" }}
        >
          <OndemandVideo />
        </ToggleButton>
        <ToggleButton
          value="doc"
          aria-label="centered"
          style={{
            width: 40,
            color: "rgba(174, 04, 71, 1)",
            borderColor: "transparent",
            borderRadius: "0px 16px 16px 0px",
          }}
        >
          <Article />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
