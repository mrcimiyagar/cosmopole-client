import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RoomCard from '../RoomCard';
import { publish } from '../../core/bus';
import uiEvents from '../../config/ui-events.json';
import useForceUpdate from '../../utils/ForceUpdate';
import { roomsDict } from '../../core/memory';

let floors = [];

export default function Floors({ towerId }) {
    const forceUpdate = useForceUpdate();
    React.useEffect(() => {
        const prepareFloors = () => {
            setTimeout(() => {
                let temp = {};
                let rs = roomsDict[towerId];
                if (rs !== undefined) {
                    rs.forEach(r => {
                        if (temp[r.floor] === undefined) {
                            temp[r.floor] = { title: r.floor, rooms: [], expanded: false };
                        }
                        temp[r.floor].rooms.push(r);
                    });
                }
                floors = Object.values(temp);
                forceUpdate();
            });
        }
    }, []);
    return (
        <div>
            {floors.map(floor => (
                <Accordion expanded={floor.expanded} onChange={(e, expanded) => {
                    floor.expanded = expanded;
                    forceUpdate();
                }}>
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
                        {floor.rooms.map(room => {
                            return (
                                <RoomCard onClick={() => publish(uiEvents.NAVIGATE, { navigateTo: "RoomProfile", room: room, showSwitch: true })} />
                            );
                        })}
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}
