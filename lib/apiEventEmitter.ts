import EventEmitter from "events";

export enum Event {
  UPDATE_MESSAGE = "updateMessage",
  STOP_GENERATE = "stopGenerate",
}

export const eventEmitter = new EventEmitter();
