import { ArrowBack, Search } from "@mui/icons-material";
import {
  Dialog,
  Fade,
  Grow,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import * as React from "react";
import { colors } from "../../config/colors";
import TopTransition from "../../components/TopTransition";
import { publish, restoreState, saveState, subscribe, unsubscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import filterEmpty from "../../utils/EmptyChecker";
import InviterTowers from '../../components/InviterTowers';
import InviterRooms from '../../components/InviterRooms';
import { createInvite } from '../../core/callables/invites';
import { createFileMessage } from "../../core/callables/messenger";
import { enterRoom } from "../../core/callables/auth";
import { dbFindFirstRoomOfTower, dbFindFirstWorkspaceOfRoom } from "../../core/storage/spaces";
import topics from '../../core/events/topics.json';

export let closeExplore = () => { };

let reservedActionAfterEnteringWorkspace;

export default function Forwarder({ docId, docType }) {
  let state = restoreState('Explore', '0');
  const [level, setLevel] = React.useState(filterEmpty(state.level, 0));
  const [selectedTower, setSelectedTower] = React.useState(undefined);
  const [open, setOpen] = React.useState(true);
  const [query, setQuery] = React.useState('');
  React.useEffect(() => {
    let tokenEnteringWorkspace = subscribe(topics.ENTERED_WORKSPACE, () => {
      reservedActionAfterEnteringWorkspace && reservedActionAfterEnteringWorkspace();
    });
    return () => {
      unsubscribe(tokenEnteringWorkspace);
    };
  }, []);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      publish(uiEvents.BACK, {});
    }, 250);
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={TopTransition}
      PaperProps={{
        style: {
          width: '90%',
          height: 700,
          background: colors.semiTransparentPaper,
          backdropFilter: colors.backdrop,
          borderRadius: 24
        }
      }}
    >
      <div
        style={{
          overflow: "hidden",
          position: 'relative',
          height: '100%'
        }}
      >
        <Paper
          style={{
            height: 56,
            background: 'transparent',
            borderRadius: 0
          }}
        >
          <Toolbar>
            <IconButton
              onClick={() => {
                if (level === 0) {
                  handleClose();
                } else {
                  setLevel(0);
                }
              }}
            >
              <ArrowBack style={{ fill: colors.textPencil }} />
            </IconButton>
            <InputBase
              style={{ flex: 1, textAlign: "center", color: colors.textPencil }}
              inputProps={{ min: 0, style: { textAlign: "center" } }} // the change is here
              placeholder={level === 0 ? "Search towers..." : "Search tower rooms..."}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <IconButton>
              <Search style={{ fill: colors.textPencil }} />
            </IconButton>
          </Toolbar>
        </Paper>
        {level === 0 ? (
          <InviterTowers show={level === 0} onItemSelected={(tower) => {
            saveState('Explore', { selectedTower: tower }, '0');
            setLevel(1);
            setSelectedTower(tower);
          }} />
        ) : null}
        {(level === 1 && selectedTower !== undefined) ? (
          <InviterRooms tower={selectedTower} show={level === 1} onItemSelected={async (room) => {
            reservedActionAfterEnteringWorkspace = () => {
              createFileMessage('', [docId], docType, '0', '0', '0');
              handleClose();
            };
            enterRoom(room.id, false, (await dbFindFirstWorkspaceOfRoom(room.id)).id);
          }} />
        ) : null}
      </div>
    </Dialog>
  );
}
