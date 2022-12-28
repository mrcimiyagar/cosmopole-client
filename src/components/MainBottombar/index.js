import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Paper } from '@mui/material';
import { Notifications, Settings, Forum, Workspaces } from '@mui/icons-material';
import { colors } from '../../config/colors';


export default function MainBottombar(props) {
  const [value, setValue] = React.useState(2);

  return (
    <Paper style={{ borderRadius: '16px 16px 0px 0px', width: '100%', background: colors.homeBottombar, backdropFilter: colors.backdrop, position: 'fixed', left: 0, bottom: 0 }}>
      <BottomNavigation
        style={{backgroundColor: 'transparent'}}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          props.onRouteChanged(newValue);
        }}
      >
        <BottomNavigationAction label="Settings" icon={<Settings />} />
        <BottomNavigationAction label="Spaces" icon={<Workspaces />} />
        <BottomNavigationAction label="Chats" icon={<Forum />} />
        <BottomNavigationAction label="Notifications" icon={<Notifications />} />
      </BottomNavigation>
    </Paper>
  );
}
