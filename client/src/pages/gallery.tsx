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
  const { downloadVideo } = useDownload();

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
  };

  useEffect(() => {
    getVideos();
  }, [processing]);

  return (
    <Main>
      <div className="mx-auto text-center mb-5">
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-primary w-full max-w-xs mr-2"
          onChange={(e) => {
            setDownloadId(e.target.value);
          }}
          defaultValue={downloadId}
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
      </div>

      <div className="grid grid-cols-4 gap-4">
        {videos.map(([id, title], index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in relative  hover:text-gray-500"
          >
            <button
              className="btn btn-error absolute top-0 right-0"
              onClick={() => handleDeleteClick(id)}
            >
              <ImBin className="text-lg" />
            </button>
            <Link to={`/theater?watch=${id}`}>
              <img
                src={`/api/thumbnail?id=${id}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <div className="text-sm font-bold">{title}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <p>本当に削除しますか？</p>
            <div className="flex justify-center mt-4 gap-2">
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
