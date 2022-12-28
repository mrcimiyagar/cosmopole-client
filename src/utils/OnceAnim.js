import { Zoom } from "@mui/material";

export let animOnce = (comp) => {
    return {
        check: ({ props, memory }) => {
            return props.transitionFlag ?
                comp : (
                    <Zoom in={memory.showView}>
                        {comp}
                    </Zoom>
                )
        }
    }
}
