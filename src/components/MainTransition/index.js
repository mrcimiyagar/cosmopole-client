import { Fade, Slide } from "@mui/material";
import React from "react";

const MainTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default MainTransition;
