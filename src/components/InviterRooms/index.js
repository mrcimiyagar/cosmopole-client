import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Fade, Typography } from "@mui/material";
import { SmartToy } from "@mui/icons-material";
import useForceUpdate from "../../utils/ForceUpdate";
import { dbFindInviteByInfo } from "../../core/storage/invites";
import { roomsDict } from "../../core/memory";
import { colors } from "../../config/colors";

let invitesStatus = {};

export default function InviterRooms({ tower, onItemSelected, show, invitingUser }) {
  const forceUpdate = useForceUpdate();
  const recheckInvites = () => {
    invitesStatus = {};
    (async function () {
      const rs = roomsDict[tower.id];
      for (let i = 0; i < rs.length; i++) {
        const room = rs[i];
        console.log(room);
        let invite = await dbFindInviteByInfo(invitingUser.id, room.id);
        if (invite !== null) {
          invitesStatus[room.id] = true;
        }
      }
      forceUpdate();
    })();
  };
  return (
    <List
      style={{
        width: "100%",
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 56,
        overflowY: 'auto'
      }}
    >
      {roomsDict[tower.id].map((room) => (
        <Fade in={show} timeout={750}>
          <ListItem style={{ opacity: invitesStatus[room.id] === true ? 0.5 : 1 }} onClick={() => {
            if (invitingUser) {
              dbFindInviteByInfo(invitingUser.id, room.id).then(invite => {
                if (invite === null) {
                  onItemSelected(room);
                  recheckInvites();
                }
              });
            } else {
              onItemSelected(room);
            }
          }}>
            <ListItemAvatar>
              <Avatar>
                <SmartToy style={{ fill: '#444' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography style={{ color: colors.textPencil }}> {room.title}</Typography>}
              secondary={<Typography style={{ color: colors.textPencil }}>{'23 members'}</Typography>}
            />
          </ListItem>
        </Fade>
      ))}
    </List>
  );
}
