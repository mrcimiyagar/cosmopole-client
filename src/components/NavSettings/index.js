import { Edit } from '@mui/icons-material';
import { Button, Fab, Paper, Skeleton, Switch, Typography } from '@mui/material';
import { yellow } from '@mui/material/colors';
import React, { useEffect, useRef } from 'react';
import { colors, setThemeId, themeId } from '../../config/colors';
import { me } from '../../core/memory';
import CosmoSwitch from '../CosmoSwitch';
import { useAuth0 } from '@auth0/auth0-react';
import { db } from '../../core/storage/setup';
import { resetCore } from '../../core/setup';
import { getBackToAuth } from '../../App';
import Coin from '../Coin';

const headerHeight = 250;

export default function NavSettings({ dbLoaded }) {
    const { isAuthenticated, isLoading, loginWithRedirect, user, getAccessTokenSilently, logout } = useAuth0();
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{
                    width: '100%', height: headerHeight, position: 'absolute', zIndex: 2,
                    left: 0, top: 0, background: `linear-gradient(0deg, ${colors.paper} 0%, rgba(0,0,0,0) 60%)`
                }}>
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                        <Coin key={'settings'} isProfile={true} />
                    </div>
                    <Typography variant={'h5'} style={{
                        fontWeight: 'bold', color: colors.textPencil, position: 'absolute',
                        bottom: 0, left: '50%', top: 200, transform: 'translateX(-50%)'
                    }}>
                        {me.firstName + ' ' + me.lastName}
                    </Typography>
                </div>
                <div style={{
                    background: colors.paper, width: '100%', position: 'absolute', height: 'auto',
                    left: 0, top: headerHeight, zIndex: 2, minHeight: '100%'
                }}>
                    {
                        dbLoaded ? (
                            <div style={{ marginLeft: -16, width: '100%', height: '100%', position: 'relative' }}>
                                <Paper elevation={0} style={{
                                    backgroundColor: colors.floatingCard, display: 'flex', padding: 8,
                                    width: 'calc(100% - 48px)', height: 'auto', marginLeft: 32,
                                    marginTop: 32, borderRadius: 8
                                }}>
                                    <Typography style={{ paddingTop: 8, marginLeft: 4, color: colors.textPencil }}>
                                        Night Mode
                                    </Typography>
                                    <div style={{ flex: 1 }} />
                                    <CosmoSwitch checked={themeId === 'DARK'} onChange={e => {
                                        localStorage.setItem('theme', e.target.checked ? 'DARK' : 'LIGHT');
                                        var metaThemeColor = document.querySelector("meta[name=theme-color]");
                                        metaThemeColor.setAttribute("content", e.target.checked ? '#282828' : '#1e88e5');
                                        setThemeId(e.target.checked ? 'DARK' : 'LIGHT');
                                    }} />
                                </Paper>
                                <Button style={{ width: 'calc(100% - 32px)', height: 64, marginLeft: 32, marginTop: 32 }} onClick={() => {
                                    if (window.confirm('do you want to logout ?')) {
                                        localStorage.clear();
                                        db.destroy().then(function () {
                                            resetCore();
                                            getBackToAuth();
                                            logout();
                                        });
                                    }
                                }}>
                                    Logout
                                </Button>
                                <Fab
                                    size={'medium'}
                                    variant={'extended'}
                                    onClick={() => {

                                    }}
                                    sx={{
                                        bgcolor: yellow[600]
                                    }}
                                    style={{
                                        position: "fixed",
                                        right: 16,
                                        bottom: 16,
                                        zIndex: 2
                                    }}
                                >
                                    <Edit />
                                    <div style={{ marginLeft: 8 }}>
                                        Edit Profile
                                    </div>
                                </Fab>
                            </div>
                        ) :
                            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s, index) => (
                                <div key={'nav_eye_skeleton_' + index} style={{ width: 'calc(100% - 80px)', height: 'auto', display: 'flex', paddingLeft: 32, marginTop: index === 0 ? -16 : 32 }}>
                                    <Skeleton animation={"wave"} variant={"circular"} height={56} width={56} />
                                    <div style={{ width: 'calc(100% - 64px)', marginLeft: 16, marginTop: 16 }}>
                                        <Skeleton animation={"wave"} height={10} style={{ marginBottom: 6, width: '100%' }} />
                                        <Skeleton animation={"wave"} height={10} width="60%" />
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>
            <div style={{ width: '100%', height: 56 }} />
        </div>
    );
}
