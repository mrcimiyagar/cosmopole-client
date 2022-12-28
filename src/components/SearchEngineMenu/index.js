import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import { colors } from "../../config/colors";
import { Fade, Typography } from "@mui/material";
import { comsoToolbarHeight } from "../CosmoToolbar";

export default function SearchEngineMenu({ onItemSelected, show }) {
  return (
    <List
      sx={{ width: "100%" }}
    >
      {[
        "posts",
        "messages",
        "photos",
        "audios",
        "videos",
        "bots",
        "spaces",
        "rooms",
        "users"
      ].map((item, index) => (
        <Fade key={'search_engine_menu_' + index} in={show} timeout={750}>
          <ListItem onClick={() => onItemSelected(index + 1)}>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon style={{fill: '#444'}} />
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
