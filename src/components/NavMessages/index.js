import { Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useRef } from 'react';
import ChatsList from "../../components/ChatsList";
import CallsList from "../../components/CallsList";
import SwipeableViews from "react-swipeable-views";
import { publish, saveState } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { colors } from '../../config/colors';

const headerHeight = 350;

export default function NavMessages({ dbLoaded }) {
    const coinRef = useRef();
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
                            borderRadius: 16

                        }}
                        onChange={(event, newPage) => {
                            setTabIndex(newPage);
                        }}
                    >
                        <ToggleButton value={0} style={{ color: tabIndex === 0 ? colors.primary : colors.textPencil, fontSize: 11, fontWeight: 'bold', borderRadius: '16px 0px 0px 16px' }}>Spaces</ToggleButton>
                        <ToggleButton value={1} style={{ color: tabIndex === 1 ? colors.primary : colors.textPencil, fontSize: 11, fontWeight: 'bold' }}>People</ToggleButton>
                        <ToggleButton value={2} style={{ color: tabIndex === 2 ? colors.primary : colors.textPencil, fontSize: 11, fontWeight: 'bold', borderRadius: '0px 16px 16px 0px' }}>Calls</ToggleButton>
                    </ToggleButtonGroup>
                    {
                        dbLoaded ? (
                            <div
                                style={{
                                    width: "100%",
                                    marginTop: -48
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        overflow: "hidden",
                                    }}
                                >
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
                                            <div style={{ width: '100%', height: 48 }} />
                                            <ChatsList type={'spaces'} openChat={() => { saveState('Chat', {}, '[workspaceId]'); publish(uiEvents.NAVIGATE, { navigateTo: 'Chat' }) }} />
                                        </div>
                                        <div
                                            style={{ width: "100%", position: "relative" }}
                                        >
                                            <div style={{ width: '100%', height: 48 }} />
                                            <ChatsList type={'people'} openChat={() => { saveState('Chat', {}, '[workspaceId]'); publish(uiEvents.NAVIGATE, { navigateTo: 'Chat' }) }} />
                                        </div>
                                        <div
                                            style={{ width: "100%", position: "relative" }}
                                        >
                                            <div style={{ width: '100%', height: 48 }} />
                                            <CallsList openCall={() => { saveState('Call', {}, '[workspaceId]'); publish(uiEvents.NAVIGATE, { navigateTo: 'Call' }) }} />
                                        </div>
                                    </SwipeableViews>
                                </div>
                            </div>
                        ) :
                            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s, index) => (
                                <div key={'nav_messages_skeleton_' + index} style={{ width: 'calc(100% - 80px)', height: 'auto', display: 'flex', paddingLeft: 32, marginTop: index === 0 ? 16 : 32 }}>
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
