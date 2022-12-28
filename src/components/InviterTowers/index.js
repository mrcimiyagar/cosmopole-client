import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Fade, Typography } from "@mui/material";
import { SmartToy } from "@mui/icons-material";
import useForceUpdate from "../../utils/ForceUpdate";
import { roomsDict, towersList } from "../../core/memory";
import { colors } from "../../config/colors";

export default function InviterTowers({ onItemSelected, show }) {
  return (
    <List
      style={{
        width: "100%",
        height: 'calc(100% - 56px)',
        overflowY: 'auto',
        position: 'absolute',
        left: 0,
        top: 56,
      }}
    >
      {towersList.map((tower) => (
        <Fade in={show} timeout={750}>
          <ListItem onClick={() => { onItemSelected(tower); }}>
            <ListItemAvatar>
              <Avatar>
                <SmartToy style={{ fill: '#444' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography style={{ color: colors.textPencil }}> {tower.title}</Typography>}
              secondary={<Typography style={{ color: colors.textPencil }}>{roomsDict[tower.id].length + ' rooms'}</Typography>}
            />
          </ListItem>
        </Fade>
      ))}
    </List>
  );
}
