'use client';
import React from 'react'
import { Caveat } from 'next/font/google';
import TailwindcssButtons from './ui/button';
import { useAuth, UserButton } from '@clerk/nextjs';
import Fileupload from './fileupload';

const caveat = Caveat({
    weight: ["400", "600", "700"],
    subsets: ["latin"],
})
const Home = () => {

    const { isSignedIn, userId, isLoaded } = useAuth();
    console.log(userId);
    return (
        <div className="w-full flex justify-center items-center flex-col gap-4">
            <div className='flex justify-center items-center gap-6'>
                <h1 className="text-2xl">Welcome, to the <span className={`text-pink-500 text-3xl font-bold ${caveat.className}`}>Chatpdf</span></h1>
                {isSignedIn ? <UserButton /> : null}
            </div>
            <div className="flex gap-4">
                {isSignedIn ? <div className='flex gap-4 items-center justify-center'> <TailwindcssButtons label={'Go to Chats'} /> <TailwindcssButtons label={'Manage subscription'} /> </div> : <div className='flex gap-4 items-center justify-center'> <TailwindcssButtons label={'Get Started'} /> <TailwindcssButtons label={'Manage subscription'} /> </div>}
            </div>

            <p className='text-center'>"Turn Your PDFs Into Conversations – AI-Powered Chat for Instant Insights, Summaries, and Answers!"</p>
            <div className='w-[80%]'>
                <Fileupload />
            </div>

        </div>
    )
}

export default Home