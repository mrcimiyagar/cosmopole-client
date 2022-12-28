import * as React from 'react';
import { SwipeableDrawer } from '@mui/material';
import { colors } from '../../config/colors';

export default function CallPeopleDrawer({ open, onClose, view }) {
    const [delayedOpen, setDelayedOpen] = React.useState(false);
    React.useEffect(() => {
        if (open) {
            setTimeout(() => {
                setDelayedOpen(open);
            }, 250);
        }
    }, [open]);
    return (
        <div>
            <React.Fragment key={'call_people_drawer'}>
                {
                    open ? (
                        <SwipeableDrawer
                            anchor={'bottom'}
                            open={delayedOpen}
                            onClose={() => {
                                setDelayedOpen(false);
                                setTimeout(() => {
                                    onClose();
                                }, 250);
                            }}
                            style={{ position: 'fixed', zIndex: 99999, display: open ? 'block' : 'none' }}
                            PaperProps={{
                                style: {
                                    borderRadius: '24px 24px 0px 0px',
                                    background: colors.paper
                                }
                            }}
                        >
                            {view}
                        </SwipeableDrawer>
                    ) : null
                }
            </React.Fragment>
        </div>
    );
}
