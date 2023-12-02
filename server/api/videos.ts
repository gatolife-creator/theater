import express from "express";
import path from "path";
import { execSync } from "child_process";
import fs from "fs";

import { Database } from "../utils/database";

const router = express.Router();

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
router.delete("/delete", async (req: express.Request, res: express.Response) => {
  await deleteVideo(req, res);
});
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

async function downloadVideos(id: string) {
  execSync(`cd ${videosDirectory} && yt-dlp ${id} -o ${id}.mp4 -f mp4`);
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
    fs.rmSync(`${imagesDirectory}/${id}.webp`);
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

export { router };
