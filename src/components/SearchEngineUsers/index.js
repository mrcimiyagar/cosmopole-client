import * as React from "react";
import { Grid, Paper, Typography, Zoom } from "@mui/material";
import uiEvents from '../../config/ui-events.json';
import { publish } from "../../core/bus";
import { readUsers } from "../../core/callables/users";
import { colors } from "../../config/colors";
import { blue, green, purple, red, yellow } from "@mui/material/colors";

export default function SearchEngineUsers({ onItemSelected, show, query }) {
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    readUsers(data => {
      setUsers(data);
    }, 0, 100, query);
  }, [query]);
  return (
    <Grid container style={{ width: "100%" }}>
      {users.map((user, index) => {
        let avatarBackColor = user.avatarBackColor;
        return (
          <Grid item xs={4} style={{ paddingLeft: 8, paddingRight: 8 }} onClick={() => {
            onItemSelected();
            publish(uiEvents.NAVIGATE, { navigateTo: 'UserProfile', user: user });
          }}>
            <Zoom key={'search_engine_users_' + index} in={show} timeout={250} style={{ transitionDelay: `${index * 50} ms` }}>
              <div style={{ width: '100%', height: 128, position: 'relative' }}>
                <Paper
                  elevation={8}
                  sx={{
                    bgcolor: avatarBackColor < 2 ? blue[400] :
                      avatarBackColor < 4 ? purple[400] :
                        avatarBackColor < 6 ? red[400] :
                          avatarBackColor < 8 ? green[400] :
                            yellow[600]
                  }}
                  style={{
                    position: 'relative',
                    borderRadius: 16, width: '100%', height: 'calc(100% - 48px)',
                    paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
                  }}>
                  <Typography variant={'h3'} style={{ color: '#fff', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    {user.firstName.substring(0, 1).toUpperCase()}
                  </Typography>
                </Paper>
                <Typography style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: colors.textPencil,
                  fontSize: 14,
                  marginTop: 12,
                  width: '100%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {user.firstName + ' ' + user.lastName}
                </Typography>
              </div>
            </Zoom>
          </Grid>
        );
      })}
      <div style={{ width: '100%', height: 112 }} />
    </Grid>
  );
}
