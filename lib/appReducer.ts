export type State = {
  isSidebarOpen: boolean;
};

export enum ActionType {
  UPDATE = 'UPDATE'
}

export type Action = {
  type: ActionType.UPDATE;
  field: keyof State;
  value: State[keyof State];
};

export const initialState: State = {
  isSidebarOpen: true,
};

const actionMap = new Map<ActionType, (state: State, action: Action) => State>([
  [ActionType.UPDATE, (state: State, action: Action) => {
    return { ...state, [action.field]: action.value };
  }],
]);

export const appReducer = (state: State, action: Action) => {
  const reducer = actionMap.get(action.type);
  if (!reducer) {
    return state;
  }
  return reducer(state, action);
};