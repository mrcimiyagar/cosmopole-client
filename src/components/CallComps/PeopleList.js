import { globalScreens, globalVideos, needUpdate, videoCache, globalShownScreens, globalShownVideos } from "./CallContainer";
import MediaBox from './MediaBox';
import { fetchMyUserId } from "../../core/storage/me";

export default function PeopleList() {
    var result = Object.keys(globalVideos).concat(Object.keys(globalScreens)).unique();
    let tempResult = [];
    result.forEach((item) => {
        let keyParts = item.split("_");
        tempResult.push(keyParts[0]);
    });
    result = tempResult.unique();
    return (
        <div
            style={{
                width: 1000,
                height: "calc(100% - 32px)",
                display: "flex",
            }}
        >
            {result.map((key) => {
                if (needUpdate[key] === true || videoCache[key] === undefined) {
                    videoCache[key] = (
                        <div
                            style={{
                                width: "auto",
                                height: "100%",
                                marginLeft: 16,
                                marginTop: 16
                            }}
                        >
                            <MediaBox id={key} videos={globalVideos} screens={globalScreens} shownVideos={globalShownVideos} showScreens={globalShownScreens} />
                        </div>
                    );
                    delete needUpdate[key];
                }
                if (fetchMyUserId() === key) return null;
                if (
                    globalShownVideos[key] !== true &&
                    globalShownScreens[key] !== true
                )
                    return null;
                return videoCache[key];
            }).filter((el) => el !== null)}
        </div>
    );
}
