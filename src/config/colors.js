import { createMuiTheme } from "@mui/material";
import React, { useEffect } from "react";
import { forceUpdate } from "../App";

export const filespace_toggle_button_selected_theme = createMuiTheme({
    palette: {
        secondary: {
            main: "#FFC107",
        },
    },
});

export let colors;
export let setColors;
export let themeId;
export let setThemeId;

const DARK_THEME = {
    pen: 'rgba(38, 50, 56, 1)',
    pencil: 'rgba(38, 50, 56, 0.75)',
    textPencil: '#fff',
    textPencil2: 'rgba(255, 255, 255, 0.5)',
    textPencil3: 'rgba(255, 255, 255, 0.15)',
    textAntiPencil: 'rgba(0, 0, 0, 0.35)',
    paper: 'rgba(38, 50, 56, 1)',
    semiPaper: 'rgba(42, 55, 62, 1)',
    semiTransparentPaper: 'rgba(49, 69, 73, 0.5)',
    semiTransparentPaper2: 'rgba(49, 69, 73, 0.85)',
    floatingCardSolid: 'rgba(49, 69, 73, 1)',
    floatingCard: 'rgba(49, 69, 73, 0.5)',
    floatingCard2: 'rgba(49, 69, 73, 0.5)',
    fabIcon: '#fff',
    backdrop: 'blur(10px)',
    primary: 'rgba(38, 139, 210, 1)',
    semiTransparentPrimary: 'rgba(38, 139, 210, 0.75)'
};

const LIGHT_THEME = {
    pen: 'rgba(38, 139, 210, 1)',
    pencil: 'rgba(38, 139, 210, 0.75)',
    textPencil: '#333',
    textPencil2: 'rgba(68, 68, 68, 0.5)',
    textPencil3: 'rgba(68, 68, 68, 0.15)',
    textAntiPencil: 'rgba(255, 255, 255, 0.35)',
    paper: '#fff',
    semiPaper: '#eee',
    semiTransparentPaper: 'rgba(225, 225, 225, 0.5)',
    semiTransparentPaper2: 'rgba(225, 225, 225, 0.85)',
    floatingCardSolid: 'rgba(255, 255, 255, 1)',
    floatingCard: 'rgba(255, 255, 255, 0.5)',
    floatingCard2: 'rgba(38, 139, 210, 0.75)',
    fabIcon: '#fff',
    backdrop: 'blur(10px)',
    primary: 'rgba(38, 139, 210, 1)',
    semiTransparentPrimary: 'rgba(38, 139, 210, 0.75)'
}

export function ColorSetup() {
    if (localStorage.getItem('theme') === null) localStorage.setItem('theme', 'DARK');
    [themeId, setThemeId] = React.useState(localStorage.getItem('theme'));
    [colors, setColors] = React.useState(themeId === 'LIGHT' ? LIGHT_THEME : DARK_THEME);
    useEffect(() => {
        setColors(themeId === 'LIGHT' ? LIGHT_THEME : DARK_THEME);
        var metaThemeColor = document.querySelector("meta[name=theme-color]");
        metaThemeColor.setAttribute("content", themeId === 'LIGHT' ? '#1e88e5' : '#282828');
        forceUpdate()
    }, [themeId]);
    return null;
}
