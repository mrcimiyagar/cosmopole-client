import {
  Divider,
  Fab,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  Add,
  ArrowBack,
} from "@mui/icons-material";
import { colors } from "../../config/colors";
import { publish } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { enterTower } from "../../core/callables/auth";
import { roomsDict } from "../../core/memory";
import { yellow } from "@mui/material/colors";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import BaseSection from "../../utils/SectionEssentials";
import updates from '../../core/network/updates.json';
import topics from '../../core/events/topics.json';

let RoomItem = ({ room }) => {
  return (
    <div style={{ width: '100%', marginTop: -4 }}>
      <ListItem alignItems="flex-start" style={{ position: 'relative' }} onClick={() => {
        publish(uiEvents.NAVIGATE, { navigateTo: 'Room', room: room });
      }}>
        <ListItemAvatar>
          <Paper
            style={{
              width: 56,
              height: 56,
              borderRadius: '25%',
              background:
                "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)",
            }}
          >
            <Typography style={{ color: '#fff', textAlign: 'center', fontSize: 25, fontWeight: 'bold', paddingTop: 10 }}>{room.title.substring(0, 1).toUpperCase()}</Typography>
          </Paper>
        </ListItemAvatar>
        <ListItemText
          style={{ marginLeft: 12, marginTop: 12 }}
          primary={
            <React.Fragment>
              <Typography
                sx={{
                  display: "inline",
                  fontWeight: 'bold',
                  fontSize: 17,
                  color: colors.textPencil
                }}
                component="span"
              >
                {
                  room.title
                }
              </Typography>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <Typography
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  paddingRight: 8,
                  color: colors.textPencil
                }}
                variant={'body2'}
              >
                This is a sample tower for pople to collaborate.
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" style={{ marginTop: 4, marginLeft: 16, width: 'calc(100% - 32px)' }} />
    </div >
  );
}

export default class Rooms extends BaseSection {
  componentDidMount() {
    super.componentDidMount();
    enterTower(this.props.tower.id);
    this.wire(updates.NEW_ROOM, () => this.forceUpdate());
    this.wire(topics.ROOM_CREATED, () => this.forceUpdate());
  }
  render() {
    let { tower } = this.props;
    let title = (tower.secret?.isContact ? (tower.contact.firstName + ' ' + tower.contact.lastName) : tower.title);
    return this.renderWrapper(
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <div
            style={{
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
              height: 80 + comsoToolbarHeight,
            }}
          >
            <Toolbar style={{ transform: `translateY(${comsoToolbarHeight}px)` }}>
              <IconButton onClick={() => {
                this.close(true);
              }}>
                <ArrowBack style={{ fill: colors.textPencil }} />
              </IconButton>
              <Paper
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background:
                    tower.secret?.isContact ?
                      "linear-gradient(315deg, rgba(245, 124, 0, 1) 33%, rgba(255, 152, 0, 0.75) 100%)" :
                      "linear-gradient(315deg, rgba(194, 24, 91, 1) 33%, rgba(233, 30, 99, 0.75) 100%)"
                }}
              >
                <Typography style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold', paddingTop: 6 }}>{title.substring(0, 1).toUpperCase()}</Typography>
              </Paper>
              <div
                style={{
                  flex: 1,
                  marginLeft: 8,
                }}>
                <Typography
                  style={{
                    textAlign: "left",
                    color: colors.textPencil,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  style={{
                    textAlign: "left",
                    color: colors.textPencil,
                  }}
                  variant={"subtitle2"}
                >
                  {tower.secret?.isContact ? 'contact' : 'group'}
                </Typography>
              </div>
            </Toolbar>
          </div>
          <Paper
            elevation={6}
            style={{
              borderRadius: "24px 24px 0px 0px",
              height: `calc(100% - 56px - ${comsoToolbarHeight}px)`,
              width: "100%",
              position: "absolute",
              left: 0,
              top: 56 + comsoToolbarHeight,
              backgroundColor: colors.paper
            }}
          >
            {
              roomsDict[tower.id]?.sort((r1, r2) => {
                return r1.title.localeCompare(r2.title)
              }).map((room, index) => {
                return (
                  <RoomItem key={'nav_city_rooms_list_' + index} room={room} />
                )
              })
            }
            <Fab sx={{ bgcolor: yellow[600] }} style={{ position: 'fixed', bottom: 24, right: 24 }}
              onClick={() => {
                publish(uiEvents.NAVIGATE, { navigateTo: 'CreateRoomDlg', towerId: tower.id });
              }}>
              <Add />
            </Fab>
          </Paper>
        </div>
    );
  }
}
