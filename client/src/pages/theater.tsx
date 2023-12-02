import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Player } from "video-react";
import { Main } from "../components/Main";

export const Theater = () => {
  const [searchParams] = useSearchParams();
  const [video, setVideo] = useState("");
  const id = searchParams.get("watch");

  useEffect(() => {
    fetch("/api/video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (!res.ok) {
          throw "動画取得エラー";
        }
        return res.blob();
      })
      .then((blob) => {
        setVideo(URL.createObjectURL(blob).toString());
      });
  }, []);

  return (
    <Main>
      <div style={{ width: 600, margin: "0 auto" }}>
        <Player src={video} autoPlay />
      </div>
    </Main>
  );
};
