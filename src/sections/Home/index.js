import React, { useState, useEffect, useRef, useCallback } from 'react';
import HomeBottomNavigation from '../../components/HomeBottomNavigation';
import NavCity from '../../components/NavCity';
import NavEye from "../../components/NavEye";
import NavMessages from '../../components/NavMessages';
import { publish } from '../../core/bus';
import uiEvents from '../../config/ui-events.json';
import Coin from "../../components/Coin";
import { subscribe, unsubscribe } from "../../core/bus";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ForumIcon from '@mui/icons-material/Forum';
import topics from '../../core/events/topics.json';
import { isDbLoaded } from "../../core/setup";
import { Avatar, Card, Divider, Fab, Fade, IconButton, ListItem, ListItemAvatar, ListItemText, Paper, Slide, TextField, Typography, Zoom } from '@mui/material';
import { Add, ArrowBackIos, ArrowForwardIos, Call, Close, CloseFullscreen, Done, DoneAll, Edit, Face2, Feed, InsertPhoto, LocationCity, Notifications, OpenInFull, People, PlayCircleOutline, RssFeed, SdStorage, Search, Settings, SmartToy, Tag, Timelapse, VolumeUp, Widgets, Workspaces } from '@mui/icons-material';
import ExploreIcon from '@mui/icons-material/Explore';
import { blue, green, purple, red, yellow } from '@mui/material/colors';
import NavSettings from '../../components/NavSettings';
import { colors, themeId } from '../../config/colors';
import useForceUpdate from '../../utils/ForceUpdate';
import { me, membershipsDict, membershipsDictByTowerId, messagesDict, roomsDict, towersDictById, towersList, usersDict, workspacesDict } from '../../core/memory';
import { comsoToolbarHeight } from '../../components/CosmoToolbar';
import { fetchCurrentTowerId, saveCurrentTowerId } from '../../core/storage/auth';
import Rooms from '../Rooms';
import ChatsList from '../../components/ChatsList';
import HomeLightWallpaper from '../../styles/home-wallpaper-light';
import HomeDarkWallpaper from '../../styles/home-wallpaper-dark';
import CallsList from '../../components/CallsList';
import Explore from '../Explore';
import NavFeed from '../../components/NavFeed';
import updates from '../../core/network/updates.json';
import { replaceAll } from '../..';
import emojis from '../../core/storage/emojis';
import formatDate from '../../utils/DateFormatter';
import { fetchMyHomeId } from '../../core/storage/me';
import { dbFetchRoomMemberships } from '../../core/storage/spaces';

let selectedNav = undefined;
export let forceHomeUpdate;

let TowerItem = ({ tower, type, onTowerSelected, isSelected }) => {
    let title = tower.secret.isContact ?
        (tower.contact?.firstName + ' ' + tower.contact?.lastName) :
        tower.title;
    return (
        <div style={{ width: '100%', display: 'flex', marginTop: 12, }}>
            <Zoom in={isSelected}>
                <Card style={{ borderRadius: '0px 8px 8px 0px', background: colors.primary, height: 48, width: 6, marginLeft: -8 }} />
            </Zoom>
            <Fade in={true}>
                <Paper
                    onClick={() => {
                        onTowerSelected(tower);
                    }}
                    style={{
                        width: 48,
                        height: 48,
                        marginLeft: isSelected ? 4 : 2,
                        borderRadius: '25%',
                        background:
                            type === 'group' ?
                                "linear-gradient(315deg, rgba(194, 24, 91, 1) 33%, rgba(233, 30, 99, 0.75) 100%)" :
                                "linear-gradient(315deg, rgba(245, 124, 0, 1) 33%, rgba(255, 152, 0, 0.75) 100%)"
                    }}
                >
                    <Typography style={{ color: '#fff', textAlign: 'center', fontSize: 25, fontWeight: 'bold', paddingTop: 8 }}>{title.substring(0, 1).toUpperCase()}</Typography>
                </Paper>
            </Fade>
        </div >
    );
}

