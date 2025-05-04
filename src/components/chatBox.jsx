'use client'
import { useState, useEffect, useRef } from "react";
import  ChatHeader  from "@/components/chatHeader";
import  ChatMessage  from "@/components/chatMessage";
import ChatInput  from "@/components/chatInput";
// import { useToast } from "@/hooks/use-toast";

const initialMessages = [
  {
    id: "1",
    content: "Hello there! I'm Whiskers, your feline assistant. How can I help you today?",
    sender: "bot",
    timestamp: "10:30 AM",
    animalAvatar: "cat",
  },
  {
    id: "2",
    content: "Hi Whiskers! I'd love to learn more about animals.",
    sender: "user",
    timestamp: "10:31 AM",
    animalAvatar: "rabbit",
  },
  {
    id: "3",
    content: "That's great! What kind of animals are you interested in? I know about cats, dogs, birds, rabbits, and fish!",
    sender: "bot",
    timestamp: "10:31 AM",
    animalAvatar: "cat",
  },
];

const animalFacts = [
  "Cats sleep for about 70% of their lives.",
  "Dogs have a sense of smell that's up to 100,000 times stronger than humans.",
  "Birds have hollow bones, which helps them fly.",
  "Rabbits' teeth never stop growing throughout their lives.",
  "Most fish don't have eyelids, so they sleep with their eyes open.",
  "Some cats are actually allergic to humans.",
  "Dogs can learn over 100 words and gestures.",
  "The flamingo can only eat with its head upside down.",
  "A rabbit's teeth grow continuously throughout its life.",
  "Goldfish have a memory span of up to three months, not just a few seconds.",
];

const getRandomFact = () => animalFacts[Math.floor(Math.random() * animalFacts.length)];

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const Index = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
//   const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (content) => {
    // Add user message
    const userMessage = {
      id: generateId(),
      content,
      sender: "user",
      timestamp: formatTime(),
      animalAvatar: "rabbit", // User is always a rabbit in this example
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = {
        id: generateId(),
        content: getRandomFact(),
        sender: "bot",
        timestamp: formatTime(),
        animalAvatar: "cat", // Bot is always a cat in this example
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
      
    //   toast({
    //     title: "New message",
    //     description: "Whiskers sent you a new message",
    //     duration: 3000,
    //   });
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl h-[85vh] bg-gray-800/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl flex flex-col overflow-hidden animate-fade-in">
        <ChatHeader 
          title="Whiskers" 
          subtitle="Feline Knowledge Expert" 
          animalType="cat" 
          status="online" 
        />
        
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
              animalAvatar={message.animalAvatar}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 rounded-full p-2 flex items-center gap-1 animate-pulse">
                <div className="w-2 h-2 bg-animal-purple rounded-full animate-bounce" style={{animationDelay: "0ms"}}></div>
                <div className="w-2 h-2 bg-animal-purple rounded-full animate-bounce" style={{animationDelay: "150ms"}}></div>
                <div className="w-2 h-2 bg-animal-purple rounded-full animate-bounce" style={{animationDelay: "300ms"}}></div>
              </div>
              <span className="text-xs text-gray-400">Whiskers is typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} placeholder="Ask me about animals..." />
      </div>
    </div>
  );
};

export default Index;
