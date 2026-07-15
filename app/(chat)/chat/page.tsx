import { Chat } from "@/features/chat/components/chat";
import { NewChatReset } from "@/features/chat/components/new-chat-reset";

export default function ChatPage() {
  return (
    <>
      <NewChatReset />
      <Chat />
    </>
  );
}
