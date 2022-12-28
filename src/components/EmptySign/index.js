
import React from 'react'
import { inTheGame, isDesktop } from '../../App'
import EmptyIcon from '../../images/empty.png'
import {colors} from '../../util/settings';

export default function EmptySign(props) {
    return (
        <div style={{opacity: inTheGame ? 1 : 0, transition: 'opacity 1s', width: 250, height: 250, position: 'absolute', top: 80, left: 'calc(50% - 125px)', right: 'calc(50% - 125px)', marginTop: 80, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: colors.backdrop, borderRadius: '50%'}}>
          <img alt={''} src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
        </div>
    )
}