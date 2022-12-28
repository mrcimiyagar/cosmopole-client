import { Notifications } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import React from "react";
import { colors } from "../../config/colors";

export function showSpacesNotifButton() {}

export function hideSpacesNotifButton() {}

export default function SpacesNotifButton(props) {
  return (
    <Paper
      style={{
        height: 40,
        width: 40,
        borderRadius: 20,
        position: "fixed",
        right: 16 + 40 + 16 + 40 + 16,
        top: 24,
        backgroundColor: colors.spacesSwitchButton,
        backdropFilter: colors.backdrop,
      }}
    >
      <IconButton style={{ width: "100%", height: "100%" }}>
        <Notifications />
      </IconButton>
    </Paper>
  );
}
