import { ArrowBack, Audiotrack, Description, InsertPhoto, LocationCity, OndemandVideo, People, Search, Settings } from "@mui/icons-material";
import {
  Button,
  Card,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  Zoom,
} from "@mui/material";
import * as React from "react";
import { colors } from "../../config/colors";
import SearchEngineMenu from '../../components/SearchEngineMenu';
import SearchEngineBots from "../../components/SearchEngineBots";
import { publish, restoreState, saveState } from "../../core/bus";
import filterEmpty from "../../utils/EmptyChecker";
import SearchEngineTowers from "../../components/SearchEngineTowers";
import SearchEngineUsers from "../../components/SearchEngineUsers";
import generatePage from "../../utils/PageGenerator";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import { blue, green, grey, purple, red, yellow } from "@mui/material/colors";
import { towersList, usersDict } from "../../core/memory";
import uiEvents from '../../config/ui-events.json';

export let closeExplore = () => { };

export default function Explore({ transitionFlag, defaultSection }) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [pageId, setPageId] = React.useState(0);
  const [query, setQuery] = React.useState('');
  return (
    <div
      style={{
        overflow: "hidden",
        position: 'relative',
        height: '100%',
        overflowY: 'auto',
        backdropFilter: colors.backdrop
      }}
    >
      <Card style={{ width: '100%', height: 176, borderRadius: 0, background: colors.floatingCardSolid }}>
        <div
          style={{
            width: 'calc(100% - 16px)',
            marginLeft: 8,
            height: 'auto',
            paddingTop: 48
          }}>
          <Typography style={{ color: colors.textPencil, marginLeft: 16, color: colors.textPencil }} variant={'h6'}>
            What do you want to find ?
          </Typography>
          <TextField
            variant="standard"
            style={{
              width: 'calc(100% -  96px)',
              marginLeft: 16,
              marginTop: 16
            }}
            placeholder="Search Cosmopole..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            sx={{
              input: {
                color: colors.textPencil,
                borderBottom: `1px solid ${colors.textPencil}`,
              },
            }}
          />
          <IconButton style={{ marginLeft: -40, marginTop: 8 }}>
            <Search style={{ fill: colors.textPencil }} />
          </IconButton>
        </div>
      </Card>
      <div style={{ width: '100%', height: 'auto', paddingTop: 24, paddingLeft: 16, paddingRight: 16, background: colors.semiPaper, minHeight: '100%' }}>
        <div style={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', marginTop: 0 }}>
          <Button variant={'outlined'} style={{ borderRadius: 24, backgroundColor: colors.paper, borderColor: colors.textPencil2 }}>
            <Description style={{ marginRight: 4, width: 18, height: 18, fill: colors.textPencil2 }} />
            <Typography style={{ fontSize: 10, marginTop: 2, color: colors.textPencil2 }}>
              Documents
            </Typography>
          </Button>
          <Button
            variant={'outlined'}
            style={{ borderRadius: 24, backgroundColor: colors.paper, borderColor: colors.textPencil2, marginLeft: 8 }}
            onClick={() => {
              setPageId(9);
            }}
          >
            <People style={{ marginRight: 4, width: 18, height: 18, fill: colors.textPencil2 }} />
            <Typography style={{ fontSize: 10, marginTop: 2, color: colors.textPencil2 }}>
              Users
            </Typography>
          </Button>
          <Button variant={'outlined'} style={{ borderRadius: 24, backgroundColor: colors.paper, borderColor: colors.textPencil2, marginLeft: 8 }}
            onClick={() => {
              setPageId(7);
            }}>
            <LocationCity style={{ marginRight: 4, width: 18, height: 18, fill: colors.textPencil2 }} />
            <Typography style={{ fontSize: 10, marginTop: 2, color: colors.textPencil2 }}>
              Towers
            </Typography>
          </Button>
        </div>
        <div style={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <Button variant={'outlined'} style={{ borderRadius: 24, backgroundColor: colors.paper, borderColor: colors.textPencil2 }}>
            <InsertPhoto style={{ marginRight: 4, width: 18, height: 18, fill: colors.textPencil2 }} />
            <Typography style={{ fontSize: 10, marginTop: 2, color: colors.textPencil2 }}>
              Images
            </Typography>
          </Button>
          <Button variant={'outlined'} style={{ borderRadius: 24, backgroundColor: colors.paper, borderColor: colors.textPencil2, marginLeft: 8 }}>
            <Audiotrack style={{ marginRight: 4, width: 18, height: 18, fill: colors.textPencil2 }} />
            <Typography style={{ fontSize: 10, marginTop: 2, color: colors.textPencil2 }}>
              Audios
            </Typography>
          </Button>
          <Button variant={'outlined'} style={{ borderRadius: 24, backgroundColor: colors.paper, borderColor: colors.textPencil2, marginLeft: 8 }}>
            <OndemandVideo style={{ marginRight: 4, width: 18, height: 18, fill: colors.textPencil2 }} />
            <Typography style={{ fontSize: 10, marginTop: 2, color: colors.textPencil2 }}>
              Videos
            </Typography>
          </Button>
        </div>
        <div style={{ width: '100%', height: 'auto', marginTop: 32 }}>
          {pageId === 7 ? <SearchEngineTowers show={pageId === 7} onItemSelected={() => { saveState('Explore', { pageId, tabIndex }, '0'); }} /> : null}
          {pageId === 1 ? <SearchEngineBots show={pageId === 1} onItemSelected={() => { saveState('Explore', { pageId, tabIndex }, '0'); }} /> : null}
          {pageId === 9 ? <SearchEngineUsers query={query} show={pageId === 9} onItemSelected={() => { saveState('Explore', { pageId, tabIndex }, '0'); }} /> : null}
        </div>
      </div>
      {
        pageId === 0 ? (
          <div style={{ width: '100%', height: 'auto', position: 'absolute', left: 0, top: 300 }}>
            <Typography style={{ color: colors.textPencil, marginLeft: 16 }} variant={'h5'}>
              My Circle
            </Typography>
            <Typography style={{ color: colors.textPencil, marginLeft: 16, marginTop: 16 }} variant={'h6'}>
              Users
            </Typography>
            <div style={{ width: '100%', overflow: 'auto', marginTop: 8 }}>
              <div style={{ width: 1000, display: 'flex', height: 'auto' }}>
                <div style={{ width: 8, height: 8 }} />
                {
                  Object.values(usersDict).map((user, index) => {
                    let avatarBackColor = user.avatarBackColor;
                    return (
                      <Zoom key={'search_engine_users_' + index} in={true} timeout={250} style={{ transitionDelay: `${index * 50} ms` }}>
                        <div style={{ width: 100, height: 150, position: 'relative' }}>
                          <Paper
                            onClick={() => {
                              publish(uiEvents.NAVIGATE, { navigateTo: 'UserProfile', user: user });
                            }}
                            elevation={8}
                            sx={{
                              bgcolor: avatarBackColor < 2 ? blue[400] :
                                avatarBackColor < 4 ? purple[400] :
                                  avatarBackColor < 6 ? red[400] :
                                    avatarBackColor < 8 ? green[400] :
                                      yellow[600]
                            }}
                            style={{
                              marginLeft: 8,
                              position: 'relative',
                              borderRadius: 16, width: 84, height: 'calc(100% - 64px)',
                              paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
                            }}>
                            <Typography variant={'h3'} style={{ color: '#fff', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                              {user.firstName.substring(0, 1).toUpperCase()}
                            </Typography>
                          </Paper>
                          <Typography style={{ color: colors.textPencil, fontSize: 14, marginTop: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>{user.firstName + ' ' + user.lastName}</Typography>
                        </div>
                      </Zoom>
                    );
                  })
                }
              </div>
            </div>
            <Typography style={{ color: colors.textPencil, marginLeft: 16 }} variant={'h6'}>
              Towers
            </Typography>
            <div style={{ width: '100%', overflow: 'auto', marginTop: 8 }}>
              <div style={{ width: 1000, display: 'flex', height: 'auto' }}>
                <div style={{ width: 8, height: 8 }} />
                {
                  towersList.map((tower, index) => {
                    return (
                      <Zoom key={'search_engine_users_' + index} in={true} timeout={250} style={{ transitionDelay: `${index * 50} ms` }}>
                        <div style={{ width: 100, height: 150, position: 'relative' }}>
                          <Paper
                            onClick={() => {
                              publish(uiEvents.NAVIGATE, { navigateTo: 'TowerProfile', tower: tower });
                            }}
                            elevation={8}
                            sx={{
                              bgcolor: blue[400]
                            }}
                            style={{
                              marginLeft: 8,
                              position: 'relative',
                              borderRadius: 16, width: 84, height: 'calc(100% - 64px)',
                              paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
                            }}>
                            <Typography variant={'h3'} style={{
                              color: '#fff', position: 'absolute', left: '50%', top: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}>
                              {tower.title.substring(0, 1).toUpperCase()}
                            </Typography>
                          </Paper>
                          <Typography style={{ color: colors.textPencil, fontSize: 14, marginTop: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>{tower.title}</Typography>
                        </div>
                      </Zoom>
                    );
                  })
                }
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  );
}
