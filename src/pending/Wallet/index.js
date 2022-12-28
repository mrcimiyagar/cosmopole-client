import {
  Dialog,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import Wallpaper from "../../data/photos/profile-background.webp";
import {
  ArrowBack,
} from "@mui/icons-material";
import { colors } from "../../config/colors";
import MainTransition from "../../components/MainTransition";
import Coin from "../../components/Coin";
import BarChartIcon from "@mui/icons-material/BarChart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SellIcon from "@mui/icons-material/Sell";
import SendIcon from "@mui/icons-material/Send";
import InventoryIcon from "@mui/icons-material/Inventory";
import CoinChart from "../../components/CoinChart";
import { publish } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';

export let closeUserProfile = () => {};

export default function Wallet(props) {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      publish(uiEvents.BACK, {});
    }, 125);
  };
  closeUserProfile = () => {
    setOpen(false);
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
            backgroundColor: "transparent",
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
        <img
          alt={"profile-background"}
          src={Wallpaper}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Paper
          style={{
            borderRadius: "50%",
            width: "calc(100% + 224px)",
            height: 300,
            marginLeft: -112,
            marginTop: -186,
            backgroundColor: colors.semiTransparentPaper,
            backdropFilter: colors.backdrop,
          }}
        >
          <Typography
            variant={"h3"}
            style={{ marginTop: 196, textAlign: "center", color: "#673AB7" }}
          >
            IFi
          </Typography>
        </Paper>
        <div style={{marginTop: -32}}>
          <Coin />
        </div>
        <Paper
        elevation={8}
          style={{
            width: "calc(100% - 64px)",
            paddingTop: 32,
            marginLeft: 32,
            backgroundColor: colors.semiTransparentPaper,
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            marginTop: -16
          }}
        >
          <CoinChart />
        </Paper>
        <Toolbar
          style={{
            width: "100%",
            position: "absolute",
            top: 8,
          }}
        >
          <IconButton onClick={handleClose}>
            <ArrowBack style={{ fill: colors.black }} />
          </IconButton>
          <div style={{ flex: 1 }} />
          <IconButton
            onClick={() => {
              //props.onAddToRoomSelected();
            }}
          >
            <BarChartIcon style={{ fill: colors.black }} />
          </IconButton>
        </Toolbar>
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 24,
            transform: "translateX(-50%)",
            display: "flex",
          }}
        >
          <div>
            <Paper
              varaint={6}
              style={{
                backgroundColor: "#1976D2",
                padding: 16,
                borderRadius: 16,
              }}
            >
              <SellIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography
              style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 8,
              }}
              variant={"subtitle1"}
            >
              Sell
            </Typography>
          </div>
          <div
            style={{
              marginLeft: 16,
            }}
          >
            <Paper
              varaint={6}
              style={{
                backgroundColor: "#00796B",
                padding: 16,
                borderRadius: 16,
              }}
            >
              <LocalMallIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography
              style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 8,
              }}
              variant={"subtitle1"}
            >
              Buy
            </Typography>
          </div>
          <div
            style={{
              marginLeft: 16,
            }}
          >
            <Paper
              varaint={6}
              style={{
                backgroundColor: "#FFA000",
                padding: 16,
                borderRadius: 16,
              }}
            >
              <SendIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography
              style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 8,
              }}
              variant={"subtitle1"}
            >
              Send
            </Typography>
          </div>
          <div
            style={{
              marginLeft: 16,
            }}
          >
            <Paper
              varaint={6}
              style={{
                backgroundColor: "#E64A19",
                padding: 16,
                borderRadius: 16,
              }}
            >
              <InventoryIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography
              style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 8,
              }}
              variant={"subtitle1"}
            >
              Stake
            </Typography>
          </div>
          <div
            style={{
              marginLeft: 16,
            }}
          >
            <Paper
              varaint={6}
              style={{
                backgroundColor: "#303F9F",
                padding: 16,
                borderRadius: 16,
              }}
            >
              <StorefrontIcon style={{ fill: "#fff" }} />
            </Paper>
            <Typography
              style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 8,
              }}
              variant={"subtitle1"}
            >
              NFT
            </Typography>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
