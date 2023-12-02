export const useDownload = () => {
  const downloadVideo = async (url: string) => {
    await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
  };

  return { downloadVideo };
};
