import {
  Avatar,
  Card,
  Dialog,
  Fab,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Zoom,
} from "@mui/material";
import React, { useEffect } from "react";
import MainTransition from "../../components/MainTransition";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { colors } from "../../config/colors";
import CalcSample from '../../data/photos/calculator-sample.png';

export let closeSpaceProfile = () => { };

export default function BotApplet(props) {
  const [open, setOpen] = React.useState(true);
  const [showToolbox, setShowToolbox] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setTimeout(props.destroy, 250);
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            backdropFilter: 'blur(10px)',
            boxShadow: "none",
            position: "relative",
            zIndex: 3,
            overflowX: "hidden",
          },
        }}
        fullScreen
        open={open}
        TransitionComponent={MainTransition}
      >
        <div
          elevation={6}
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            left: 0,
            top: 0,
            transform: showToolbox ? "translateX(-300px)" : "translateX(0px)",
            transition: "transform 0.5s",
          }}
        >
          <div style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}>
            <Zoom
              in={true}
              style={{ transitionDelay: 400 }}
            >
              <Paper elevation={12} style={{ borderRadius: 24, width: 'calc(100% - 32px)', height: 'calc(100% - 144px)', marginLeft: 16, marginTop: 72 }}>
                <img style={{ borderRadius: 24, width: '100%', height: '100%' }} alt={'applet-sample'} src={CalcSample} />
              </Paper>
            </Zoom>
          </div>
          <Toolbar
            style={{
              width: "100%",
              position: "fixed",
              top: 0,
              left: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
            }}
          >
            <IconButton onClick={handleClose}>
              <ArrowBack style={{ fill: colors.paper }} />
            </IconButton>
          </Toolbar>
          {showToolbox ? (
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.33)",
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 99999,
                opacity: showToolbox ? 1 : 0,
              }}
              onClick={() => setShowToolbox(false)}
            />
          ) : null}
        </div>
      </Dialog>
    </div>
  );
}
