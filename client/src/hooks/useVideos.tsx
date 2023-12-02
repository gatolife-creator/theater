import { useState } from "react";
import { VideoId, VideoData } from "../../../server/utils/database";

export const useVideos = () => {
  const [videos, setVideos] = useState<[VideoId, VideoData][]>([]);

  const getVideos = () => {
    fetch("/api/table")
      .then((res) => res.json())
      .then((data) => {
        setVideos(Object.entries(data));
      })
      .catch((error) => console.error("Error fetching video files:", error));
  };

  return { videos, getVideos };
};
