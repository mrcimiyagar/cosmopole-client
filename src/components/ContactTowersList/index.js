import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React from "react";
import { enterRoom, enterTower } from "../../core/callables/auth";
import { towers } from "../../core/mirrors";
import { dbFindFirstRoomOfTower } from '../../core/storage/spaces';
import SampleRoomIcon from '../../data/photos/sample-room.png';

export default function ContactTowersList({ openRoom }) {
  return (
    <div style={{ width: "100%", height: "100%", position: 'relative', overflowY: 'auto' }}>
      <List style={{ height: 'auto' }}>
        {
          towers().filter(tower => tower.secret.isContact).map(tower => {
            return (
              <ListItem button onClick={() => {
                enterTower(tower.id);
                dbFindFirstRoomOfTower(tower.id).then(room => {
                  openRoom(room.id, tower.id);
                  enterRoom(room.id);
                });
              }} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Sample Room" src={SampleRoomIcon} />
                </ListItemAvatar>
                <ListItemText
                  primary={tower.contact !== undefined ? (tower.contact.firstName + ' ' + tower.contact.lastName) : '-'}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        contact
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            );
          })
        }
      </List>
      <div style={{width: '100%', height: 256}} />
    </div >
  );
}
