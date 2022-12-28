
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Typoghraphy from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { colors } from '../../config/colors';
import { useEffect, useState } from 'react';
import { publish, subscribe, unsubscribe } from '../../core/bus';
import uiEvents from '../../config/ui-events.json';
import { historyKeys } from '../../App';
import { Fab, Zoom } from '@mui/material';
import { yellow } from '@mui/material/colors';
import { Close, Menu } from '@mui/icons-material';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import { fetchSessionToken } from '../../core/storage/auth';

export const comsoToolbarHeight = 28;

let degree = 0;

export default function CosmoToolbar() {
    const [flipDegree, setFlipDegree] = useState(degree);
    const [title, setTitle] = useState('Cosmopole');
    const [show, setShow] = useState(false);
    const [showAction, setShowAction] = useState(true);
    useEffect(() => {
        var tokenClose = subscribe(uiEvents.CLOSE_CONTROL_CENTER, () => {
            setShow(false);
        });
        var tokenOpenPhoto = subscribe(uiEvents.OPEN_PHOTO_VIEWER, () => {
            setShowAction(false);
        });
        var tokenClosePhoto = subscribe(uiEvents.CLOSE_PHOTO_VIEWER, () => {
            setShowAction(true);
        });
        var tokenHomeNavSwitched = subscribe(uiEvents.HOME_NAV_SWITCHED, ({ id }) => {
            degree = degree + 360;
            setFlipDegree(degree);
        });
        return () => {
            unsubscribe(tokenClose);
            unsubscribe(tokenOpenPhoto);
            unsubscribe(tokenClosePhoto);
            unsubscribe(tokenHomeNavSwitched);
        };
    }, []);
    if (fetchSessionToken() === null) {
        return null;
    }
    return (
        <div style={{
            position: 'fixed',
            left: 0,
            top: 0,
            height: 'auto',
            width: '100%',
            zIndex: 99999
        }}>
            <Paper id={'toolbar'} style={{
                transform: `rotateX(${flipDegree}deg)`,
                transition: 'transform 0.75s',
                backgroundColor: colors.pencil,
                backdropFilter: 'blur(10px)',
                borderRadius: 0,
                display: 'flex',
                width: '100%',
                height: comsoToolbarHeight
            }}>
                <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                    <IconButton>
                        <Card style={{ background: 'rgb(0, 240, 200)', width: 8, height: 8, borderRadius: 4 }} />
                    </IconButton>
                    <Typoghraphy variant={'subtitle1'} style={{
                        width: '100%', position: 'fixed', left: 0,
                        textAlign: 'center', fontWeight: 'bolder',
                        color: colors.textPencil, color: '#fff'
                    }}>
                        {title}
                    </Typoghraphy>
                </div>
            </Paper>
            <Zoom in={historyKeys[historyKeys.length - 1] !== 'Explore' && showAction}>
                <Fab style={{ position: 'fixed', right: 16, top: 8, zIndex: 99999 }} sx={{ bgcolor: yellow[600] }} size={'small'} onClick={() => {
                    if (show) {
                        publish(uiEvents.CLOSE_CONTROL_CENTER, {});
                        setShow(false);
                    } else {
                        publish(uiEvents.OPEN_CONTROL_CENTER, {});
                        setShow(true);
                    }
                }}>
                    {
                        show ? (
                            <Close />
                        ) : (
                            <ViewQuiltIcon />
                        )
                    }
                </Fab>
            </Zoom>
        </div>
    );
}
