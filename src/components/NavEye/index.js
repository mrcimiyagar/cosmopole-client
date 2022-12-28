import { Notifications } from '@mui/icons-material';
import { Skeleton, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { colors } from '../../config/colors';
import Coin from '../Coin';
import EyeTimeline from "../EyeTimeline";

export default function NavEye({ dbLoaded }) {
    const coinRef = useRef();
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ width: '100%', height: 232, backdropFilter: colors.backdrop, position: 'relative' }}>
                    <img
                        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                        src={'https://i.pinimg.com/564x/46/90/b5/4690b59cc8a5b7fe30a8694a49919398.jpg'}
                    />
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                        <Coin Icon={Notifications} key={'notifications'} />
                    </div>
                    <Typography variant={'h6'} style={{ paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8, color: '#fff', borderRadius: 8, background: 'rgba(0, 0, 0, 0.35)', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, calc(-50% + 88px))' }}>
                        Events
                    </Typography>
                </div>
                <div style={{
                    background: colors.paper, width: '100%', height: 5000, zIndex: 2, minHeight: '100%'
                }}>
                    {
                        dbLoaded ? (
                            <div style={{ marginLeft: -40, position: 'relative' }}><EyeTimeline /></div>
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
