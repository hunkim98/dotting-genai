import { MessageType } from "@/types/aiAssistant";

type MessageTuple = [string, React.ReactNode];

export const getMessages = (
  messages: MessageType[],
  newMessages: MessageTuple[]
) => {
  return [
    ...messages,
    ...newMessages.map(([from, content]) => {
      return {
        from,
        content,
      };
    }),
  ];
};
