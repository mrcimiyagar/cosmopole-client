import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Article, Audiotrack, Folder, OndemandVideo, Photo, Summarize } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { colors, themeId } from '../../config/colors';
import { yellow } from '@mui/material/colors';
import { Paper } from '@mui/material';

export default function FoldersToggleButtons({ updateFileOrFolder }) {
  const [alignment, setAlignment] = React.useState('all');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    updateFileOrFolder(newAlignment);
  };

  return (
    <div style={{ height: 40, borderRadius: 16, backgroundColor: colors.paper }}>
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        style={{ height: '100%' }}
      >
        <ToggleButton value="all" aria-label="centered"
          style={{
            width: 48,
            borderRadius: '16px 0px 0px 16px',
            color: alignment === 'all' ? themeId === 'DARK' ? yellow[600] : yellow[900] : colors.primary
          }}>
          <Summarize />
        </ToggleButton>
        <ToggleButton value="folder" aria-label="left aligned"
          style={{
            width: 48,
            color: alignment === 'folder' ? themeId === 'DARK' ? yellow[600] : yellow[900] : colors.primary
          }}>
          <Folder />
        </ToggleButton>
        <ToggleButton value="file" aria-label="centered"
          style={{
            width: 48,
            color: alignment === 'file' ? themeId === 'DARK' ? yellow[600] : yellow[900] : colors.primary
          }}>
          <InsertDriveFileIcon />
        </ToggleButton>
        <ToggleButton
          value="image"
          aria-label="left aligned"
          style={{
            width: 48,
            color: alignment === 'image' ? themeId === 'DARK' ? yellow[600] : yellow[900] : colors.primary
          }}
        >
          <Photo />
        </ToggleButton>
        <ToggleButton
          value="audio"
          aria-label="centered"
          style={{
            width: 48,
            color: alignment === 'audio' ? themeId === 'DARK' ? yellow[600] : yellow[900] : colors.primary
          }}
        >
          <Audiotrack />
        </ToggleButton>
        <ToggleButton
          value="video"
          aria-label="left aligned"
          style={{
            width: 48,
            color: alignment === 'video' ? themeId === 'DARK' ? yellow[600] : yellow[900] : colors.primary
          }}
        >
          <OndemandVideo />
        </ToggleButton>
        <ToggleButton
          value="doc"
          aria-label="centered"
          style={{
            width: 48,
            color: alignment === 'doc' ? themeId === 'DARK' ? yellow[600] : yellow[900] : colors.primary,
            borderRadius: "0px 16px 16px 0px",
          }}
        >
          <Article />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
