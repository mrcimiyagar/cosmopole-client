import {
  Avatar,
  Card,
  Fab,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  LocationCity,
  MeetingRoom,
  People,
  PersonAdd,
  Segment,
  Settings,
  Star,
} from "@mui/icons-material";
import CSLogo from "../../data/photos/space-header.jpg";
import PushPinIcon from "@mui/icons-material/PushPin";
import PdfIcon from "../../data/photos/pdf.png";
import VideoSample from "../../data/photos/video-sample.png";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Zoom,
} from "@mui/material";
import React, { useEffect } from "react";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { colors } from "../../config/colors";
import Folder from "@mui/icons-material/Folder";
import Task from "@mui/icons-material/Task";
import { Close, PlayArrow } from "@mui/icons-material";
import Floors from "../../components/Floors";
import generatePage from "../../utils/PageGenerator";
import { blue, green, purple, red, yellow } from "@mui/material/colors";
import BaseSection from "../../utils/SectionEssentials";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import { publish } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { readUserById } from "../../core/callables/users";
import { me, roomsDict, usersDict } from "../../core/memory";
import { Box } from "@mui/system";
import { dbFetchRoomMemberships } from "../../core/storage/spaces";
import { fetchCurrentRoomId } from "../../core/storage/auth";
import LottieSticker from "../../components/LottieSticker";

export let closeSpaceProfile = () => { };

let UserItem = ({ userId }) => {
  const [user, setUser] = React.useState(usersDict[userId]);
  React.useEffect(() => {
    if (!user) {
      readUserById(userId, u => {
        setUser(u);
      });
    }
  }, []);
  if (!user) {
    return null;
  }
  let avatarBackColor = user.avatarBackColor;
  return (
    <Grid item xs={3}>
      <div style={{ width: '100%', height: 128, position: 'relative' }}>
        <div
          style={{
            width: '100%', height: 'calc(100% - 48px)',
            paddingTop: (window.innerWidth / 3 - 16) / 2 - 64 + 'px'
          }}>
          <Paper style={{ width: 72, height: 72, borderRadius: '50%', marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
            <Avatar style={{ width: '100%', height: '100%' }} sx={{
              bgcolor:
                avatarBackColor < 2 ? blue[400] :
                  avatarBackColor < 4 ? purple[400] :
                    avatarBackColor < 6 ? red[400] :
                      avatarBackColor < 8 ? green[400] :
                        yellow[600]
            }}>
              <Typography style={{
                alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#fff',
                position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%'
              }}>
                {user.firstName?.substring(0, 1).toUpperCase()}
              </Typography>
            </Avatar>
          </Paper>
        </div>
        <Typography
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            marginTop: 4,
            width: '100%',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            color: colors.textPencil
          }}>
          {me.id === user.id ? 'me' : user.firstName}
        </Typography>
        <Typography style={{ fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center', color: colors.textPencil }}>human</Typography>
      </div>
    </Grid>
  );
};

let PeopleMenu = ({ towerId }) => {
  const [members, setMembers] = React.useState([]);
  useEffect(() => {
    (async () => {
      let rooms = roomsDict[towerId];
      let mTemp = {};
      for (let i = 0; i < rooms.length; i++) {
        (await dbFetchRoomMemberships(rooms[i].id)).forEach(member => {
          mTemp[member.userId] = member;
        });
      }
      setMembers(Object.values(mTemp));
    })();
  }, []);
  return (
    <Box
      sx={{ width: '100%', height: 400 }}
      role="presentation"
    >
      <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, backgroundColor: 'grey', top: 12 }} />
      <Typography style={{ paddingLeft: 24, paddingTop: 32, fontWeight: 'b0ld', color: colors.textPencil }} variant={'h6'}>
        People in the tower
      </Typography>
      <Grid container spacing={3} style={{ padding: 24 }}>
        <UserItem userId={me.id} />
        {
          members.map(member => {
            return (
              <UserItem userId={member.userId} />
            );
          })
        }
        <Grid item xs={12}>
          <div style={{ height: 48, width: '100%' }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default class TowerProfile extends BaseSection {
  constructor(props) {
    super(props);
  }
  render() {
    let { tower } = this.props;
    return this.renderWrapper(
      <div
        style={{
          width: "100%",
          height: `calc(100% - ${comsoToolbarHeight}px)`,
          position: "fixed",
          left: 0,
          top: comsoToolbarHeight,
          zIndex: 3,
          backdropFilter: colors.backdrop,
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <div style={{ width: '100%', height: 316, position: 'relative' }}>
            <img
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
              src={'https://i.pinimg.com/564x/46/90/b5/4690b59cc8a5b7fe30a8694a49919398.jpg'}
            />
            <Card
              style={{
                borderRadius: '50%',
                padding: 4,
                width: 144,
                height: 144,
                position: "absolute",
                left: '50%',
                top: 'calc(50% - 40px)',
                transform: 'translate(-50%, -50%)',
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: blue[400]
                }}
                style={{ width: "100%", height: "100%", fontWeight: 'bold', fontSize: 35 }}
              >
                {tower.title.substring(0, 1)}
              </Avatar>
            </Card>
            <Typography variant={'h6'} style={{ paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8, color: '#fff', borderRadius: 8, background: 'rgba(0, 0, 0, 0.35)', position: 'absolute', left: '50%', top: 'calc(50% + 56px)', transform: 'translate(-50%, -50%)' }}>
              {tower.secret?.isContact ? (tower.contact.firstName + ' ' + tower.contact.lastName) : tower.title}
            </Typography>
            <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'absolute', top: 240 }}>
              <Fab size={'small'} sx={{ bgcolor: yellow[600] }} style={{ margin: 8 }}
                onClick={() => {
                  publish(uiEvents.OPEN_DRAWER_MENU, {
                    view: <PeopleMenu towerId={tower.id} />,
                    openDrawer: true
                  });
                }}>
                <People />
              </Fab>
              <Fab size={'small'} sx={{ bgcolor: yellow[600] }} style={{ margin: 8 }}
                onClick={() => {
                  publish(uiEvents.NAVIGATE, { navigateTo: 'Rooms', tower: tower });
                }}>
                <LocationCity />
              </Fab>
              <Fab size={'small'} sx={{ bgcolor: yellow[600] }} style={{ margin: 8 }}>
                <PersonAdd />
              </Fab>
              <Fab size={'small'} sx={{ bgcolor: yellow[600] }} style={{ margin: 8 }}>
                <Settings />
              </Fab>
            </div>
          </div>
          <div style={{
            width: '100%', height: 'auto', minHeight: 'calc(100% - 316px)', position: 'relative',
            background: colors.semiTransparentPaper
          }}>
            <div style={{
              position: 'absolute',
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 32,
              paddingRight: 32,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: 24,
              background: colors.textAntiPencil
            }}>
              <LottieSticker size={200} stickerKey={'emptyBox.json'} clickCallback={() => { }} />
              <Typography variant={'h6'} style={{ color: colors.textPencil }}>
                Tower wall is empty
              </Typography>
            </div>
          </div>
          <Toolbar
            style={{
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
            }}
          >
            <IconButton onClick={() => this.close(true)}>
              <ArrowBack style={{ fill: '#fff' }} />
            </IconButton>
          </Toolbar>
        </div>
      </div>
    );
  }
}
