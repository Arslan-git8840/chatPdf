import { ClerkProvider } from "@clerk/nextjs";    
import { DM_Sans } from "next/font/google";
import "./globals.css";


const DMSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
})

export const metadata = {
  title: "ChatPdf",
  
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${DMSans.className}`}
      >
        <div className="w-full">
        {children}
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}
