import React, { useEffect, useRef } from "react";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { DayDivider, MessageWrapper } from "../Message";
import useForceUpdate from "../../utils/ForceUpdate";
import { Typography } from "@mui/material";
import { colors } from "../../config/colors";
import formatDate from "../../utils/DateFormatter";

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

const Messages = ({ messages, tag, workspace, messageKeyStore, shared }) => {

    const listRef = useRef();
    const rowHeights = useRef({});
    const visibleItems = useRef({});
    const firstVisibleItemIndex = useRef();
    const dayViewer = useRef();

    useEffect(() => {
        if (messages.length > 0 && listRef.current) {
            scrollToBottom();
        }
        // eslint-disable-next-line
    }, [messages]);

    function getRowHeight(index) {
        return rowHeights.current[index] + 8 || 82;
    }

    function Row({ index, style }) {
        const rowRef = useRef({});

        useEffect(() => {
            if (rowRef.current) {
                setRowHeight(index, rowRef.current.clientHeight);
            }
            // eslint-disable-next-line
        }, [rowRef]);

        useEffect(() => {
            visibleItems.current[messages[index].id] = index;
            let temp = (Object.values(visibleItems.current).sort())[0];
            if (firstVisibleItemIndex.current !== temp) {
                firstVisibleItemIndex.current = temp;
                if (dayViewer.current) {
                    dayViewer.current.innerHTML = formatDate(messages[firstVisibleItemIndex.current]?.time);
                    dayViewer.current.style.display = 'block';
                }
            }
            return () => {
                delete visibleItems.current[messages[index].id];
                let temp2 = (Object.values(visibleItems.current).sort())[0];
                if (firstVisibleItemIndex.current !== temp2) {
                    firstVisibleItemIndex.current = temp2;
                    if (dayViewer.current) {
                        dayViewer.current.innerHTML = formatDate(messages[firstVisibleItemIndex.current]?.time);
                        dayViewer.current.style.display = 'block';
                    }
                }
            };
        }, []);

        return (
            <div style={style}>
                <div ref={rowRef} style={{ width: '100%' }}>
                    {
                        (
                            (
                                messages[index - 1] &&
                                messages[index] &&
                                (!sameDay(new Date(messages[index - 1].time), new Date(messages[index].time)))
                            ) ||
                            (
                                index === 0
                            )
                        ) ?
                            (
                                <DayDivider key={messages[index].time} dateMillis={messages[index].time} />
                            ) : null
                    }
                    <MessageWrapper msg={messages[index]} i={index} tag={tag} workspace={workspace} messageKeyStore={messageKeyStore} />
                </div>
            </div>
        );
    }

    function setRowHeight(index, size) {
        listRef.current.resetAfterIndex(0);
        rowHeights.current = { ...rowHeights.current, [index]: size };
    }

    function scrollToBottom() {
        setTimeout(() => {
            listRef.current.scrollToItem(messages.length);
        });
    }

    shared.scrollToBottom = scrollToBottom;

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <AutoSizer style={{ width: '100%', height: '100%' }}>
                {({ height, width }) => (
                    <List
                        className="List"
                        height={height - 74}
                        itemCount={messages.length}
                        itemSize={getRowHeight}
                        ref={listRef}
                        width={width}
                    >
                        {Row}
                    </List>
                )}
            </AutoSizer>
            {
                <Typography
                    ref={dayViewer}
                    style={{
                        fontSize: 14,
                        position: 'fixed',
                        borderRadius: 12,
                        paddingTop: 4,
                        paddingBottom: 4,
                        paddingLeft: 8,
                        paddingRight: 8,
                        top: 100,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: colors.textPencil,
                        background: colors.semiTransparentPaper,
                        backdropFilter: colors.backdrop,
                        display: firstVisibleItemIndex.current ? 'block' : 'none'
                    }}>
                    {formatDate(messages[firstVisibleItemIndex.current]?.time)}
                </Typography>
            }
        </div>
    );
};

export default Messages;
