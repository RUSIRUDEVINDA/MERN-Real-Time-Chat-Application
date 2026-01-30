import { useEffect } from "react";
import ChatHeader from "./skeltons/ChatHeader";
import MessageInput from "./MessageInput";
import { useChatStore } from "../store/useChatStore.js";
import MessageSkeleton from "./skeltons/MessageSkeleton";


const ChatContainer = () => {
  const { selectedUser, messages, isMessagesLoading, getMessages } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader selectedUser={selectedUser} />
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div key={message._id}>{message.text}</div>
        ))}
      </div>
      <MessageInput />
    </div>
  )

}

export default ChatContainer;


