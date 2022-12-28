import { AllOut, ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  Zoom,
} from "@mui/material";
import React from "react";
import MainTransition from "../../components/MainTransition";
import Header from "../../data/photos/sample-room.png";
import Wallpaper from "../../data/photos/profile-background.webp";
import { colors } from '../../config/colors';
import Avatar1 from "../../data/photos/avatar-1.png";
import ChatSection from '../../sections/Chat';
import uiEvents from '../../config/ui-events.json';
import { publish } from "../../core/bus";

export default function People({ destroy }) {
  const [open, setOpen] = React.useState(true);
  const [chatOpen, setChatOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      publish(uiEvents.BACK, {});
    }, 125);
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
            backgroundColor: "#fff",
            boxShadow: "none",
            position: "relative",
            zIndex: 3,
          },
        }}
        fullScreen
        open={open}
        TransitionComponent={MainTransition}
      >
        <Toolbar
          style={{
            width: "100%",
            position: "absolute",
          }}
        >
          <IconButton onClick={handleClose}>
            <ArrowBack style={{ fill: colors.black }} />
          </IconButton>
          <Typography
            variant={"h6"}
            style={{
              color: colors.black,
              position: "relative",
              zIndex: 2,
            }}
          >
            {"People in the room"}
          </Typography>
          <div style={{ flex: 1 }} />
        </Toolbar>
        <Paper
          elevation={6}
          style={{
            borderRadius: "24px 24px 0px 0px",
            height: "calc(100% - 56px)",
            width: "100%",
            position: "fixed",
            left: 0,
            top: 56,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex'
          }}
        >
          <img
            alt={"profile-background"}
            src={Wallpaper}
            style={{
              position: "fixed",
              left: 0,
              top: 56,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: '24px 24px 0px 0px'
            }}
          />
          <div style={{ position: 'relative' }}>
            <Paper
              style={{
                width: "calc(100% - 32px)",
                height: window.innerWidth - 112 + "px",
                marginLeft: 16,
                marginTop: 16,
                borderRadius: 24,
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                  borderRadius: 24,
                }}
                alt={"post-header"}
                src={Header}
              />
            </Paper>
            <Typography variant={'h5'} style={{ color: '#333', marginLeft: 16, marginTop: 12, marginBottom: 8, fontWeight: 'bold', width: 'calc(100% - 32px)', textAlign: 'center' }}>
              Class A2
            </Typography>
            {['Entire Room', 'Workspace 1', 'Workspace 2', 'Workspace 3', 'Workspace 4'].map(title => (
              <Paper style={{ borderRadius: 0, width: '100%', marginTop: 16, backgroundColor: 'rgba(255, 255, 255, 0.35)' }}>
                <Paper style={{ borderRadius: 0, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.35)', paddingTop: 8, paddingBottom: 8 }}>
                  <Typography style={{ color: '#333', fontWeight: 'bold', marginLeft: 16 }} variant={'h6'}>
                    {title}
                  </Typography>
                </Paper>
                <div style={{ width: '100%', height: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 16 }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <Zoom in={true} style={{ transitionDelay: i * 100 }}>
                      <div>
                        <Paper elevation={8} style={{ width: 80, height: 80, padding: 4, borderRadius: 40, position: 'relative', marginTop: 16, marginRight: 8, marginLeft: 8, background: colors.semiTransparentPaper }}>
                          <Paper elevation={4} style={{ width: '100%', height: '100%', borderRadius: 40 }}>
                            <Avatar
                              src={Avatar1}
                              style={{ width: '100%', height: '100%' }}
                              onClick={() => setChatOpen(true)}
                            />
                          </Paper>
                        </Paper>
                        <Typography style={{ width: 96, textAlign: 'center', marginTop: 4 }}>
                          Amanda
                        </Typography>
                      </div>
                    </Zoom>
                  ))}
                  <Zoom in={true} style={{ transitionDelay: 12 * 100 }}>
                    <div>
                      <Paper elevation={8} style={{ width: 80, height: 80, padding: 4, borderRadius: 40, position: 'relative', marginTop: 16, marginLeft: 8, marginRight: 8, background: colors.semiTransparentPaper }}>
                        <Paper elevation={4} style={{ width: '100%', height: '100%', borderRadius: 40 }}>
                          <IconButton
                            style={{ backgroundColor: '#fff', width: '100%', height: '100%', border: '5px solid lightgray' }}
                          >
                            <AllOut style={{ width: 40, height: 40 }} />
                          </IconButton>
                        </Paper>
                      </Paper>
                      <Typography style={{ width: 96, textAlign: 'center', marginTop: 4 }}>
                        More
                      </Typography>
                    </div>
                  </Zoom>
                </div>
              </Paper>
            ))}
            <div style={{ width: '100%', height: 112 }} />
          </div>
        </Paper >
      </Dialog >
      {chatOpen ? <ChatSection destroy={() => setChatOpen(false)} /> : null}
    </div >
  );
}
