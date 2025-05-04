'use client';
import React, { useRef, useState } from 'react';
import {
  MessageSquare,
  FileText,
  Menu,
  X,
  Plus,
  Send,
  Rabbit,
  Cat,
  Dog,
  Bird
} from 'lucide-react';
import { EmbeddingDocs } from '@/lib/embeddings';
import axios from 'axios';
import { main } from '@/lib/gemini';
import { cn } from "@/lib/utils";
import { AnimalAvatar } from "@/components/animalAvatar";

const ChatLayout = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'React Project Discussion' },
    { id: 2, title: 'Tailwind CSS Styling' },
    { id: 3, title: 'PDF Viewer Implementation' },
  ]);

  const pdfUrl = 'https://cloud.appwrite.io/v1/storage/buckets/67e424bc00198fca67f1/files/67e961d00004fe4139a7/view?project=67e41fbf001797328401&mode=admin';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = inputRef.current.value.trim();
    if (!message) return;

    setMessages(prev => [...prev, { role: 'user', text: message }]);
    setLoading(true);

    try {
      const res = await EmbeddingDocs(message);
      if (!res) throw new Error("No response from embeddings");
      console.log('Embeddings result:', res);
      const embeddings = res?.values;

      const response = await axios.post("/api/query-result", { embeddings });
      console.log('API /query-result response:', response);
      const result = response?.data?.result;
      console.log('Filtered result:', result);
      const texts = result.filter(item => item.score > 0.6).map(item => item.metadata.text);
      console.log('Filtered texts with score > 0.6:', texts);
      const string = texts.join(' ');
      console.log('Combined context string:', string);

      const geminiResponse = await main({ pdfText: string, userQuestion: message });
      console.log('Gemini response:', geminiResponse);
      setMessages(prev => [...prev, { role: 'assistant', text: geminiResponse.text }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Something went wrong. Please try again.' }]);
    } finally {
      inputRef.current.value = "";
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black">
      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800/50 backdrop-blur-md p-2 rounded-full text-white border border-white/10 shadow-lg hover:bg-[#9b87f5]/50 transition-colors"
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Chat History Sidebar */}
      <div className={`
        fixed md:static left-0 top-0 bottom-0 w-72 
        bg-black backdrop-blur-md transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 z-40
        flex flex-col p-4 border-r border-white/10
        md:w-72
        md:block
      `}>
        <div className="flex justify-between items-center mb-6 p-2 bg-gray-800/50 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold text-white ml-2">Chat History</h2>
          <button className="hover:bg-[#9b87f5]/30 p-2 rounded-full transition-colors">
            <Plus className="text-[#9b87f5]" />
          </button>
        </div>
        <div className="space-y-2 overflow-y-auto">
          {chatHistory.map((chat, index) => (
            <div
              key={chat.id}
              className="p-3 hover:bg-gray-800/50 rounded-xl cursor-pointer flex items-center group transition-all duration-200 border border-transparent hover:border-white/10"
            >
              <AnimalAvatar 
                animal={index % 4 === 0 ? "cat" : index % 4 === 1 ? "dog" : index % 4 === 2 ? "rabbit" : "bird"} 
                size="sm" 
                className="mr-3"
              />
              <span className="truncate text-white">{chat.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Viewer Section */}
      {/* <div className="hidden md:block w-1/2 p-4 overflow-auto">
        <div className="bg-black backdrop-blur-md shadow-xl rounded-2xl p-4 h-full flex items-center justify-center border border-white/10">
          <iframe 
            src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`} 
            className="h-full w-full rounded-xl" 
            frameBorder="0"
          />
        </div>
      </div> */}

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <div className="bg-black backdrop-blur-md p-4 border-b border-white/10 rounded-t-2xl mx-4 mt-4">
          <div className="flex items-center">
            <AnimalAvatar animal="cat" size="md" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-white">Whiskers</h3>
              <p className="text-xs text-gray-300">ChatPdf</p>
            </div>
            <div className="ml-auto flex items-center">
              <span className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm text-white/70">Online</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 mx-4 bg-gray-800/20 backdrop-blur-md">
          {/* Chat messages */}
          <div className="space-y-4 max-w-6xl mx-auto">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <AnimalAvatar animal="cat" size="lg" className="mx-auto mb-4" />
                <p className="text-white/70">Ask me anything about your PDF!</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={cn(
                "flex items-end gap-2 mb-4",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}>
                {msg.role !== 'user' && <AnimalAvatar animal="cat" size="sm" />}
                
                <div className="flex flex-col">
                  <div className={msg.role === 'user' ? "bg-[#9b87f5] rounded-2xl px-4 py-3 max-w-[85%] shadow-md text-white ml-auto animate-slide-in" : 
                    "bg-gray-800 text-white rounded-2xl px-4 py-3 max-w-[85%] shadow-md mr-auto animate-slide-in"}>
                    <p>{msg.text}</p>
                  </div>
                  <span className={cn(
                    "text-xs text-gray-400 mt-1",
                    msg.role === 'user' ? "text-right" : "text-left"
                  )}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {msg.role === 'user' && <AnimalAvatar animal="rabbit" size="sm" />}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-center gap-2 mb-4">
                <AnimalAvatar animal="cat" size="sm" />
                <div className="bg-gray-800 rounded-full p-2 flex items-center gap-1 animate-pulse">
                  <div className="w-2 h-2 bg-[#9b87f5] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-[#9b87f5] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-[#9b87f5] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span className="text-xs text-gray-400">Thinking...</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 mx-4 mb-4 rounded-b-2xl bg-gray-800/30 backdrop-blur-lg border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              placeholder="Ask about your document..."
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#9b87f5]/50 text-white placeholder-gray-400"
              ref={inputRef}
            />
            <button 
              className="bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-white rounded-full p-3 transition-all duration-200 disabled:opacity-50"
              type="submit" 
              disabled={loading}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
