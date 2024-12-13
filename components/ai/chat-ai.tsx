'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { AwaitedReactNode, JSX, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SVGProps } from "react"
import { useChat } from 'ai/react';

export default function Component() {
    const { messages, input, handleInputChange, handleSubmit } = useChat();


    return (
        <div key="1" className="grid min-h-screen w-full lg:grid-cols-full">
            <div className="flex flex-col hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                    <Link className="lg:hidden" href="#" prefetch={false}>
                        <Package2Icon className="h-6 w-6" />
                        <span className="sr-only">Home</span>
                    </Link>
                    <div className="flex-1">
                        <h1 className="font-semibold text-lg">Ask AI</h1>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    {messages.map((message: { id: Key | null | undefined; role: string; content: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
                        <div key={message.id}>
                            {message.role === 'user' ? 'User: ' : 'AI: '}
                            {message.content}
                        </div>
                    ))}
                    <form onSubmit={handleSubmit} className="grid gap-4 md:gap-6">
                        <Input name="prompt" value={input} onChange={handleInputChange} id="question" placeholder="Type your question here..." />
                        <Button type="submit" >Ask AI</Button>
                    </form>
                    <div className="p-4">
                        <h3 className="font-semibold">AI Response:</h3>
                        <p className="text-gray-500 dark:text-gray-400">Your AI response will appear here.</p>
                    </div>
                </main>
            </div>
        </div>
    )
}


function Package2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
            <path d="M12 3v6" />
        </svg>
    )
}

