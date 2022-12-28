import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { colors } from '../../config/colors';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import lime from '@mui/material/colors/lime';
import AvatarSample from '../../data/photos/avatar-2.png';
import { yellow } from '@mui/material/colors';
import { invitesDictById, roomsDict, roomsDictById, towersDictById, towersList } from '../../core/memory';
import { Close, Done, Mail } from '@mui/icons-material';
import { acceptInvite, declineInvite } from '../../core/callables/invites';
import useForceUpdate from '../../utils/ForceUpdate';

export default function EyeTimeline() {
  const forceUpdate = useForceUpdate();
  return (
    <Timeline style={{ position: 'absolute', left: 0, top: 16 }}>
      {
        Object.values(invitesDictById).map((invite, index) => (
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent style={{ paddingBottom: 40, position: 'relative' }}>
              <div>
                <Card
                  style={{
                    backgroundColor: colors.floatingCard2,
                    width: `${window.innerWidth - 32 - 64 - 32}px`, maxWidth: 400, height: 'auto',
                    minWidth: 200,
                    position: "relative",
                    borderRadius: "24px 24px 24px 8px",
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 16,
                    paddingBottom: 32
                  }}
                  elevation={4}
                >
                  <div style={{ display: 'flex', marginTop: 8 }}>
                    <Avatar sx={{ bgcolor: lime[500] }} aria-label="recipe" style={{ color: '#000' }}>
                      <Mail />
                    </Avatar>
                    <Typography variant={'subtitle2'} style={{ color: '#fff', marginLeft: 8, marginTop: 8, lineHeight: 1.5 }}>
                      You have received an invite from {invite.tower?.title}:{invite.room?.title} to join their room.
                    </Typography>
                  </div>
                </Card>
                <Fab onClick={() => {
                  declineInvite(invite.id, forceUpdate);
                }} size={'small'} variant={'extended'} sx={{ bgcolor: yellow[600] }} style={{ position: 'absolute', right: 24, transform: 'translateY(-50%)' }}>
                  <Close style={{ width: 18, height: 18 }} />
                  <Typography variant={'subtitle2'} style={{ fontWeight: 'bold', fontSize: 10, marginLeft: 4, marginRight: 8, marginTop: 4 }}>
                    Decline
                  </Typography>
                </Fab>
                <Fab onClick={() => {
                  acceptInvite(invite.id, forceUpdate);
                }} size={'small'} variant={'extended'} sx={{ bgcolor: yellow[600] }} style={{ position: 'absolute', right: 96 + 24, transform: 'translateY(-50%)' }}>
                  <Done style={{ width: 18, height: 18 }} />
                  <Typography style={{ fontWeight: 'bold', fontSize: 10, marginLeft: 4, marginRight: 8, marginTop: 4 }}>
                    Accept
                  </Typography>
                </Fab>
              </div>
            </TimelineContent>
          </TimelineItem>
        ))
      }
    </Timeline>
  );
}
