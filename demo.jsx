'use client';
import React, { useRef, useState } from 'react';
import {
  MessageSquare,
  FileText,
  Menu,
  X,
  Plus,
  Send
} from 'lucide-react';
import { EmbeddingDocs } from '@/lib/embeddings';
import axios from 'axios';
import { main } from '@/lib/gemini';

const ChatLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'React Project Discussion' },
    { id: 2, title: 'Tailwind CSS Styling' },
    { id: 3, title: 'PDF Viewer Implementation' },
  ]);

  const pdfUrl = 'https://cloud.appwrite.io/v1/storage/buckets/67e424bc00198fca67f1/files/67e961d00004fe4139a7/view?project=67e41fbf001797328401&mode=admin'
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = inputRef.current.value.trim();
    if (!message) return;
    console.log("Submitted message:", message);
    try {
      const res = await EmbeddingDocs(message);
      if (!res) throw new error("no response from embeddings");
      console.log('embeddings:', res);
      const embeddings = res?.values;
      const response = await axios.post("/api/query-result", {
        embeddings,
      });
      console.log(response);  // res.data.result = [{ score, id,  metadata: { text , pageNumber}}]
      const result = response?.data?.result; // [{ score, id,  metadata: { text , pageNumber}}]
      console.log(result);
      const texts = result.filter(item => item.score > 0.6).map(item => item.metadata.text);

      console.log('texts:', texts);

      const string = texts.join(' ');
      console.log('string:', string);

      const geminiResponse = await main({ pdfText: string, userQuestion: message });
      console.log('gemini:', geminiResponse);  // { text, role : 'assistant' }

    } catch (error) {
      console.log(error);
    } finally {
      inputRef.current.value = "";
    }
  };


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-100 p-2 rounded-md"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Chat History Sidebar */}
      <div className={`
        fixed md:static left-0 top-0 bottom-0 w-64 bg-gray-100 
        transform transition-transform duration-300 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 z-40 
        flex flex-col p-4 border-r
      `}>
        <div className="flex justify-between items-center mb-6 border-3 border-black border-dotted rounded-2xl">
          <h2 className="text-xl md:ml-4 ml-[45px] font-bold">Chat History</h2>
          <button className=" hover:bg-pink-200 p-2 rounded-2xl">
            <Plus className='text-pink-500' />
          </button>
        </div>
        <div className="space-y-2 overflow-y-auto">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className="p-3 hover:bg-gray-200 rounded-md cursor-pointer flex items-center"
            >
              <MessageSquare className="mr-2 text-gray-500" size={20} />
              <span className="truncate">{chat.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Viewer Section */}
      <div className="hidden md:block w-1/2 bg-gray-50 p-6 overflow-auto">
        <div className="bg-white shadow-md rounded-lg p-4 h-full flex items-center justify-center">
          <iframe src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`} className='h-full w-full' frameborder="0" color='purple'></iframe>
          {/* <div className="text-center">
            <FileText className="mx-auto mb-4 text-pink-400" size={48} />
            <p className="text-gray-600">No PDF selected</p>
          </div> */}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-gray-100 p-4 border-b-2 border-dotted flex items-center">
          <h3 className="text-lg font-semibold mt-[7px] md:ml-[52px]">Chat Interface</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Chat messages would go here */}
          <div className="text-center text-gray-500">
            No messages yet
          </div>
        </div>

        <div className="p-4 border-t border-b-2 border-dotted">
          <div>
            <form onSubmit={handleSubmit} className='flex space-x-2 flex-1'>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border-2 border-dotted rounded-md focus:outline-none focus:ring-2 focus:border-none focus:ring-pink-500"
                ref={inputRef}
              />
              <button className="p-2 rounded-md border-2 border-dotted" type='submit'>
                <Send className='text-pink-500' />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        />
      )}
    </div>
  );
};

export default ChatLayout;


// after adding chats 
// 'use client';
// import React, { useRef, useState } from 'react';
// import {
//   MessageSquare,
//   FileText,
//   Menu,
//   X,
//   Plus,
//   Send
// } from 'lucide-react';
// import { EmbeddingDocs } from '@/lib/embeddings';
// import axios from 'axios';
// import { main } from '@/lib/gemini';
// import Index from '@/components/chatBox';

// const ChatLayout = () => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [chatHistory, setChatHistory] = useState([
//     { id: 1, title: 'React Project Discussion' },
//     { id: 2, title: 'Tailwind CSS Styling' },
//     { id: 3, title: 'PDF Viewer Implementation' },
//   ]);

//   const pdfUrl = 'https://cloud.appwrite.io/v1/storage/buckets/67e424bc00198fca67f1/files/67e961d00004fe4139a7/view?project=67e41fbf001797328401&mode=admin'
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const inputRef = useRef();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const message = inputRef.current.value.trim();
//     if (!message) return;

//     // Add user message to chat
//     setMessages(prev => [...prev, { role: 'user', text: message }]);
//     setLoading(true);

//     try {
//       const res = await EmbeddingDocs(message);
//       if (!res) throw new Error("No response from embeddings");
//       console.log('Embeddings result:', res);
//       const embeddings = res?.values;

//       const response = await axios.post("/api/query-result", { embeddings });
//       console.log('API /query-result response:', response);
//       const result = response?.data?.result;
//       console.log('Filtered result:', result);
//       const texts = result.filter(item => item.score > 0.6).map(item => item.metadata.text);
//       console.log('Filtered texts with score > 0.6:', texts);
//       const string = texts.join(' ');
//       console.log('Combined context string:', string);

//       const geminiResponse = await main({ pdfText: string, userQuestion: message });
//       console.log('Gemini response:', geminiResponse);
//       // Add Gemini response to chat
//       setMessages(prev => [...prev, { role: 'assistant', text: geminiResponse.text }]);

//     } catch (error) {
//       console.error(error);
//       setMessages(prev => [...prev, { role: 'assistant', text: 'Something went wrong. Please try again.' }]);
//     } finally {
//       inputRef.current.value = "";
//       setLoading(false);
//     }
//   };



//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Mobile Menu Toggle */}
//       <button
//         onClick={toggleSidebar}
//         className="fixed top-4 left-4 z-50 md:hidden bg-gray-100 p-2 rounded-md"
//       >
//         {isSidebarOpen ? <X /> : <Menu />}
//       </button>

//       {/* Chat History Sidebar */}
//       <div className={`
//         fixed md:static left-0 top-0 bottom-0 w-64 bg-gray-100 
//         transform transition-transform duration-300 
//         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         md:translate-x-0 z-40 
//         flex flex-col p-4 border-r
//       `}>
//         <div className="flex justify-between items-center mb-6 border-3 border-black border-dotted rounded-2xl">
//           <h2 className="text-xl md:ml-4 ml-[45px] font-bold">Chat History</h2>
//           <button className=" hover:bg-pink-200 p-2 rounded-2xl">
//             <Plus className='text-pink-500' />
//           </button>
//         </div>
//         <div className="space-y-2 overflow-y-auto">
//           {chatHistory.map((chat) => (
//             <div
//               key={chat.id}
//               className="p-3 hover:bg-gray-200 rounded-md cursor-pointer flex items-center"
//             >
//               <MessageSquare className="mr-2 text-gray-500" size={20} />
//               <span className="truncate">{chat.title}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* PDF Viewer Section */}
//       <div className="hidden md:block w-1/2 bg-gray-50 p-6 overflow-auto">
//         <div className="bg-white shadow-md rounded-lg p-4 h-full flex items-center justify-center">
//           <iframe src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`} className='h-full w-full' frameborder="0" color='purple'></iframe>
//           {/* <div className="text-center">
//             <FileText className="mx-auto mb-4 text-pink-400" size={48} />
//             <p className="text-gray-600">No PDF selected</p>
//           </div> */}
//         </div>
//       </div>

