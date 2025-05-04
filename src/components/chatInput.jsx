'use client';
import { useState } from "react";
import { SendHorizontal, Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";



export default function ChatInput({ onSendMessage, placeholder = "Type your message..." }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-gray-900/40 backdrop-blur-lg border-t border-white/10 p-4 rounded-b-2xl"
    >
      {/* <Button 
        type="button"
        size="icon"
        variant="ghost"
        className="text-gray-400 hover:text-animal-purple hover:bg-animal-purple/20 rounded-full"
      >
        <Paperclip className="h-5 w-5" />
      </Button> */}
      
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-animal-purple/50 text-white placeholder-gray-400"
        />
      </div>
      
      {/* <Button
        type="button"
        size="icon"
        variant="ghost"
        className="text-gray-400 hover:text-animal-purple hover:bg-animal-purple/20 rounded-full"
      >
        <Smile className="h-5 w-5" />
      </Button> */}
      
      {/* <Button
        type="submit"
        disabled={!message.trim()}
        className="bg-animal-purple hover:bg-animal-purple/90 text-white rounded-full p-3 transition-all duration-200 disabled:opacity-50"
      >
        <SendHorizontal className="h-5 w-5" />
      </Button> */}
    </form>
  );
}
