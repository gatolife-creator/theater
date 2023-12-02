import { mapToObject } from "./converter";
export type VideoId = string;
export type VideoData = string;
export type VideoTable = Map<VideoId, VideoData>;
export type SerializedVideoTable = { [key: VideoData]: VideoData };
export type SerializedDatabase = string;

export class Database {
  table: VideoTable;

  constructor(table: VideoTable) {
    this.table = table;
  }

  getTable(): VideoTable | undefined {
    return this.table;
  }

  getVideoDataAsArray(): VideoData[] {
    return Array.from(this.table as VideoTable).map(([_, title]) => title);
  }

  getVideoDataById(id: string) {
    return this.table?.get(id);
  }

  addVideo(id: string, title: string) {
    this.table?.set(id, title);
  }

  deleteVideo(id: string): void {
    this.table?.delete(id);
  }

  static serialize(database: Database) {
    const serialized = mapToObject(database.table);
    return serialized;
  }
}
