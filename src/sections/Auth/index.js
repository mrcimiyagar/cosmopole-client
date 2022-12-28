import { Button, CircularProgress, Fab, InputBase, Paper, Typography, Zoom } from "@mui/material";
import React, { useEffect } from "react";
import Sign from '../../data/photos/logo-transparent.png';
import Done from '@mui/icons-material/Done';
import { setup, verify } from '../../core/callables/auth';
import { colors } from "../../config/colors";
import { useAuth0 } from '@auth0/auth0-react';
import LottieSticker from "../../components/LottieSticker";
import { blue, green, yellow } from "@mui/material/colors";
import { AccessibilityNew, EmojiPeople } from "@mui/icons-material";
import './index.scss';

export default function Auth() {
    const [state, setState] = React.useState({
        show: false,
        firstname: '',
        lastname: '',
        accessToken: undefined
    });
    let { isAuthenticated, isLoading, loginWithRedirect, user, getAccessTokenSilently, logout } = useAuth0();
    useEffect(() => {
        if (isAuthenticated && !state.accessToken) {
            getAccessTokenSilently().then(at => {
                setTimeout(() => {
                    setState({ ...state, accessToken: at });
                }, 2000);
            });
        }
    }, [isAuthenticated]);
    useEffect(() => {
        if (state.accessToken) {
            verify(state.accessToken, (res) => {
                if (!res.session) {
                    setTimeout(() => {
                        setState({ ...state, show: true });
                    }, 250);
                }
            });
        }
    }, [state.accessToken]);
    if (isLoading) {
        return (
            <div style={{ width: '100%', height: '100%', background: colors.paper }} />
        );
    }
    console.log(isAuthenticated);
    return !isAuthenticated ? (
        <div style={{ width: '100%', height: '100%', background: colors.paper }}>
            <div style={{
                width: 'calc(100% - 64px)',
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                <div style={{
                    position: 'fixed',
                    left: '50%',
                    top: 'calc(50% - 144px)',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <LottieSticker size={250} stickerKey={'city.json'} clickCallback={() => { }} />
                </div>
                <Typography style={{
                    marginTop: 176,
                    width: '100%',
                    textAlign: 'center',
                    color: colors.textPencil
                }}>
                    Welcome to <b style={{ color: blue[400] }}>Cosmopole</b>
                </Typography>
                <Fab
                    variant={'extended'}
                    style={{
                        marginTop: 24,
                        width: 'calc(100% - 64px)',
                        marginLeft: 32,
                        backgroundColor: blue[600],
                        backdropFilter: colors.backdrop,
                        fontWeight: 'bold',
                        color: '#fff'
                    }}
                    onClick={() => {
                        if (!isAuthenticated) {
                            loginWithRedirect();
                        }
                    }}
                >
                    <AccessibilityNew style={{ fill: '#fff', marginRight: 8 }} />
                    Login / Signup
                </Fab>
                <Fab
                    variant={'extended'}
                    style={{
                        marginTop: 24,
                        width: 'calc(100% - 64px)',
                        marginLeft: 32,
                        backgroundColor: green[600],
                        backdropFilter: colors.backdrop,
                        fontWeight: 'bold',
                        color: '#fff'
                    }}
                    onClick={() => {
                        if (!isAuthenticated) {
                            alert('feature comming soon');
                        }
                    }}
                >
                    <EmojiPeople style={{ fill: '#fff', marginRight: 8 }} />
                    Guest Mode
                </Fab>
            </div>
        </div>
    ) : (
        <div style={{ width: window.innerWidth + 'px', height: '100%', overflow: 'hidden' }}>
            <div className="night" style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0 }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (<div className="shooting_star" />))}
            </div>
            <div style={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: 350,
                width: '85%',
                height: 260
            }}>
                <Zoom in={state.show} style={{ transitionDelay: state.show ? 500 : 0 }}>
                    <Paper elevation={12} style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: colors.semiTransparentPaper,
                        backdropFilter: 'blur(10px)',
                        borderRadius: 8
                    }}>
                        {
                            isAuthenticated ? (
                                <Typography style={{ width: '100%', padding: '7.5%', color: colors.textPencil }} variant='subtitle1'>
                                    Your data is secured !<br />
                                    Now tell me your firstname & lastname.<br />
                                </Typography>
                            ) : null
                        }
                        {
                            isAuthenticated ? (
                                <div style={{
                                    width: '85%',
                                    marginLeft: '7.5%',
                                    marginTop: -8
                                }}>
                                    <Paper elevation={0} style={{
                                        width: '100%',
                                        height: 48,
                                        backgroundColor: colors.floatingCard,
                                        borderRadius: 12
                                    }}>
                                        <InputBase
                                            value={state.firstname}
                                            onChange={(event) => setState({ ...state, firstname: event.target.value })}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                paddingLeft: 16,
                                                paddingRight: 16,
                                                color: colors.textPencil
                                            }}
                                            placeholder={'Firstname'} />
                                    </Paper>
                                    <Paper elevation={0} style={{
                                        width: '100%',
                                        height: 48,
                                        backgroundColor: colors.floatingCard,
                                        borderRadius: 12,
                                        marginTop: 16
                                    }}>
                                        <InputBase
                                            value={state.lastname}
                                            onChange={(event) => setState({ ...state, lastname: event.target.value })}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                paddingLeft: 16,
                                                paddingRight: 16,
                                                color: colors.textPencil
                                            }}
                                            placeholder={'Lastname ( Optional )'} />
                                    </Paper>
                                </div>
                            ) : null
                        }
                    </Paper>
                </Zoom>
            </div>
            <div style={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + 84px), calc(-50% - 56px - 56px - 24px - 16px))`,
            }}>
                <Zoom in={state.show} style={{ transitionDelay: state.show ? 250 : 0 }}>
                    <Paper elevation={12} style={{
                        background:
                            "linear-gradient(315deg, rgba(81, 45, 168, 1) 33%, rgba(103, 58, 183, 0.75) 100%)",
                        backdropFilter: 'blur(10px)',
                        width: 112,
                        height: 112,
                        borderRadius: 56
                    }}>
                        <img style={{ width: 'calc(100% - 32px)', height: 'calc(100% - 32px)', margin: 16 }} alt={'sign'} src={Sign} />
                    </Paper>
                </Zoom>
            </div>
            <div style={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, calc(-50% + 128px))`,
            }}>
                <Zoom in={state.show} style={{ transitionDelay: state.show ? 750 : 0 }}>
                    <Fab
                        elevation={12}
                        sx={{ bgcolor: yellow[600] }}
                        style={{
                            backdropFilter: 'blur(10px)'
                        }}
                        onClick={() => {
                            if (isAuthenticated) {
                                setTimeout(async () => {
                                    if (state.firstname && state.firstname.length > 0 && state.firstname.length < 64) {
                                        setState({ ...state, show: false });
                                        setup(state.accessToken, state.firstname, state.lastname);
                                    } else {
                                        alert('first name is necessary and it must be less than 64 characters.');
                                    }
                                }, 250);
                            }
                        }}>
                        <Done />
                    </Fab>
                </Zoom>
            </div>
        </div>
    );
}
