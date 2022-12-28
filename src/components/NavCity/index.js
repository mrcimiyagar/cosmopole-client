
import { Divider, ListItem, ListItemAvatar, ListItemText, Paper, Skeleton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { publish } from '../../core/bus';
import { membershipsDictByTowerId, towersList } from '../../core/memory';
import uiEvents from '../../config/ui-events.json';
import SwipeableViews from 'react-swipeable-views';
import { colors } from '../../config/colors';

const headerHeight = 350;

let TowerItem = ({ tower, type }) => {
    let title = tower.secret.isContact ?
        (tower.contact?.firstName + ' ' + tower.contact?.lastName) :
        tower.title;
    return (
        <div style={{ width: '100%', marginTop: -4 }}>
            <ListItem alignItems="flex-start" style={{ position: 'relative' }} onClick={() => {
                publish(uiEvents.NAVIGATE, { navigateTo: "Rooms", tower: tower });
            }}>
                <ListItemAvatar>
                    <Paper
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: '25%',
                            background:
                                type === 'group' ?
                                    "linear-gradient(315deg, rgba(194, 24, 91, 1) 33%, rgba(233, 30, 99, 0.75) 100%)" :
                                    "linear-gradient(315deg, rgba(245, 124, 0, 1) 33%, rgba(255, 152, 0, 0.75) 100%)"
                        }}
                    >
                        <Typography style={{ color: '#fff', textAlign: 'center', fontSize: 25, fontWeight: 'bold', paddingTop: 10 }}>{title.substring(0, 1).toUpperCase()}</Typography>
                    </Paper>
                </ListItemAvatar>
                <ListItemText
                    style={{ marginLeft: 12, marginTop: 12 }}
                    primary={
                        <React.Fragment>
                            <Typography
                                sx={{ color: colors.textPencil, display: "inline", fontWeight: 'bold', fontSize: 17 }}
                                component="span"
                            >
                                {
                                    title
                                }
                            </Typography>
                        </React.Fragment>
                    }
                    secondary={
                        <React.Fragment>
                            <Typography
                                style={{
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    paddingRight: 8,
                                    color: colors.textPencil
                                }}
                                variant={'body2'}
                            >
                                This is a sample tower for pople to collaborate.
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="inset" style={{ marginTop: 4, marginLeft: 16, width: 'calc(100% - 32px)' }} />
        </div >
    );
}

export default function NavCity({ dbLoaded }) {
    const [tabIndex, setTabIndex] = React.useState(0);
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{
                    width: '100%', height: headerHeight, position: 'absolute', zIndex: 2,
                    left: 0, top: 0, background: `linear-gradient(0deg, ${colors.paper} 0%, rgba(0,0,0,0) 60%)`
                }} />
                <div style={{
                    background: colors.paper, width: '100%', height: 'auto', position: 'absolute',
                    left: 0, top: headerHeight, zIndex: 2, minHeight: '100%'
                }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={tabIndex}
                        exclusive
                        style={{
                            position: 'sticky',
                            left: '50%',
                            top: 72,
                            transform: 'translateX(-50%)',
                            backgroundColor: colors.paper,
                            zIndex: 7,
                            borderRadius: 16,

                        }}
                        onChange={(event, newPage) => {
                            setTabIndex(newPage);
                        }}
                    >
                        <ToggleButton value={0} style={{ color: tabIndex === 0 ? colors.primary : colors.textPencil, fontSize: 11, fontWeight: 'bold', borderRadius: '16px 0px 0px 16px' }}>Groups</ToggleButton>
                        <ToggleButton value={1} style={{ color: tabIndex === 1 ? colors.primary : colors.textPencil, fontSize: 11, fontWeight: 'bold', borderRadius: '0px 16px 16px 0px' }}>Contacts</ToggleButton>
                    </ToggleButtonGroup>
                    {
                        dbLoaded ?
                            <SwipeableViews
                                axis={"x"}
                                index={tabIndex}
                                onChangeIndex={(index) => {
                                    setTabIndex(index);
                                }}
                            >
                                <div
                                    style={{ width: "100%", position: "relative" }}
                                >
                                    {
                                        towersList.filter(t => (!t.secret?.isContact)).sort((t1, t2) => {
                                            return t1.title.localeCompare(t2.title)
                                        }).map((tower, index) => (<TowerItem key={'nav_city_towers_list_group_' + index} type={'group'} tower={tower} />))
                                    }
                                </div>
                                <div
                                    style={{ width: "100%", position: "relative" }}
                                >
                                    {
                                        Object.values(membershipsDictByTowerId)
                                            .filter(m => (m.tower?.secret?.isContact))
                                            .sort((m1, m2) => {
                                                return m1.tower.title.localeCompare(m2.tower.title)
                                            }).map((membership, index) => {
                                                return (
                                                    <TowerItem key={'nav_city_towers_list_contact_' + index} type={'contact'} tower={membership.tower} />
                                                );
                                            })
                                    }
                                </div>
                            </SwipeableViews> :
                            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s, index) => (
                                <div style={{ width: 'calc(100% - 80px)', height: 'auto', display: 'flex', paddingLeft: 32, marginTop: index === 0 ? 16 : 32 }}>
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