//       {/* Chat Interface */}
//       <div className="flex-1 flex flex-col bg-white">
//         <div className="bg-gray-100 p-4 border-b-2 border-dotted flex items-center">
//           <h3 className="text-lg font-semibold mt-[7px] md:ml-[52px]">Chat Interface</h3>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4">
//           {/* Chat messages would go here */}
//           <div className="space-y-4 max-w-2xl mx-auto">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-gray-400 text-right' : 'bg-gray-200 text-left'
//                   }`}
//               >
//                 <p className="text-sm">{msg.text}</p>
//               </div>
//             ))}
//           </div>

//         </div>

//         <div className="p-4 border-t border-b-2 border-dotted">
//           <div>
//             <form onSubmit={handleSubmit} className='flex space-x-2 flex-1'>
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 className="flex-1 p-2 border-2 border-dotted rounded-md focus:outline-none focus:ring-2 focus:border-none focus:ring-pink-500"
//                 ref={inputRef}
//               />
//               <button className="p-2 rounded-md border-2 border-dotted" type="submit" disabled={loading}>
//                 {loading ? (
//                   <div className="h-5 w-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <Send className="text-pink-500" />
//                 )}
//               </button>

//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Overlay for mobile sidebar */}
//       {isSidebarOpen && (
//         <div
//           onClick={toggleSidebar}
//           className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
//         />
//       )}
//     </div>
//   );
// };

// export default ChatLayout;