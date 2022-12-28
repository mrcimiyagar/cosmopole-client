import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import SampleRoomIcon from '../../data/photos/sample-room.png';
import useForceUpdate from '../../utils/ForceUpdate';
import { rooms, wireSignal } from '../../core/mirrors';
import mirrorEvents from '../../core/mirrors/mirror-events.json';
import { fetchCurrentTowerId } from '../../core/storage/auth';
import { enterRoom } from '../../core/callables/auth';

let defaultExpansionState = {};

export default function SwitcherFloors({ openRoom }) {
    const forceUpdate = useForceUpdate();
    const [floors, setFloors] = React.useState([]);
    React.useEffect(() => {
        let roomsWire = wireSignal(mirrorEvents.ROOMS, () => {
            setTimeout(() => {
                let temp = {};
                let roomsOfTower = rooms(fetchCurrentTowerId());
                if (roomsOfTower !== undefined) {
                    roomsOfTower.forEach(r => {
                        if (temp[r.floor] === undefined) {
                            let expansionState = defaultExpansionState[r.floor];
                            if (expansionState === undefined) {
                                expansionState = true;
                                defaultExpansionState[r.floor] = true;
                            }
                            temp[r.floor] = { title: r.floor, rooms: [], expanded: expansionState };
                        }
                        temp[r.floor].rooms.push(r);
                    });
                }
                setFloors(Object.values(temp));
            });
        });
        return () => {
            roomsWire.cut();
        };
    }, []);
    const handleChange = (panel, i) => (event, isExpanded) => {
        defaultExpansionState[panel] = isExpanded;
        floors[i].expanded = isExpanded;
        forceUpdate();
    };
    return (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            {floors.map((floor, i) => (
                <Accordion expanded={floor.expanded} onChange={handleChange(floor, i)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                    >
                        <Typography>
                            {floor.title}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List style={{ height: 'auto' }}>
                            {
                                floor.rooms.map(room => (
                                    <ListItem button onClick={() => {
                                        openRoom(room.id, room.towerId);
                                        enterRoom(room.id);
                                    }} alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar alt="Sample Room" src={SampleRoomIcon} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={room.title}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: "inline" }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        157 users
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                ))
                            }
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
            <div style={{ width: '100%', height: 256 }} />
        </div>
    );
}
