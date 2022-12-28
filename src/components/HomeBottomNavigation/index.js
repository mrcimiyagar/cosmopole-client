import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Avatar, Paper, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ForumIcon from '@mui/icons-material/Forum';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import { colors } from '../../config/colors';
import { me } from '../../core/memory';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { blue, green, purple, red, yellow } from '@mui/material/colors';

export default function HomeBottomNavigation({ onNavClick }) {
    const [value, setValue] = React.useState('messages');
    const handleChange = (event, newValue) => {
        setValue(newValue);
        onNavClick(newValue);
    };
    let avatarBackColor = me.avatarBackColor;
    return (
        <Paper style={{
            width: '100%', borderRadius: 0, backgroundColor: colors.floatingCard,
            backdropFilter: colors.backdrop, borderRadius: '24px 24px 0px 0px'
        }} elevation={8}>
            <BottomNavigation
                style={{ width: '100%', background: 'transparent' }} value={value} onChange={handleChange}>
                <BottomNavigationAction
                    style={{ color: value === 'settings' ? colors.textPencil : colors.textPencil2 }}
                    value="settings"
                    icon={
                        <Avatar
                            style={{ width: 32, height: 32 }}
                            sx={{
                                bgcolor:
                                    avatarBackColor < 2 ? blue[400] :
                                        avatarBackColor < 4 ? purple[400] :
                                            avatarBackColor < 6 ? red[400] :
                                                avatarBackColor < 8 ? green[400] :
                                                    yellow[600]
                            }}
                        >
                            {me?.firstName?.substring(0, 1).toUpperCase()}
                        </Avatar>
                    }
                />
                <BottomNavigationAction
                    style={{ color: value === 'city' ? colors.textPencil : colors.textPencil2 }}
                    label={<Typography variant={'caption'}>City</Typography>}
                    value="city"
                    icon={<LocationCityIcon style={{ fill: value === 'city' ? colors.textPencil : colors.textPencil2, width: 26, height: 26 }} />}
                />
                <BottomNavigationAction
                    style={{ color: value === 'messages' ? colors.textPencil : colors.textPencil2 }}
                    label={<Typography variant={'caption'}>Messages</Typography>}
                    value="messages"
                    icon={<ForumIcon style={{ fill: value === 'messages' ? colors.textPencil : colors.textPencil2, width: 26, height: 26 }} />}
                />
                <BottomNavigationAction
                    style={{ color: value === 'notifications' ? colors.textPencil : colors.textPencil2 }}
                    label={<Typography variant={'caption'}>Notifications</Typography>}
                    value="notifications"
                    icon={<NotificationsIcon style={{ fill: value === 'notifications' ? colors.textPencil : colors.textPencil2, width: 26, height: 26 }} />}
                />
                <BottomNavigationAction
                    style={{ color: value === 'feed' ? colors.textPencil : colors.textPencil2 }}
                    label={<Typography variant={'caption'}>Feed</Typography>}
                    value="feed"
                    icon={<RssFeedIcon style={{ fill: value === 'feed' ? colors.textPencil : colors.textPencil2, width: 26, height: 26 }} />}
                />
            </BottomNavigation>
        </Paper>
    );
}
