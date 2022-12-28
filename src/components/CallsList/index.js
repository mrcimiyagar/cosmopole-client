import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Call from "@mui/icons-material/Call";
import IconButton from "@mui/material/IconButton";
import { setupScrollListenerForContainer } from "../../utils/ScrollHelper";
import { activeCalls, callHistoryList, workspacesDictById } from "../../core/memory";
import { blue, green, purple, red, yellow } from "@mui/material/colors";
import { publish, subscribe, unsubscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import useForceUpdate from "../../utils/ForceUpdate";
import updates from '../../core/network/updates.json';
import { colors } from "../../config/colors";
import Coin from "../Coin";
import { comsoToolbarHeight } from "../CosmoToolbar";

export default function CallsList() {
  const forceUpdate = useForceUpdate();
  React.useEffect(() => {
    setupScrollListenerForContainer('callsScrollContainer', '0');
    let tokenActiveCallsSync = subscribe(updates.ON_ACTIVE_CALLS_SYNC, () => {
      forceUpdate();
    });
    let tokenCallCreation = subscribe(updates.ON_CALL_CREATE, ({ workspaceId }) => {
      forceUpdate();
    });
    let tokenCallDestruction = subscribe(updates.ON_CALL_DESTRUCT, ({ workspaceId }) => {
      forceUpdate();
    });
    return () => {
      unsubscribe(tokenCallCreation);
      unsubscribe(tokenCallDestruction);
      unsubscribe(tokenActiveCallsSync);
    }
  }, []);
  return (
    <div style={{ width: "100%", position: 'relative' }}>
      <div style={{ width: '100%', height: 232, backdropFilter: colors.backdrop, position: 'relative' }}>
        <img
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          src={'https://i.pinimg.com/564x/46/90/b5/4690b59cc8a5b7fe30a8694a49919398.jpg'}
        />
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <Coin Icon={Call} key={'calls'} />
        </div>
        <Typography variant={'h6'} style={{ paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8, color: '#fff', borderRadius: 8, background: 'rgba(0, 0, 0, 0.35)', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, calc(-50% + 88px))' }}>
          Calls
        </Typography>
      </div>
      <List
        id={'callsScrollContainer'}
        style={{
          width: "100%",
          minHeight: window.innerHeight - comsoToolbarHeight + 'px',
          background: colors.paper
        }}
      >
        {
          Object.keys(activeCalls).length > 0 ? (
            <Typography variant={'subtitle2'} style={{ fontWeight: 'bold', paddingLeft: 16, color: colors.textPencil }}>
              Active
            </Typography>
          ) : null
        }
        {
          Object.keys(activeCalls).map((workspaceId, index) => {
            let w = workspacesDictById[workspaceId];
            let name = w.tower?.secret?.isContact ?
              (w.tower?.contact?.firstName + w.tower?.contact?.lastName) :
              (w.title);
            let workspaceAvatarColor = w.avatarBackColor;
            if (w)
              return (
                <div key={'calls_list_active_' + index} style={{ width: '100%' }}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <div style={{ position: 'relative' }}>
                        <Avatar alt="Remy Sharp" sx={{
                          bgcolor:
                            workspaceAvatarColor < 2 ? blue[400] :
                              workspaceAvatarColor < 4 ? purple[400] :
                                workspaceAvatarColor < 6 ? red[400] :
                                  workspaceAvatarColor < 8 ? green[400] :
                                    yellow[600]
                        }}>
                          {name.substring(0, 1).toUpperCase()}
                        </Avatar>
                        {
                          activeCalls[workspaceId] ? (
                            <div style={{ position: 'absolute', bottom: 0, right: 8 }}
                              className={'ripple'}
                            >
                              <Call style={{ width: '100%', height: '100%', fill: '#fff' }} />
                            </div>
                          ) : null
                        }
                      </div>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            style={{ color: colors.textPencil }}
                          >
                            {name}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            style={{ color: colors.textPencil }}
                          >
                            1 member
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <IconButton onClick={() => {
                      publish(uiEvents.OPEN_CALL, { user: workspacesDictById[workspaceId]?.tower?.contact, workspace: workspacesDictById[workspaceId] });
                    }}>
                      <Call style={{ color: colors.textPencil }} />
                    </IconButton>
                  </ListItem>
                  <Divider key={'calls_list_divider_' + index} variant="inset" component="li" />
                </div>
              )
          })
        }
        <Typography variant={'subtitle2'} style={{ fontWeight: 'bold', paddingLeft: 16, marginTop: 16, color: colors.textPencil }}>
          History
        </Typography>
        {
          callHistoryList.map((call, index) => {
            let now = new Date(call.time);
            let w = workspacesDictById[call.workspaceId];
            let name = w.tower?.secret?.isContact ?
              (w.tower?.contact?.firstName + w.tower?.contact?.lastName) :
              (w.title);
            let workspaceAvatarColor = w.avatarBackColor;
            if (w)
              return (
                <div key={'calls_list_' + index} style={{ width: '100%' }}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" sx={{
                        bgcolor:
                          workspaceAvatarColor < 2 ? blue[400] :
                            workspaceAvatarColor < 4 ? purple[400] :
                              workspaceAvatarColor < 6 ? red[400] :
                                workspaceAvatarColor < 8 ? green[400] :
                                  yellow[600]
                      }}>
                        {name.substring(0, 1).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            style={{ color: colors.textPencil }}
                          >
                            {name}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            style={{ color: colors.textPencil }}
                          >
                            {now.toDateString() + ' ' + now.toTimeString().substring(0, 5)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <IconButton onClick={() => {
                      publish(uiEvents.OPEN_CALL, { user: w.tower?.contact, workspace: w });
                    }}>
                      <Call style={{ fill: colors.textPencil }} />
                    </IconButton>
                  </ListItem>
                  <Divider key={'calls_list_divider_' + index} variant="inset" component="li" />
                </div>
              )
          })
        }
        <div style={{ width: '100%', height: 112 }} />
      </List>
    </div>
  );
}
