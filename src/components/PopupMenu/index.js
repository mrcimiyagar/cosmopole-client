import * as React from 'react';
import Menu from '@mui/material/Menu';
import { colors } from '../../config/colors';

export default function PopupMenu({ anchorEl, onClose, menuItems }) {
    const [open, setOpen] = React.useState(anchorEl !== undefined);
    const handleClose = () => {
        if (onClose) {
            setOpen(false);
            onClose();
        }
    };
    return (
        <React.Fragment>
            <Menu
                anchorEl={anchorEl}
                id="popup-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    style: {
                        borderRadius: 8,
                        background: colors.floatingCard,
                        backdropFilter: colors.backdrop,
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 200,
                        marginTop: -16
                    }
                }}
            >
                {
                    menuItems
                }
            </Menu>
        </React.Fragment>
    );
}