let TowerItemOut = ({ tower, type, onTowerSelected, isSelected, isLast, isExpandedDark, activeNavId, expandedMode }) => {
    const lastMessageRef = React.useRef();
    let title = tower.secret.isContact ?
        (tower.contact?.firstName + ' ' + tower.contact?.lastName) :
        tower.title;
    let workspace = workspacesDict[roomsDict[tower.id][0].id][0];
    let message = workspace.lastMessage;
    if (message) {
        message.time = Number(message.time);
    }
    React.useEffect(() => {
        let text = message?.text;
        if (text) {
            Object.keys(emojis).forEach(key => {
                text = replaceAll(text, `:${key}:`, `<img src='${emojis[key]}' alt='${key}' width='18' height='18' />`);
            });
            lastMessageRef.current.innerHTML = '<b>' + usersDict[message?.authorId]?.firstName + '</b>: ' + text;
        }
    }, [message?.text]);
    let objectMessageColor = isExpandedDark ? blue[200] : blue[600];
    return (
        <ListItem button style={{ width: (!activeNavId && !expandedMode) ? 'calc(100% + 24px)' : '100%', display: 'flex', marginTop: 8, marginLeft: (!activeNavId && !expandedMode) ? -12 : 0 }} disablePadding
            onClick={() => {
                onTowerSelected(tower);
            }}>
            <Zoom in={isSelected}>
                <Card style={{ borderRadius: '0px 8px 8px 0px', background: colors.primary, height: 48, width: 6, marginLeft: -8 }} />
            </Zoom>
            <Fade in={true}>
                <div style={{ width: '100%', position: 'relative' }}>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <Paper
                            style={{
                                width: 48,
                                height: 48,
                                marginLeft: isSelected ? 4 : 2,
                                borderRadius: '25%',
                                background:
                                    type === 'home' ?
                                        "linear-gradient(315deg, rgba(0, 121, 107, 1) 0%, rgba(0, 150, 136, 0.5) 100%)"
                                        : type === 'group' ?
                                            "linear-gradient(315deg, rgba(194, 24, 91, 1) 33%, rgba(233, 30, 99, 0.75) 100%)" :
                                            "linear-gradient(315deg, rgba(245, 124, 0, 1) 33%, rgba(255, 152, 0, 0.75) 100%)"
                            }}
                        >
                            <Typography style={{ color: '#fff', textAlign: 'center', fontSize: 25, fontWeight: 'bold', paddingTop: 8 }}>{title.substring(0, 1).toUpperCase()}</Typography>
                        </Paper>
                        <div style={{ width: 'calc(100% - 96px)' }}>
                            <Typography style={{ paddingLeft: 10, paddingTop: 4, color: colors.textPencil, fontSize: 14, fontWeight: 'bold' }}>{title}</Typography>
                            <div style={{ paddingLeft: 10, marginTop: -2 }}>
                                {
                                    message?.type === 'service' ? (
                                        <div style={{
                                            display: 'flex',
                                            color: colors.textPencil,
                                            fontSize: 12,
                                            width: '100%'
                                        }}>
                                            <Typography
                                                ref={lastMessageRef}
                                                style={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    height: 20,
                                                    width: '100%',
                                                    color: colors.textPencil,
                                                    paddingRight: 24,
                                                    fontSize: 12
                                                }}
                                                variant={'body2'}
                                            >
                                                {message.text}
                                            </Typography>
                                        </div>
                                    ) : message?.type === 'workspace' ? (
                                        <div style={{
                                            display: 'flex',
                                            color: colors.textPencil
                                        }}>
                                            <Typography style={{ fontWeight: 'bold', marginTop: 2, fontSize: 12 }}>{usersDict[message?.authorId]?.firstName}</Typography>:
                                            <Workspaces style={{ fill: objectMessageColor, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                                            <Typography
                                                ref={lastMessageRef}
                                                style={{ display: "inline", color: objectMessageColor, fontSize: 12, marginTop: -1 }}
                                            >
                                                Workspace
                                            </Typography>
                                        </div>
                                    ) : message?.type === 'storage' ? (
                                        <div style={{
                                            display: 'flex',
                                            color: colors.textPencil,
                                        }}>
                                            <Typography style={{ fontWeight: 'bold', marginTop: 2, fontSize: 12 }}>{usersDict[message?.authorId]?.firstName}</Typography>:
                                            <SdStorage style={{ fill: objectMessageColor, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                                            <Typography
                                                ref={lastMessageRef}
                                                style={{ display: "inline", color: objectMessageColor, fontSize: 12, marginTop: -1 }}
                                            >
                                                Storage
                                            </Typography>
                                        </div>
                                    ) : message?.type === 'sticker' ? (
                                        <div style={{
                                            display: 'flex',
                                            color: colors.textPencil,
                                            fontSize: 12
                                        }}>
                                            <Typography style={{ fontWeight: 'bold', marginTop: 2, fontSize: 12 }}>{usersDict[message?.authorId]?.firstName}</Typography>:
                                            <Face2 style={{ fill: objectMessageColor, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                                            <Typography
                                                ref={lastMessageRef}
                                                style={{ display: "inline", color: objectMessageColor, fontSize: 12, marginTop: -1 }}
                                            >
                                                Sticker
                                            </Typography>
                                        </div>
                                    ) : message?.docType === 'image' ? (
                                        <div style={{
                                            display: 'flex',
                                            color: colors.textPencil
                                        }}>
                                            <Typography style={{ fontWeight: 'bold', marginTop: 2, fontSize: 12 }}>{usersDict[message?.authorId]?.firstName}</Typography>:
                                            <InsertPhoto style={{ fill: objectMessageColor, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                                            <Typography
                                                ref={lastMessageRef}
                                                style={{ display: "inline", color: objectMessageColor, fontSize: 12, marginTop: -1 }}
                                            >
                                                Photo
                                            </Typography>
                                        </div>
                                    ) : message?.docType === 'audio' ? (
                                        <div style={{
                                            display: 'flex',
                                            color: colors.textPencil
                                        }}>
                                            <Typography style={{ fontWeight: 'bold', marginTop: 2, fontSize: 12 }}>{usersDict[message?.authorId]?.firstName}</Typography>:
                                            <VolumeUp style={{ fill: objectMessageColor, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                                            <Typography
                                                ref={lastMessageRef}
                                                style={{ display: "inline", color: objectMessageColor, fontSize: 12, marginTop: -1 }}
                                            >
                                                Audio
                                            </Typography>
                                        </div>
                                    ) : message?.docType === 'video' ? (
                                        <div style={{
                                            display: 'flex',
                                            color: colors.textPencil
                                        }}>
                                            <Typography style={{ fontWeight: 'bold', fontWeight: 'bold', marginTop: 2, fontSize: 12 }}>{usersDict[message?.authorId]?.firstName}</Typography>:
                                            <PlayCircleOutline style={{ fill: objectMessageColor, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                                            <Typography
                                                ref={lastMessageRef}
                                                style={{ display: "inline", color: objectMessageColor, fontSize: 12, marginTop: -1 }}
                                            >
                                                Video
                                            </Typography>
                                        </div>
                                    ) : message?.type === 'text' ? (
                                        <Typography
                                            ref={lastMessageRef}
                                            style={{
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                height: 20,
                                                color: colors.textPencil,
                                                paddingRight: 24,
                                                fontSize: 12
                                            }}
                                            variant={'body2'}
                                        >
                                        </Typography>
                                    ) : null
                                }
                            </div>
                        </div>
                    </div>
                    {
                        !isLast ? (
                            <Divider style={{ width: 'calc(100% - 72px)', marginLeft: 56, marginTop: type === 'home' ? 8 : 4, background: colors.textPencil3 }} />
                        ) : null
                    }
                    <Typography variant={'caption'} style={{ fontSize: 11, position: 'absolute', right: 48, top: 4, color: colors.textPencil }}>
                        {message?.time ? (formatDate(message.time) + ' ' + (new Date(message.time)).toTimeString().substring(0, 5)) : ''}
                    </Typography>
                    <Typography variant={'caption'} style={{ position: 'absolute', right: 48, bottom: 0 }}>
                        {
                            message?.authorId === me.id ?
                                message?.status === 'created' ?
                                    message?.seen ?
                                        (
                                            <DoneAll
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 8,
                                                    fill: colors.textPencil
                                                }}
                                            />
                                        ) : (
                                            <Done
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 8,
                                                    fill: colors.textPencil
                                                }}
                                            />
                                        ) : (
                                        <Timelapse
                                            style={{
                                                width: 16,
                                                height: 16,
                                                marginLeft: 8,
                                                fill: colors.textPencil
                                            }}
                                        />
                                    ) :
                                null
                        }
                    </Typography>
                    <IconButton style={{ width: 56, height: '100%', paddingLeft: 8, position: 'absolute', right: -8, top: -4, }}
                        onClick={e => {
                            e.stopPropagation();
                            publish(uiEvents.NAVIGATE, { navigateTo: 'Rooms', tower: tower });
                        }}>
                        <Card variant={'contained'} sx={{ bgcolor: yellow[600] }}
                            style={{ width: 32, height: 32, padding: 0, minWidth: 0, borderRadius: 16, marginTop: 0, position: 'relative' }}>
                            <LocationCity style={{ color: '#000', width: 18, height: 18, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                        </Card>
                    </IconButton>
                </div>
            </Fade>
        </ListItem >
    );
}

let collapseAppbarInstant = false;

export default function Home() {
    forceHomeUpdate = useForceUpdate();
    const [activeNavId, setActiveNavId] = useState(selectedNav);
    const [endPrevNav, setEndPrevActive] = useState(selectedNav);
    const [dbLoaded, setDbLoaded] = useState(isDbLoaded);
    const [contactMode, setContactMode] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [collapseAppbar, setCollapseAppbar] = React.useState(collapseAppbarInstant);
    const [expandedMode, setExpandedMode] = React.useState(true);
    const navEyeRef = useRef();
    const navSettingsRef = useRef();
    const navExploreRef = useRef();
    const navFeedRef = useRef();
    const navCallRef = useRef();
    const navMainRef = useRef();
    const oldScroll = useRef();
    const WallpaperWrapper = useRef();
    const scrollCallback = useCallback(e => {
        if (e.target.scrollTop > oldScroll.current) {
            if (!collapseAppbarInstant) {
                collapseAppbarInstant = true;
                setCollapseAppbar(true);
            }
        } else {
            if (collapseAppbarInstant) {
                collapseAppbarInstant = false;
                setCollapseAppbar(false);
            }
        }
        oldScroll.current = e.target.scrollTop;
    }, []);
    useEffect(() => {
        selectedNav = activeNavId;
        publish(uiEvents.HOME_NAV_SWITCHED, { id: activeNavId });
        setTimeout(() => {
            setEndPrevActive(activeNavId);
        }, 250);
    }, [activeNavId]);
    useEffect(() => {
        if (endPrevNav === 'eye') {
            navEyeRef.current.addEventListener('scroll', scrollCallback);
        } else if (endPrevNav === 'settings') {
            navSettingsRef.current.addEventListener('scroll', scrollCallback);
        } else if (endPrevNav === 'explore') {
            navExploreRef.current.addEventListener('scroll', scrollCallback);
        } else if (endPrevNav === 'feed') {
            navFeedRef.current.addEventListener('scroll', scrollCallback);
        } else if (endPrevNav === 'call') {
            navCallRef.current.addEventListener('scroll', scrollCallback);
        } else if (endPrevNav === undefined) {
            navMainRef.current.addEventListener('scroll', scrollCallback);
        }
        return () => {
            navEyeRef.current?.removeEventListener('scroll', scrollCallback);
            navSettingsRef.current?.removeEventListener('scroll', scrollCallback);
            navExploreRef.current?.removeEventListener('scroll', scrollCallback);
            navFeedRef.current?.removeEventListener('scroll', scrollCallback);
            navCallRef.current?.removeEventListener('scroll', scrollCallback);
            navMainRef.current?.removeEventListener('scroll', scrollCallback);
        };
    }, [endPrevNav]);
    useEffect(() => {
        if (themeId === 'LIGHT') {
            import("../../styles/home-wallpaper-light").then(comp => {
                WallpaperWrapper.current = comp.default;
                forceHomeUpdate();
            });
        } else {
            import("../../styles/home-wallpaper-dark").then(comp => {
                WallpaperWrapper.current = comp.default;
                forceHomeUpdate();
            });
        }
    }, [themeId]);
    useEffect(() => {
        if (themeId === 'LIGHT') {
            import("../../styles/home-wallpaper-light").then(comp => {
                WallpaperWrapper.current = comp.default;
                forceHomeUpdate();
            });
        } else {
            import("../../styles/home-wallpaper-dark").then(comp => {
                WallpaperWrapper.current = comp.default;
                forceHomeUpdate();
            });
        }
        const tokenOfDbLoaded = subscribe(topics.DB_LOADED, () => {
            setDbLoaded(true);
        });
        const tokenTowerCreated = subscribe(topics.TOWER_CREATED, () => {
            forceHomeUpdate();
        });
        const tokenInteractionCreated = subscribe(topics.INTERACTION_CREATED, () => {
            forceHomeUpdate();
        });
        const tokenNewInteraction = subscribe(updates.NEW_INTERACTION, () => {
            forceHomeUpdate();
        });
        return () => {
            unsubscribe(tokenOfDbLoaded);
            unsubscribe(tokenTowerCreated);
            unsubscribe(tokenInteractionCreated);
            unsubscribe(tokenNewInteraction);
        };
    }, []);
    let avatarBackColor = me.avatarBackColor;
    let listOfTowers = towersList.filter(t => (contactMode ? t.secret?.isContact : !t.secret?.isContact)).filter(tower => {
        if (tower.secret?.isContact) {
            return ((tower.contact?.firstName + ' ' + tower.contact?.lastName).includes(query));
        } else {
            return (tower.title.includes(query));
        }
    });
    let homeTower = listOfTowers.filter(t => (t.id === me.homeId))[0];

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}
        >
            <div style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, background: colors.paper }} />
            {!activeNavId ? (
                <div ref={navMainRef} style={{ overflowY: 'auto', paddingLeft: 8, paddingTop: 16, width: '100%', height: '100%', position: 'fixed', left: 0, top: comsoToolbarHeight }}>
                    <div style={{ height: 184, width: '100%' }} />
                    <div style={{ borderRadius: 12, width: 'calc(100% - 20px)', marginLeft: 6, paddingBottom: 12, paddingLeft: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: colors.semiTransparentPaper }}>
                        <Fade in={true}>
                            <Paper onClick={() => {
                                setActiveNavId('feed')
                            }}
                                style={{
                                    marginTop: 8,
                                    marginLeft: -8,
                                    width: 56,
                                    height: 56,
                                    borderRadius: '25%',
                                    padding: 16,
                                    background:
                                        "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)"
                                }}
                            >
                                <Tag style={{ fill: '#fff' }} />
                            </Paper>
                        </Fade>
                        <Fade in={true}>
                            <Paper onClick={() => setActiveNavId('explore')}
                                style={{
                                    marginTop: 8,
                                    marginLeft: 16,
                                    width: 56,
                                    height: 56,
                                    borderRadius: '25%',
                                    padding: 16,
                                    background:
                                        "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)"
                                }}
                            >
                                <ExploreIcon style={{ fill: '#fff' }} />
                            </Paper>
                        </Fade>
                        <Fade in={true}>
                            <Paper onClick={() => setActiveNavId('call')}
                                style={{
                                    marginTop: 8,
                                    marginLeft: 16,
                                    width: 56,
                                    height: 56,
                                    borderRadius: '25%',
                                    padding: 16,
                                    background:
                                        "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)"
                                }}
                            >
                                <Call style={{ fill: '#fff' }} />
                            </Paper>
                        </Fade>
                        <Fade in={true}>
                            <Paper onClick={() => setActiveNavId('notifications')}
                                style={{
                                    marginTop: 8,
                                    marginLeft: 16,
                                    width: 56,
                                    height: 56,
                                    borderRadius: '25%',
                                    padding: 16,
                                    background:
                                        "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)"
                                }}
                            >
                                <Notifications style={{ fill: '#fff' }} />
                            </Paper>
                        </Fade>
                        <Fade in={true}>
                            <Paper onClick={() => setContactMode(!contactMode)}
                                style={{
                                    marginTop: 8,
                                    marginLeft: 16,
                                    width: 56,
                                    height: 56,
                                    borderRadius: '25%',
                                    padding: 16,
                                    background:
                                        contactMode ?
                                            "linear-gradient(315deg, rgba(194, 24, 91, 1) 33%, rgba(233, 30, 99, 0.75) 100%)" :
                                            "linear-gradient(315deg, rgba(245, 124, 0, 1) 33%, rgba(255, 152, 0, 0.75) 100%)"
                                }}
                            >
                                {
                                    contactMode ? (
                                        <LocationCityIcon style={{ fill: '#fff' }} />
                                    ) : (
                                        <People style={{ fill: '#fff' }} />
                                    )
                                }
                            </Paper>
                        </Fade>
                    </div>
                    {
                        expandedMode ? (
                            <div style={{ borderRadius: 12, marginTop: 16, width: 'calc(100% - 20px)', marginLeft: 6, paddingBottom: 12, paddingLeft: 8, background: 'transparent' }}>
                                {
                                    homeTower ? (() => {
                                        let rooms = roomsDict[homeTower.id];
                                        let membersOfTower = {};
                                        for (let i = 0; i < rooms.length; i++) {
                                            Object.keys(membershipsDict[rooms[i].id]).forEach(userId => {
                                                membersOfTower[userId] = true;
                                            });
                                        }
                                        let memberCount = Object.keys(membersOfTower).length;
                                        return (
                                            <Fade in={true}>
                                                <Card style={{ marginLeft: -4, marginTop: 8, borderRadius: 16, background: colors.floatingCard, width: '100%', height: 200, position: 'relative' }}>
                                                    <img src={homeTower.headerId} style={{ width: '100%', height: '100%' }} />
                                                    <div>
                                                        <Card style={{ display: 'flex', borderRadius: 16, paddingLeft: 8, paddingTop: 4, paddingRight: 8, paddingBottom: 2, position: 'absolute', top: 16, left: 16, background: colors.semiTransparentPaper, backdropFilter: colors.backdrop }}>
                                                            <People style={{ fill: colors.textPencil }} />
                                                            <Typography style={{ color: colors.textPencil, fontWeight: 'bold', marginLeft: 8, marginTop: 2 }}>
                                                                {memberCount}
                                                            </Typography>
                                                        </Card>
                                                        <Card style={{ display: 'flex', borderRadius: 16, paddingLeft: 8, paddingTop: 4, paddingRight: 8, paddingBottom: 2, position: 'absolute', top: 16 + 32 + 8, left: 16, background: colors.semiTransparentPaper, backdropFilter: colors.backdrop }}>
                                                            <SmartToy style={{ fill: colors.textPencil }} />
                                                            <Typography style={{ color: colors.textPencil, fontWeight: 'bold', marginLeft: 8, marginTop: 2 }}>
                                                                0
                                                            </Typography>
                                                        </Card>
                                                    </div>
                                                    <Card style={{ display: 'flex', borderRadius: 16, paddingLeft: 8, paddingTop: 4, paddingRight: 8, paddingBottom: 2, position: 'absolute', top: 16, right: 16, background: colors.semiTransparentPaper, backdropFilter: colors.backdrop }}>
                                                        <Typography style={{ color: colors.textPencil, fontWeight: 'bold', marginRight: 8, marginTop: 2 }}>
                                                            {Object.keys(roomsDict[homeTower.id]).length}
                                                        </Typography>
                                                        <LocationCity style={{ fill: colors.textPencil }} />
                                                    </Card>
                                                    <Card style={{ borderRadius: 16, paddingLeft: 8, paddingRight: 8, paddingBottom: 8, paddingTop: 2, width: 'calc(100% - 32px)', position: 'absolute', bottom: 16, left: 16, background: colors.semiTransparentPaper, backdropFilter: colors.backdrop }}>
                                                        <TowerItemOut activeNavId={activeNavId} expandedMode={expandedMode} isExpandedDark={(themeId === 'DARK') && expandedMode} isLast={true} isSelected={endPrevNav === homeTower.id} type={'home'} tower={homeTower} onTowerSelected={(tower) => {
                                                            saveCurrentTowerId(tower.id);
                                                            setActiveNavId(tower.id);
                                                        }} />
                                                    </Card>
                                                </Card>
                                            </Fade>
                                        );
                                    })() : null
                                }
                                {
                                    listOfTowers.filter(t => (t.id !== me.homeId)).sort((t1, t2) => {
                                        return t1.title.localeCompare(t2.title)
                                    }).map((tower, index) => {
                                        let rooms = roomsDict[tower.id];
                                        let membersOfTower = {};
                                        for (let i = 0; i < rooms.length; i++) {
                                            Object.keys(membershipsDict[rooms[i].id]).forEach(userId => {
                                                membersOfTower[userId] = true;
                                            });
                                        }
                                        let memberCount = Object.keys(membersOfTower).length;
                                        return (
                                            <Fade in={true}>
                                                <Card style={{ marginLeft: -4, marginTop: 12, borderRadius: 16, background: colors.floatingCard, width: '100%', height: 200, position: 'relative' }}>
                                                    <img src={tower.headerId} style={{ width: '100%', height: '100%' }} />
                                                    <div>
                                                        <Card style={{ display: 'flex', borderRadius: 16, paddingLeft: 8, paddingTop: 4, paddingRight: 8, paddingBottom: 2, position: 'absolute', top: 16, left: 16, background: colors.semiTransparentPaper, backdropFilter: colors.backdrop }}>
                                                            <People style={{ fill: colors.textPencil }} />
                                                            <Typography style={{ color: colors.textPencil, fontWeight: 'bold', marginLeft: 8, marginTop: 2 }}>
                                                                {memberCount}
                                                            </Typography>
                                                        </Card>
                                                        <Card style={{ display: 'flex', borderRadius: 16, paddingLeft: 8, paddingTop: 4, paddingRight: 8, paddingBottom: 2, position: 'absolute', top: 16 + 32 + 8, left: 16, background: colors.semiTransparentPaper, backdropFilter: colors.backdrop }}>
                                                            <SmartToy style={{ fill: colors.textPencil }} />
                                                            <Typography style={{ color: colors.textPencil, fontWeight: 'bold', marginLeft: 8, marginTop: 2 }}>
                                                                0
                                                            </Typography>
                                                        </Card>
                                                    </div>
                                                    <Card style={{ display: 'flex', borderRadius: 16, paddingLeft: 8, paddingTop: 4, paddingRight: 8, paddingBottom: 2, position: 'absolute', top: 16, right: 16, background: colors.semiTransparentPaper, backdropFilter: colors.backdrop }}>
                                                        <Typography style={{ color: colors.textPencil, fontWeight: 'bold', marginRight: 8, marginTop: 2 }}>
                                                            {Object.keys(roomsDict[tower.id]).length}
                                                        </Typography>
                                                        <LocationCity style={{ fill: colors.textPencil }} />
                                                    </Card>
                                                    <Card style={{ borderRadius: 16, paddingLeft: 8, paddingRight: 8, paddingBottom: 8, paddingTop: 2, width: 'calc(100% - 32px)', position: 'absolute', bottom: 16, left: 16, background: colors.semiTransparentPaper, backdropFilter: colors.backdrop }}>
                                                        <TowerItemOut activeNavId={activeNavId} expandedMode={expandedMode} isExpandedDark={(themeId === 'DARK') && expandedMode} isLast={true} isSelected={endPrevNav === tower.id} type={contactMode ? 'contact' : 'group'} tower={tower} onTowerSelected={(tower) => {
                                                            saveCurrentTowerId(tower.id);
                                                            setActiveNavId(tower.id);
                                                        }} />
                                                    </Card>
                                                </Card>
                                            </Fade>
                                        );
                                    })
                                }
                            </div>
                        ) : (
                            <div style={{ borderRadius: 12, marginTop: 24, width: 'calc(100% - 20px)', marginLeft: 6, paddingBottom: 12, paddingLeft: 8, background: 'transparent' }}>
                                {
                                    homeTower ? (
                                        <TowerItemOut activeNavId={activeNavId} expandedMode={expandedMode} isLast={listOfTowers.length === 1} isSelected={endPrevNav === homeTower.id} type={'home'} tower={homeTower} onTowerSelected={(tower) => {
                                            saveCurrentTowerId(tower.id);
                                            setActiveNavId(tower.id);
                                        }} />
                                    ) : null
                                }
                                {
                                    listOfTowers.filter(t => (t.id !== me.homeId)).sort((t1, t2) => {
                                        return t1.title.localeCompare(t2.title)
                                    }).map((tower, index) => (
                                        <TowerItemOut activeNavId={activeNavId} expandedMode={expandedMode} isLast={index === (listOfTowers.length - 1)} isSelected={endPrevNav === tower.id} type={contactMode ? 'contact' : 'group'} tower={tower} onTowerSelected={(tower) => {
                                            saveCurrentTowerId(tower.id);
                                            setActiveNavId(tower.id);
                                        }} />
                                    ))
                                }
                            </div>
                        )
                    }
                    <div style={{ width: '100%', height: 56 }} />
                </div>
            ) : null
            }
            {
                activeNavId ? (
                    <Slide in={true} direction={'right'} style={{ transitionDelay: '250ms' }}>
                        <Paper style={{ overflowY: 'auto', paddingLeft: 8, paddingTop: 16, borderRadius: 0, position: 'fixed', left: 0, top: comsoToolbarHeight, background: colors.paper, width: 64, height: '100%' }}>
                            <Fade in={true}>
                                <Avatar onClick={() => setActiveNavId('settings')}
                                    style={{ width: 48, height: 48, borderRadius: '25%' }}
                                    sx={{
                                        bgcolor:
                                            avatarBackColor < 2 ? blue[400] :
                                                avatarBackColor < 4 ? purple[400] :
                                                    avatarBackColor < 6 ? red[400] :
                                                        avatarBackColor < 8 ? green[400] :
                                                            yellow[800]
                                    }}
                                >
                                    <b>
                                        {me?.firstName?.substring(0, 1).toUpperCase()}
                                    </b>
                                </Avatar>
                            </Fade>
                            <Divider style={{ width: 'calc(100% - 8px)', marginTop: 12, background: colors.textPencil }} />
                            <Fade in={true}>
                                <Paper onClick={() => setActiveNavId('feed')}
                                    style={{
                                        marginTop: 12,
                                        width: 48,
                                        height: 48,
                                        borderRadius: '25%',
                                        padding: 12,
                                        background:
                                            "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)"
                                    }}
                                >
                                    <Tag style={{ fill: '#fff' }} />
                                </Paper>
                            </Fade>
                            <Fade in={true}>
                                <Paper onClick={() => setActiveNavId('explore')}
                                    style={{
                                        marginTop: 12,
                                        width: 48,
                                        height: 48,
                                        borderRadius: '25%',
                                        padding: 12,
                                        background:
                                            "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)"
                                    }}
                                >
                                    <ExploreIcon style={{ fill: '#fff' }} />
                                </Paper>
                            </Fade>
                            <Fade in={true}>
                                <Paper onClick={() => setActiveNavId('call')}
                                    style={{
                                        marginTop: 12,
                                        width: 48,
                                        height: 48,
                                        borderRadius: '25%',
                                        padding: 12,
                                        background:
                                            "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)"
                                    }}
                                >
                                    <Call style={{ fill: '#fff' }} />
                                </Paper>
                            </Fade>
                            <Fade in={true}>
                                <Paper onClick={() => setActiveNavId('notifications')}
                                    style={{
                                        marginTop: 12,
                                        width: 48,
                                        height: 48,
                                        borderRadius: '25%',
                                        padding: 12,
                                        background:
                                            "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)"
                                    }}
                                >
                                    <Notifications style={{ fill: '#fff' }} />
                                </Paper>
                            </Fade>
                            <Divider style={{ width: 'calc(100% - 8px)', marginTop: 12, background: colors.textPencil }} />
                            <Fade in={true}>
                                <Paper onClick={() => setContactMode(!contactMode)}
                                    style={{
                                        marginTop: 12,
                                        width: 48,
                                        height: 48,
                                        borderRadius: '25%',
                                        padding: 12,
                                        background:
                                            contactMode ?
                                                "linear-gradient(315deg, rgba(194, 24, 91, 1) 33%, rgba(233, 30, 99, 0.75) 100%)" :
                                                "linear-gradient(315deg, rgba(245, 124, 0, 1) 33%, rgba(255, 152, 0, 0.75) 100%)"
                                    }}
                                >
                                    {
                                        contactMode ? (
                                            <LocationCityIcon style={{ fill: '#fff' }} />
                                        ) : (
                                            <People style={{ fill: '#fff' }} />
                                        )
                                    }
                                </Paper>
                            </Fade>
                            <Zoom in={true}>
                                <Fab
                                    size={'medium'}
                                    onClick={() => {
                                        publish(uiEvents.NAVIGATE, { navigateTo: 'CreateTowerDlg' });
                                    }}
                                    sx={{
                                        bgcolor: yellow[600]
                                    }}
                                    style={{ marginTop: 12 }}
                                >
                                    <Add />
                                </Fab>
                            </Zoom>
                            {
                                towersList.filter(t => (contactMode ? t.secret?.isContact : !t.secret?.isContact)).sort((t1, t2) => {
                                    return t1.title.localeCompare(t2.title)
                                }).map((tower, index) => (
                                    <TowerItem isSelected={endPrevNav === tower.id} type={contactMode ? 'contact' : 'group'} tower={tower} onTowerSelected={(tower) => {
                                        saveCurrentTowerId(tower.id);
                                        setActiveNavId(tower.id);
                                    }} />
                                ))
                            }
                            <div style={{ width: '100%', height: 56 }} />
                        </Paper>
                    </Slide>
                ) : null
            }
            {
                activeNavId ? (
                    <Paper style={{
                        background: 'transparent', width: 'calc(100% - 64px)', height: `calc(100% - ${comsoToolbarHeight}px`,
                        position: 'fixed', left: 64, top: comsoToolbarHeight, borderRadius: 0, overflowY: 'auto'
                    }}>
                        {
                            endPrevNav === 'explore' ? (
                                <div ref={navExploreRef} style={{
                                    transform: activeNavId === 'explore' ? 'translateX(0px)' : 'translateX(64px)',
                                    opacity: activeNavId === 'explore' ? 1 : 0,
                                    transition: 'transform 0.25s, opacity 0.25s',
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 2,
                                    overflowY: 'auto',
                                    overflowX: 'hidden'
                                }}>
                                    <Explore />
                                </div>
                            ) : endPrevNav === 'call' ? (
                                <div ref={navCallRef} style={{
                                    transform: activeNavId === 'call' ? 'translateX(0px)' : 'translateX(64px)',
                                    opacity: activeNavId === 'call' ? 1 : 0,
                                    transition: 'transform 0.25s, opacity 0.25s',
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 2,
                                    overflowY: 'auto',
                                    overflowX: 'hidden'
                                }}>
                                    <CallsList />
                                </div>
                            ) : endPrevNav === 'notifications' ? (
                                <div ref={navEyeRef} style={{
                                    transform: activeNavId === 'notifications' ? 'translateX(0px)' : 'translateX(64px)',
                                    opacity: activeNavId === 'notifications' ? 1 : 0,
                                    transition: 'transform 0.25s, opacity 0.25s',
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 2,
                                    overflowY: 'auto',
                                    overflowX: 'hidden'
                                }}>
                                    <NavEye dbLoaded={dbLoaded} />
                                </div>
                            ) : endPrevNav === 'feed' ? (
                                <div ref={navFeedRef} style={{
                                    transform: activeNavId === 'feed' ? 'translateX(0px)' : 'translateX(64px)',
                                    opacity: activeNavId === 'feed' ? 1 : 0,
                                    transition: 'transform 0.25s, opacity 0.25s',
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 2,
                                    overflowY: 'auto',
                                    overflowX: 'hidden'
                                }}>
                                    <NavFeed dbLoaded={dbLoaded} />
                                </div>
                            ) : endPrevNav === 'settings' ? (
                                <div ref={navSettingsRef} style={{
                                    transform: activeNavId === 'settings' ? 'translateX(0px)' : 'translateX(64px)',
                                    opacity: activeNavId === 'settings' ? 1 : 0,
                                    transition: 'transform 0.25s, opacity 0.25s',
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 2,
                                    overflowY: 'auto',
                                    overflowX: 'hidden'
                                }}>
                                    <NavSettings dbLoaded={dbLoaded} />
                                </div>
                            ) : towersDictById[endPrevNav] ? (
                                <div
                                    style={{
                                        transform: activeNavId === endPrevNav ? 'translateX(0px)' : 'translateX(64px)',
                                        opacity: activeNavId === endPrevNav ? 1 : 0,
                                        transition: 'transform 0.25s, opacity 0.25s',
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        zIndex: 2,
                                        overflowY: 'auto',
                                        overflowX: 'hidden'
                                    }}>
                                    <ChatsList towerId={endPrevNav} />
                                </div>
                            ) : (
                                <div style={{
                                    transform: activeNavId === endPrevNav ? 'translateX(0px)' : 'translateX(64px)',
                                    opacity: 0,
                                    transition: 'transform 0.25s, opacity 0.25s',
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 2,
                                    overflowY: 'auto',
                                    overflowX: 'hidden'
                                }}>

                                </div>
                            )
                        }
                        <IconButton size='small' style={{ position: 'fixed', zIndex: 2, left: 24 + 48, top: comsoToolbarHeight + 8 }}
                            onClick={() => {
                                setActiveNavId(undefined);
                            }}>
                            <ArrowBackIos style={{ color: colors.textPencil }} />
                        </IconButton>
                    </Paper>
                ) : null
            }
            {
                !activeNavId ? (
                    <Slide in={!collapseAppbar} direction={'bottom'}>
                        <Card style={{
                            width: '100%', height: 184, borderRadius: 0, background: colors.floatingCard2, position: 'fixed',
                            left: 0, top: comsoToolbarHeight, backdropFilter: colors.backdrop
                        }}>
                            <Card style={{ marginLeft: 16, marginTop: 16, borderRadius: 20, width: 200, display: 'flex' }}
                                onClick={() => setActiveNavId('settings')}>
                                <Avatar
                                    style={{ width: 40, height: 40, borderRadius: '50%', }}
                                    sx={{
                                        bgcolor:
                                            avatarBackColor < 2 ? blue[400] :
                                                avatarBackColor < 4 ? purple[400] :
                                                    avatarBackColor < 6 ? red[400] :
                                                        avatarBackColor < 8 ? green[400] :
                                                            yellow[800]
                                    }}
                                >
                                    <b>
                                        {me?.firstName?.substring(0, 1).toUpperCase()}
                                    </b>
                                </Avatar>
                                <Typography variant={'subtitle'} style={{ fontWeight: 'bold', marginLeft: 8, marginTop: 12 }}>
                                    Welcome {me.firstName}
                                </Typography>
                            </Card>
                            <div
                                style={{
                                    width: 'calc(100% - 16px)',
                                    height: 'auto',
                                    paddingTop: 24,
                                    marginLeft: 8
                                }}>
                                <Typography style={{ color: colors.textPencil, marginLeft: 16, color: '#fff' }} variant={'h6'}>
                                    What do you want to find ?
                                </Typography>
                                <TextField
                                    variant="standard"
                                    style={{
                                        width: 'calc(100% - 96px)',
                                        marginLeft: 16,
                                        marginTop: 8,
                                    }}
                                    placeholder="Search Cosmopole..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    sx={{
                                        input: {
                                            color: '#fff',
                                            borderBottom: `1px solid ${'#fff'}`,
                                        },
                                    }}
                                />
                                <IconButton style={{ marginLeft: -40, marginTop: 0 }}>
                                    <Search style={{ fill: '#fff' }} />
                                </IconButton>
                            </div>
                            <IconButton style={{ position: 'absolute', right: 40 + 16, top: 16 }} onClick={() => {
                                setExpandedMode(!expandedMode);
                            }}>
                                {expandedMode ? <CloseFullscreen style={{ color: '#fff' }} /> : <OpenInFull style={{ color: '#fff' }} />}
                            </IconButton>
                        </Card>
                    </Slide>
                ) : null
            }
            {
                !activeNavId ? (
                    <Slide in={collapseAppbar} direction={'bottom'}>
                        <Card style={{
                            width: '100%', height: 64, borderRadius: 0, background: colors.floatingCard2, position: 'fixed',
                            left: 0, top: comsoToolbarHeight, backdropFilter: colors.backdrop, display: 'flex'
                        }}>
                            <div style={{ marginLeft: 16, marginTop: 12, width: 200, display: 'flex' }}
                                onClick={() => setActiveNavId('settings')}>
                                <Avatar
                                    style={{ width: 40, height: 40, borderRadius: '50%', }}
                                    sx={{
                                        bgcolor:
                                            avatarBackColor < 2 ? blue[400] :
                                                avatarBackColor < 4 ? purple[400] :
                                                    avatarBackColor < 6 ? red[400] :
                                                        avatarBackColor < 8 ? green[400] :
                                                            yellow[800]
                                    }}
                                >
                                    <b>
                                        {me?.firstName?.substring(0, 1).toUpperCase()}
                                    </b>
                                </Avatar>
                                <Typography variant={'subtitle'} style={{ fontWeight: 'bold', marginLeft: 8, marginTop: 12, color: '#fff' }}>
                                    {me.firstName + ' ' + me.lastName}
                                </Typography>
                            </div>
                            <IconButton style={{ position: 'absolute', right: 40 + 16, top: 12 }} onClick={() => {
                                setExpandedMode(!expandedMode);
                            }}>
                                {expandedMode ? <CloseFullscreen style={{ color: '#fff' }} /> : <OpenInFull style={{ color: '#fff' }} />}
                            </IconButton>
                        </Card>
                    </Slide>
                ) : null
            }
            <Zoom in={!activeNavId || towersDictById[activeNavId] !== undefined}>
                <Fab sx={{ bgcolor: yellow[600] }} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 3 }}
                    onClick={() => {
                        if (activeNavId) {
                            publish(uiEvents.NAVIGATE, { navigateTo: 'CreateRoomDlg', towerId: activeNavId });
                        } else {
                            publish(uiEvents.NAVIGATE, { navigateTo: 'CreateTowerDlg' });
                        }
                    }}>
                    <Add />
                </Fab>
            </Zoom>
        </div >
    )
}
