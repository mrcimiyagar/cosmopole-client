import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Add, CameraAlt, Mic, Videocam } from '@mui/icons-material';
import { colors } from '../../config/colors';
import WorkspacesIcon from '@mui/icons-material/Workspaces';

export default function MessageDocPicker({ onVoiceClicked, onSpaceClicked }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <IconButton
                    onClick={handleClick}
                    sx={{ ml: 2 }}
                >
                    <Add style={{fill: colors.textPencil }} />
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    style: {
                        transform: 'translateY(-32px)',
                        borderRadius: 8,
                        background: colors.semiPaper,
                        position: 'fixed', 
                        right: 72
                    },
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            bottom: 0,
                            right: 14,
                            width: 14,
                            height: 14,
                            bgcolor: colors.semiPaper,
                            transform: 'translateY(50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
                <MenuItem style={{color: colors.textPencil}} onClick={() => {
                    onSpaceClicked();
                }}>
                    <ListItemIcon>
                        <WorkspacesIcon style={{fill: colors.textPencil}} />
                    </ListItemIcon>
                    Spaces
                </MenuItem>
                <MenuItem style={{color: colors.textPencil}} onClick={() => {
                    onVoiceClicked();
                }}>
                    <ListItemIcon>
                        <Mic style={{fill: colors.textPencil}} />
                    </ListItemIcon>
                    Voice
                </MenuItem>
                <MenuItem style={{color: colors.textPencil}}>
                    <ListItemIcon>
                        <CameraAlt style={{fill: colors.textPencil}} />
                    </ListItemIcon>
                    Camera
                </MenuItem>
                <MenuItem style={{color: colors.textPencil}}>
                    <ListItemIcon>
                        <Videocam style={{fill: colors.textPencil}} />
                    </ListItemIcon>
                    Video
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}