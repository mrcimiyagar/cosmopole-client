import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Typography } from "@mui/material";
import { colors } from "../../config/colors";

export default function PhotosTimeline({ days }) {
  return (
    <div
      style={{
        position: "absolute",
        right: 'calc(-50% + 24px)',
        width: "100%",
      }}
    >
      <React.Fragment>
        <Timeline position="alternate">
          {
            days.map(day => {
              return (
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    <Typography variant="caption" style={{ fontWeight: "bold", color: colors.textPencil }}>
                      {new Date(day * 8.64e7).toDateString()}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot style={{ background: colors.textPencil }} />
                    <TimelineConnector
                      style={{ height: 300, background: colors.textPencil }}
                    />
                  </TimelineSeparator>
                  <TimelineContent></TimelineContent>
                </TimelineItem>
              )
            })
          }
        </Timeline>
      </React.Fragment>
    </div>
  );
}
