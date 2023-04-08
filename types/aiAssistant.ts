export enum From {
  USER = "user",
  AI = "ai",
}

export type MessageType = { from: From; content: React.ReactNode };

export type OptionType = {
  title: string;
  action: () => void; // TODO: modify function type
};
