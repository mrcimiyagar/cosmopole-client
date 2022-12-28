import { Slide } from "@mui/material";
import React from "react";

const TopTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default TopTransition;