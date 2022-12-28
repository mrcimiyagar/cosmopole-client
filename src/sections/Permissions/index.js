import { Add, ArrowBack, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Chip,
  Fab,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import { colors, themeId } from "../../config/colors";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import BaseSection from "../../utils/SectionEssentials";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import CosmoSwitch from "../../components/CosmoSwitch";

export default class Permissions extends BaseSection {
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.checked,
    });
  };
  componentDidMount() {
    super.componentDidMount();
    this.state = {
      canCreateWorkspace: false,
      canCreateFilespace: false,
      canCreateBlog: false,
      canInviteUser: false
    };
    this.handleChange = this.handleChange.bind(this);
  }
  render() {
    let { user, room } = this.props;
    let {
      canCreateWorkspace,
      canInviteUser,
      canCreateFilespace,
      canCreateBlog
    } = this.state;
    return this.renderWrapper(
      <div style={{ width: '100%', height: `calc(100% - ${comsoToolbarHeight}px)`, position: 'fixed', left: 0, top: comsoToolbarHeight, overflow: 'hidden' }}>
        <div style={{
          width: '100%',
          height: 72,
          position: 'absolute',
          left: 0,
          top: 0,
          background: colors.semiTransparentPaper,
          backdropFilter: 'blur(10px)'
        }}>
          <Toolbar
            style={{
              width: "100%",
              position: "absolute",
              top: 0,
            }}
          >
            <IconButton onClick={() => this.close(true)}>
              <ArrowBack style={{ fill: colors.textPencil }} />
            </IconButton>
            <Typography style={{ flex: 1, color: colors.textPencil }}>{user.firstName} Permissions</Typography>
            <div style={{ width: 40, height: 40 }} />
          </Toolbar>
        </div>
        <Paper
          elevation={0}
          style={{
            backgroundColor: colors.semiPaper,
            position: "relative",
            width: "100%",
            height: `calc(100% - 56px)`,
            marginTop: 56,
            borderRadius: "24px 24px 0px 0px",
            paddingTop: 16
          }}
        >
          <Typography style={{ marginLeft: 24, color: colors.textPencil, fontWeight: 'bold' }}>Workspace</Typography>
          <Paper elevation={0} style={{
            backgroundColor: colors.floatingCard, display: 'flex', padding: 8,
            width: 'calc(100% - 48px)', height: 'auto', marginLeft: 24,
            marginTop: 8, borderRadius: 8
          }}>
            <Typography style={{ paddingTop: 8, marginLeft: 4, color: colors.textPencil }}>
              create workspace
            </Typography>
            <div style={{ flex: 1 }} />
            <CosmoSwitch checked={canCreateWorkspace} onChange={e => {
              this.setState({ canCreateWorkspace: !canCreateWorkspace });
            }} />
          </Paper>

          <Typography style={{ marginLeft: 24, color: colors.textPencil, fontWeight: 'bold', marginTop: 16 }}>Filespace</Typography>
          <Paper elevation={0} style={{
            backgroundColor: colors.floatingCard, display: 'flex', padding: 8,
            width: 'calc(100% - 48px)', height: 'auto', marginLeft: 24,
            marginTop: 8, borderRadius: 8
          }}>
            <Typography style={{ paddingTop: 8, marginLeft: 4, color: colors.textPencil }}>
              create Filespace
            </Typography>
            <div style={{ flex: 1 }} />
            <CosmoSwitch checked={canCreateFilespace} onChange={e => {
              this.setState({ canCreateFilespace: !canCreateFilespace });
            }} />
          </Paper>

          <Typography style={{ marginLeft: 24, color: colors.textPencil, fontWeight: 'bold', marginTop: 16 }}>Blog</Typography>
          <Paper elevation={0} style={{
            backgroundColor: colors.floatingCard, display: 'flex', padding: 8,
            width: 'calc(100% - 48px)', height: 'auto', marginLeft: 24,
            marginTop: 8, borderRadius: 8
          }}>
            <Typography style={{ paddingTop: 8, marginLeft: 4, color: colors.textPencil }}>
              create Blog
            </Typography>
            <div style={{ flex: 1 }} />
            <CosmoSwitch checked={canCreateBlog} onChange={e => {
              this.setState({ canCreateBlog: !canCreateBlog });
            }} />
          </Paper>

          <Typography style={{ marginLeft: 24, color: colors.textPencil, fontWeight: 'bold', marginTop: 16 }}>Invite</Typography>
          <Paper elevation={0} style={{
            backgroundColor: colors.floatingCard, display: 'flex', padding: 8,
            width: 'calc(100% - 48px)', height: 'auto', marginLeft: 24,
            marginTop: 8, borderRadius: 8
          }}>
            <Typography style={{ paddingTop: 8, marginLeft: 4, color: colors.textPencil }}>
              send invitation
            </Typography>
            <div style={{ flex: 1 }} />
            <CosmoSwitch checked={canInviteUser} onChange={e => {
              this.setState({ canInviteUser: !canInviteUser });
            }} />
          </Paper>
        </Paper>
      </div>
    );
  }
}
