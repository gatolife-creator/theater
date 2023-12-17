import express from "express";
import path from "path";
import { execSync, spawn } from "child_process";
import fs from "fs";
import { Server as IOServer } from "socket.io";

import { Database } from "../utils/database";

const router = express.Router();
let io: IOServer;

const videosDirectory = path.join(__dirname, "../videos");
const imagesDirectory = path.join(__dirname, "../images");

const json = fs.readFileSync("./utils/table.json", "utf8");
const database = new Database(new Map(Object.entries(JSON.parse(json))));

router.get("/table", async (req: express.Request, res: express.Response) => {
  await getTable(req, res);
});
router.post("/video", async (req: express.Request, res: express.Response) => {
  await getVideo(req, res);
});
router.post(
  "/download",
  async (req: express.Request, res: express.Response) => {
    await downloadVideo(req, res);
  }
);
router.delete(
  "/delete",
  async (req: express.Request, res: express.Response) => {
    await deleteVideo(req, res);
  }
);
router.get(
  "/thumbnail",
  async (req: express.Request, res: express.Response) => {
    await getThumbnail(req, res);
  }
);

async function getTable(_: express.Request, res: express.Response) {
  try {
    res.json(Database.serialize(database));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getVideo(req: express.Request, res: express.Response) {
  try {
    const id = req.body.id;
    res.sendFile(path.join(videosDirectory, `${id}.mp4`));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function downloadVideo(req: express.Request, res: express.Response) {
  try {
    const url = req.body.url;
    const id = getVideoId(url);
    const title = getVideoTitle(id);

    await downloadVideos(id);
    await downloadThumbnail(id);

    database.addVideo(id, title);
    saveDatabase();

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

function getVideoId(url: string) {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return url.match(regex)![1];
}

function getVideoTitle(id: string) {
  return execSync(`yt-dlp ${id} --get-title`).toString();
}

async function downloadVideos(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log("Downloading video");
    const download = spawn(
      "yt-dlp",
      [`${id}`, "-o", `${id}.mp4`, "-f", "mp4"],
      {
        cwd: videosDirectory,
      }
    );

    download.stdout.on("data", (chunk) => {
      const progress = calculateProgress(chunk.toString());
      io.emit("progress", { progress });
    });

    download.on("close", (code) => {
      if (code !== 0) {
        console.log(`yt-dlp process exited with code ${code}`);
      } else {
        console.log("Download completed");
        resolve();
      }
    });
  });
}

async function downloadThumbnail(id: string) {
  execSync(
    `cd ${imagesDirectory} && yt-dlp ${id} -o ${id} --write-thumbnail --no-download`
  );
}

function saveDatabase() {
  fs.writeFileSync(
    "./utils/table.json",
    JSON.stringify(Database.serialize(database))
  );
}

async function deleteVideo(req: express.Request, res: express.Response) {
  try {
    const id = req.body.id;
    database.deleteVideo(id);
    fs.rmSync(`${videosDirectory}/${id}.mp4`);
    saveDatabase();
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getThumbnail(req: express.Request, res: express.Response) {
  try {
    const id = req.query.id;
    res.sendFile(path.join(imagesDirectory, `${id}.webp`));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

function calculateProgress(chunk: Buffer): number {
  const output = chunk.toString();
  const match = output.match(/(\d+(\.\d+)?)%/);
  return match ? parseFloat(match[1]) : 0;
}

export function setIO(serverIO: IOServer) {
  io = serverIO;
}

export { router };
