import express from "express";
import path from "path";
import { router as videoRouter } from "./api/videos";

const app = express();
const port = 1234;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(express.static("public"));
app.use("/api", videoRouter);
app.get("*", (_: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});