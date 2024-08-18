export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export enum ConversationAction {
  NEXT = "next",
  VARIANT = "variant",
}

export enum ModelType {
  GEMINI = "gemini-1.5-flash",
  AUTO = "auto",
}

export const DEFAULT_TYPE = ModelType.GEMINI;