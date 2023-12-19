import { useSearchParams } from "react-router-dom";
import { Player } from "video-react";
import { Main } from "../components/Main";

export const Theater = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("watch");

  const videoUrl = `/api/video?id=${id}`;

  return (
    <Main>
      <div className="sm:w-600 mx-auto w-full">
        <Player src={videoUrl} autoPlay />
      </div>
    </Main>
  );
};
