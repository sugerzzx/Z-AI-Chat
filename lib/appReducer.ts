import { MessageWithChildren } from "@/types/conversation";

export type State = {
  isSidebarOpen: boolean;
  messageList: MessageWithChildren[];
  conversationId: string;
};

export enum ActionType {
  UPDATE = "UPDATE",
  ADD_MESSAGE = "ADD_MESSAGE",
  UPDATE_MESSAGE = "UPDATE_MESSAGE",
}

type UpdateAction = {
  type: ActionType.UPDATE;
  field: keyof State;
  value: State[keyof State];
};

type MessageAction = {
  type: ActionType.ADD_MESSAGE | ActionType.UPDATE_MESSAGE;
  message: MessageWithChildren;
};

export type Action = UpdateAction | MessageAction;

export const initialState: State = {
  isSidebarOpen: true,
  messageList: [],
  conversationId: "",
};

export const appReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE:
      return { ...state, [action.field]: action.value };
    case ActionType.ADD_MESSAGE:
      return { ...state, messageList: state.messageList.concat(action.message) };
    case ActionType.UPDATE_MESSAGE:
      const messageList = state.messageList.map((message) => {
        if (message.id === action.message.id) {
          return action.message;
        }
        return message;
      });
      return { ...state, messageList };
    default:
      return state;
  }
};
