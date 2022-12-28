import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import { colors } from "../../config/colors";
import { Fade, Typography } from "@mui/material";
import { SmartToy } from "@mui/icons-material";
import { comsoToolbarHeight } from "../CosmoToolbar";

export default function SearchEngineBots({ onItemSelected, show }) {
  return (
    <List
      sx={{ width: "100%" }}
      style={{
        position: 'absolute',
        left: 0,
        top: 116 + comsoToolbarHeight,
        height: 'calc(100% - 116px)',
        overflow: 'auto'
      }}
    >
      {[
        "calculator bot",
        "bot 2",
        "bot 3",
        "bot 4",
        "bot 5",
        "bot 6",
        "bot 7",
        "bot 8",
      ].map((item, index) => (
        <Fade key={'search_engine_bots_' + index} in={show} timeout={750}>
          <ListItem onClick={() => onItemSelected(item)}>
            <ListItemAvatar>
              <Avatar>
                <SmartToy style={{fill: '#444'}} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography style={{ color: colors.textPencil }}>{item}</Typography>}
              secondary={<Typography style={{ color: colors.textPencil }}>{`21 items`}</Typography>}
            />
          </ListItem>
        </Fade>
      ))}
      <div style={{width: '100%', height: 112}} />
    </List>
  );
}
