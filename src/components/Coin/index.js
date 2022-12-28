import { Avatar } from "@mui/material";
import { blue, green, purple, red, yellow } from "@mui/material/colors";
import React from "react";
import { colors } from "../../config/colors";
import { me } from "../../core/memory";
import "./index.scss";

export default function Coin({ Icon, isProfile }) {
  let avatarBackColor = me.avatarBackColor;
  return (
    <div className="coin">
      <div className="coin__front">
        <div
          className="coin_front_wrapper" style={isProfile ? { margin: 12, width: 'calc(100% - 24px)', height: 'calc(100% - 24px)' } : {}}>
          {
            isProfile ? (
              <Avatar style={{ width: '100%', height: '100%', fontSize: 60 }} sx={{
                bgcolor: avatarBackColor < 2 ? blue[400] :
                  avatarBackColor < 4 ? purple[400] :
                    avatarBackColor < 6 ? red[400] :
                      avatarBackColor < 8 ? green[400] :
                        yellow[600]
              }}>
                {me.firstName?.substring(0, 1).toUpperCase()}
              </Avatar>
            ) : (
              <Icon style={{ width: '100%', height: '100%', fill: colors.fabIcon }} />
            )
          }
        </div>
      </div>
      <div className="coin__edge">
        {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((i, index) => (
          <div key={'coin_' + index}></div>
        ))}
      </div>
      <div className="coin__back">
        <div
          className="coin_front_wrapper" style={isProfile ? { margin: 12, width: 'calc(100% - 24px)', height: 'calc(100% - 24px)' } : {}}>
          {
            isProfile ? (
              <Avatar style={{ width: '100%', height: '100%', fontSize: 60 }} sx={{
                bgcolor: avatarBackColor < 2 ? blue[400] :
                  avatarBackColor < 4 ? purple[400] :
                    avatarBackColor < 6 ? red[400] :
                      avatarBackColor < 8 ? green[400] :
                        yellow[600]
              }}>
                {me.firstName?.substring(0, 1).toUpperCase()}
              </Avatar>
            ) : (
              <Icon style={{ width: '100%', height: '100%', fill: colors.fabIcon }} />
            )
          }
        </div>
      </div>
    </div >
  );
}
