import { AnimalAvatar } from "./AnimalAvatar";
import { cn } from "@/lib/utils";


export default function ChatMessage({
  content,
  sender,
  timestamp,
  animalAvatar,
  className,
  showAvatar = true,
}) {
  const isUser = sender === "user";

  return (
    <div
      className={cn(
        "flex items-end gap-2 mb-4",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      {!isUser && showAvatar && <AnimalAvatar animal={animalAvatar} size="sm" />}
      
      <div className="flex flex-col">
        <div className={isUser ? "message-user text-white" : "message-bot"}>
          <p>{content}</p>
        </div>
        <span className={cn(
          "text-xs text-gray-400 mt-1",
          isUser ? "text-right" : "text-left"
        )}>
          {timestamp}
        </span>
      </div>
      
      {isUser && showAvatar && <AnimalAvatar animal={animalAvatar} size="sm" />}
    </div>
  );
}
