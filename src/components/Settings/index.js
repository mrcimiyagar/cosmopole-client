import {
  AppBar,
  Dialog,
  Divider,
  Fab,
  IconButton,
  Paper,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { ArrowBack, ArrowForwardIos, MoreVert } from "@mui/icons-material";
import { colors } from "../../config/colors";
import MainTransition from "../../components/MainTransition";
import { styled } from "@mui/material/styles";
import SampleSticker from "../../data/photos/sample-sticker.png";

import LabelIcon from "@mui/icons-material/Label";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import LanguageIcon from "@mui/icons-material/Language";
import NightlightIcon from "@mui/icons-material/Nightlight";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import uiEvents from '../../config/ui-events.json';
import { publish } from "../../core/bus";
import { comsoToolbarHeight } from "../CosmoToolbar";

export let closeSettings = () => { };

const headerHeight = 400;

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  position: 'absolute',
  right: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function Settings(props) {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      publish(uiEvents.BACK, {});
    }, 125);
  };
  closeSettings = () => {
    setOpen(false);
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative"
      }}
    >
      <div
        style={{
          height: "calc(100% - 56px)",
          width: "100%",
          position: "fixed",
          left: 0,
          top: comsoToolbarHeight,
        }}
      >
        <Typography style={{ marginLeft: 16 }}>Appearance</Typography>
        <Paper
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 0,
            paddingTop: 12,
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              paddingBottom: 8,
              paddingLeft: 8,
              paddingRight: 8,
              height: 48,
            }}
          >
            <Paper
              elevation={6}
              style={{
                marginLeft: 8,
                backgroundColor: '#9C27B0',
                padding: 4,
                borderRadius: 8,
                width: 24,
                height: 24,
                marginTop: 4
              }}
            >
              <DarkModeIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography style={{ marginLeft: 16, marginTop: 8 }}>
              Dark Theme
            </Typography>
            <div style={{ flex: 1 }} />
            <Android12Switch style={{ position: 'absolute', right: 16 }} />
          </div>
          <Divider style={{ marginBottom: 8 }} />
          <div
            style={{
              width: "100%",
              display: "flex",
              paddingBottom: 12,
              paddingLeft: 8,
              paddingRight: 8,
              height: 48,
            }}
          >
            <Paper
              elevation={6}
              style={{
                marginLeft: 8,
                backgroundColor: '#3F51B5',
                padding: 4,
                borderRadius: 8,
                width: 24,
                height: 24,
                marginTop: 4
              }}
            >
              <ColorLensIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography style={{ marginLeft: 16, marginTop: 8 }}>
              Theme Colors
            </Typography>
            <div style={{ position: 'absolute', right: 8 }}>
              <Fab
                style={{
                  padding: 4,
                  backgroundColor: colors.paper,
                  marginRight: 8,
                }}
                size={"small"}
              >
                <div
                  style={{
                    width: 40,
                    height: 32,
                    backgroundColor: "#303F9F",
                    borderRadius: 20,
                  }}
                />
              </Fab>
              <Fab
                style={{
                  padding: 4,
                  backgroundColor: colors.paper,
                  marginRight: 8,
                }}
                size={"small"}
              >
                <div
                  style={{
                    width: 40,
                    height: 32,
                    backgroundColor: "#C2185B",
                    borderRadius: 20,
                  }}
                />
              </Fab>
              <Fab
                style={{
                  padding: 4,
                  backgroundColor: colors.paper,
                  marginRight: 8,
                }}
                size={"small"}
              >
                <div
                  style={{
                    width: 40,
                    height: 32,
                    backgroundColor: "#FFA000",
                    borderRadius: 20,
                  }}
                />
              </Fab>
              <Fab
                style={{
                  padding: 4,
                  backgroundColor: colors.pen,
                  marginRight: 8,
                }}
                size={"small"}
              >
                <ArrowForwardIos style={{ fill: "#fff" }} />
              </Fab>
            </div>
          </div>
          <Divider style={{ marginBottom: 8 }} />
          <div
            style={{
              width: "100%",
              display: "flex",
              paddingBottom: 12,
              paddingLeft: 8,
              paddingRight: 8,
              height: 48,
            }}
          >
            <Paper
              elevation={6}
              style={{
                marginLeft: 8,
                backgroundColor: '#E91E63',
                padding: 4,
                borderRadius: 8,
                width: 24,
                height: 24,
                marginTop: 4
              }}
            >
              <NightlightIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography style={{ marginLeft: 16, marginTop: 8 }}>
              Night Hours
            </Typography>
            <Typography
              style={{ marginTop: 12, position: 'absolute', right: 16 }}
              variant={"subtitle2"}
            >
              19:00 PM
            </Typography>
          </div>
        </Paper>
        <Typography style={{ marginLeft: 16, marginTop: 16 }}>
          Language & Emojis
        </Typography>
        <Paper
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 0,
            paddingTop: 12,
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              paddingBottom: 8,
              paddingLeft: 8,
              paddingRight: 8,
              height: 48,
            }}
          >
            <Paper
              elevation={6}
              style={{
                marginLeft: 8,
                backgroundColor: '#FF5722',
                padding: 4,
                borderRadius: 8,
                width: 24,
                height: 24,
                marginTop: 4
              }}
            >
              <LanguageIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography style={{ marginLeft: 16, marginTop: 8 }}>
              Language
            </Typography>
            <div style={{ flex: 1 }} />
            <Typography
              style={{ marginTop: 12, position: 'absolute', right: 16 }}
              variant={"subtitle2"}
            >
              English
            </Typography>
          </div>
          <Divider style={{ marginBottom: 8 }} />
          <div
            style={{
              width: "100%",
              display: "flex",
              paddingBottom: 12,
              paddingLeft: 8,
              paddingRight: 8,
              height: 48,
            }}
          >
            <Paper
              elevation={6}
              style={{
                marginLeft: 8,
                backgroundColor: '#673AB7',
                padding: 4,
                borderRadius: 8,
                width: 24,
                height: 24,
                marginTop: 4
              }}
            >
              <EmojiEmotionsIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography style={{ marginLeft: 16, marginTop: 8 }}>
              Emojis
            </Typography>
            <div style={{ position: 'absolute', right: 8, display: 'flex' }}>
              <Typography
                style={{ marginTop: 4, marginRight: 8 }}
                variant={"h6"}
              >
                😂
              </Typography>
              <Typography
                style={{ marginTop: 4, marginRight: 8 }}
                variant={"h6"}
              >
                😊
              </Typography>
              <Typography
                style={{ marginTop: 4, marginRight: 8 }}
                variant={"h6"}
              >
                😍
              </Typography>
            </div>
          </div>
          <Divider style={{ marginBottom: 8 }} />
          <div
            style={{
              width: "100%",
              display: "flex",
              paddingBottom: 12,
              paddingLeft: 8,
              paddingRight: 8,
              height: 48,
            }}
          >
            <Paper
              elevation={6}
              style={{
                marginLeft: 8,
                backgroundColor: '#009688',
                padding: 4,
                borderRadius: 8,
                width: 24,
                height: 24,
                marginTop: 4
              }}
            >
              <LabelIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography style={{ marginLeft: 16, marginTop: 8 }}>
              Stickers
            </Typography>
            <div style={{ flex: 1 }} />
            <img
              style={{ width: 40, height: 40, position: 'absolute', right: 16 }}
              alt={"sample-sticker"}
              src={SampleSticker}
            />
          </div>
        </Paper>
        <Typography style={{ marginLeft: 16, marginTop: 16 }}>
          Sounds & Notifications
        </Typography>
        <Paper
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 0,
            paddingTop: 12,
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              paddingBottom: 8,
              paddingLeft: 8,
              paddingRight: 8,
              height: 48,
            }}
          >
            <Paper
              elevation={6}
              style={{
                marginLeft: 8,
                backgroundColor: '#FFC107',
                padding: 4,
                borderRadius: 8,
                width: 24,
                height: 24,
                marginTop: 4
              }}
            >
              <NotificationsIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography style={{ marginLeft: 16, marginTop: 8 }}>
              Notifications
            </Typography>
            <div style={{ flex: 1 }} />
          </div>
          <Divider style={{ marginBottom: 8 }} />
          <div
            style={{
              width: "100%",
              display: "flex",
              paddingBottom: 12,
              paddingLeft: 8,
              paddingRight: 8,
              height: 48,
            }}
          >
            <Paper
              elevation={6}
              style={{
                marginLeft: 8,
                backgroundColor: '#2196F3',
                padding: 4,
                borderRadius: 8,
                width: 24,
                height: 24,
                marginTop: 4
              }}
            >
              <VolumeUpIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography style={{ marginLeft: 16, marginTop: 8 }}>
              Sounds
            </Typography>
            <div style={{ flex: 1 }} />
          </div>
        </Paper>
      </div>
    </div>
  );
}
