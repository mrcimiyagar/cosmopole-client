import { Button } from "@mui/material";
import React from "react";

export default function CommandButton({ title, onClick }) {
    return (
        <Button
            onClick={onClick}
            style={{
                width: 'calc(100% - 32px)',
                height: 48,
                marginTop: 16,
                borderRadius: 16,
                marginLeft: 16,
                marginRight: 16,
                background: "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)"
            }}>
            {title}
        </Button>
    );
}
