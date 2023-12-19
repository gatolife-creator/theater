// import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Player } from "video-react";
import { Main } from "../components/Main";

export const Theater = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("watch");

  const videoUrl = `/api/video?id=${id}`;

  return (
    <Main>
      <div style={{ width: 600, margin: "0 auto" }}>
        <Player src={videoUrl} autoPlay />
      </div>
    </Main>
  );
};
