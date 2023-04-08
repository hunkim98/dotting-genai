export enum From {
  USER = "user",
  AI = "ai",
}

export enum ChatType {
  TEXT = "text",
  GENAIIMAGE = "genAiImage",
}

export type MessageType = {
  type: ChatType;
  from: From;
  content: string;
};

export type OptionType = {
  title: string;
  action: () => void; // TODO: modify function type
};
