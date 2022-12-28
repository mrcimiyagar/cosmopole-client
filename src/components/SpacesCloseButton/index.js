import { Undo } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import React from "react";
import { colors } from "../../config/colors";
import { reset } from "../../sections/Spaces";

export function showSpacesCloseButton() {}

export function hideSpacesCloseButton() {}

export default function SpacesCloseButton() {
  return (
    <Paper
      style={{
        height: 40,
        width: 40,
        borderRadius: 20,
        position: "fixed",
        right: 16,
        top: 24,
        backgroundColor: colors.spacesChatButton,
        backdropFilter: colors.backdrop,
      }}
      onClick={reset}
    >
      <IconButton style={{ width: "100%", height: "100%" }}>
        <Undo />
      </IconButton>
    </Paper>
  );
}
