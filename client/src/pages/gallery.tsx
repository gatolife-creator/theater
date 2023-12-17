import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { ImBin } from "react-icons/im";
import { Main } from "../components/Main";
import { useVideos } from "../hooks/useVideos";
import { useDelete } from "../hooks/useDelete";
import { useDownload } from "../hooks/useDownload";

export const Gallery = () => {
  const { videos, getVideos } = useVideos();
  const { deleteVideo } = useDelete();
  const { downloadVideo, progress } = useDownload();

  const [modalOpen, setModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [downloadId, setDownloadId] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleDeleteClick = (id: string) => {
    setVideoToDelete(id);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (videoToDelete) {
      setProcessing(true);
      await deleteVideo(videoToDelete);
      setModalOpen(false);
      setVideoToDelete(null);
      setProcessing(false);
    }
  };

  const handleDeleteCancel = () => {
    setModalOpen(false);
    setVideoToDelete(null);
  };

  const handleDownloadClick = async () => {
    setProcessing(true);
    await downloadVideo(downloadId);
    setProcessing(false);
    setDownloadId("");
  };

  useEffect(() => {
    getVideos();
  }, [processing]);

  return (
    <Main>
      <div className="mx-auto mb-5 text-center">
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-primary mr-2 w-full max-w-xs"
          onChange={(e) => {
            setDownloadId(e.target.value);
          }}
          value={downloadId}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            await handleDownloadClick();
          }}
        >
          {!processing && "download"}
          {processing && (
            <Oval
              color="white"
              secondaryColor="transparent"
              width="1rem"
              height="1rem"
              wrapperStyle={{ margin: "0 auto" }}
            />
          )}
        </button>
        {processing && (
          <div className="mx-auto mb-5 text-center">
            <progress
              className="progress w-full max-w-xs"
              value={progress}
              max="100"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {videos.map(([id, title], index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg border shadow-lg transition-shadow duration-300 ease-in hover:text-gray-500  hover:shadow-xl"
          >
            <button
              className="btn btn-error absolute right-0 top-0"
              onClick={() => handleDeleteClick(id)}
            >
              <ImBin className="text-lg" />
            </button>
            <Link to={`/theater?watch=${id}`}>
              <img
                src={`/api/thumbnail?id=${id}`}
                className="h-40 w-full object-cover"
              />
              <div className="p-2">
                <div className="text-sm font-bold">{title}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 text-center">
            <p>本当に削除しますか？</p>
            <div className="mt-4 flex justify-center gap-2">
              <button className="btn btn-neutral" onClick={handleDeleteCancel}>
                キャンセル
              </button>
              <button
                className="btn btn-error text-white"
                onClick={async () => {
                  await handleDeleteConfirm();
                }}
              >
                {!processing && "削除する"}
                {processing && (
                  <Oval
                    color="white"
                    secondaryColor="transparent"
                    width="1rem"
                    height="1rem"
                    wrapperStyle={{ margin: "0 auto" }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Main>
  );
};
