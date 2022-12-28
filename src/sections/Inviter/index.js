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
import { publish, restoreState, saveState } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import filterEmpty from "../../utils/EmptyChecker";
import InviterTowers from '../../components/InviterTowers';
import InviterRooms from '../../components/InviterRooms';
import { createInvite } from '../../core/callables/invites';

export let closeExplore = () => { };

export default function Inviter({ invitingUser }) {
  let state = restoreState('Explore', '0');
  const [level, setLevel] = React.useState(filterEmpty(state.level, 0));
  const [selectedTower, setSelectedTower] = React.useState(undefined);
  const [open, setOpen] = React.useState(true);
  const [query, setQuery] = React.useState('');
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
                  setOpen(false);
                  setTimeout(() => {
                    publish(uiEvents.BACK, {});
                  }, 250);
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
          <InviterRooms invitingUser={invitingUser} tower={selectedTower} show={level === 1} onItemSelected={(room) => {
            if (window.confirm(`Do you want to invite [${invitingUser.firstName + ' ' + invitingUser.lastName}] to [${selectedTower.title}]:[${room.title}]?`)) {
              createInvite(invitingUser.id, room.id);
              alert('invite sent !');
            }
          }} />
        ) : null}
      </div>
    </Dialog>
  );
}
