import { Avatar, Paper, Typography } from "@mui/material";
import React from "react";
import { colors } from "../../config/colors";
import RoomAvatar from '../../data/photos/sample-room.png'

export function showSpacesProfileTag() {}

export function hideSpacesProfileTag() {}

export default function SpacesProfileTag({onClick, room}) {
  return (
    <Paper
      style={{
        height: 40,
        borderRadius: "20px 20px 20px 20px",
        position: "fixed",
        left: 16,
        top: 24,
        backgroundColor: colors.profileTag,
        backdropFilter: colors.backdrop,
        display: "flex",
      }}
      onClick={onClick}
    >
      <Avatar style={{ width: 40, height: 40 }} alt={room.title} />
      <Typography style={{ marginRight: 12, marginLeft: 8, marginTop: 8 }}>
        {room.title}
      </Typography>
    </Paper>
  );
}
