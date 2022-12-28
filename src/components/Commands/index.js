import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RoomCard from '../RoomCard';
import CommandButton from '../CommandButton';

export default function Commands({ actCommand }) {
    return (
        <div>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                <CommandButton onClick={() => actCommand()} />
            ))}
        </div>
    );
}
