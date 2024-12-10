"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} from "@google/generative-ai";
import MarkdownIt from "markdown-it";
import {
    AiOutlineRobot,
    AiOutlineSend,
    AiOutlineClear,
    AiOutlineX,
} from "react-icons/ai";

const excludedPaths = ["/login", "/forgotten"];

export default function Layout({ children }: { children: React.ReactNode }) {
    const API_KEY = "AIzaSyDi-qZs_ywGuJcPYHAfN-5qJAUwV5uqugM";
    const pathname = usePathname();

    // State Management
    const [isLoading, setIsLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<
        { sender: "user" | "bot"; text: string }[]
    >([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const shouldHideComponents = excludedPaths.some((path) =>
        pathname?.includes(path)
    );

    // Effect for Loading State
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Handle Send Message
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        setMessages((prev) => [...prev, { sender: "user", text: inputMessage }]);
        setInputMessage("");
        setIsTyping(true);

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                    },
                ],
            });

            const contents = [
                {
                    role: "user",
                    parts: [{ text: `Jawab dalam bahasa Indonesia: ${inputMessage}` }],
                },
            ];
            const result = await model.generateContentStream({ contents });

            const buffer: string[] = [];
            const md = new MarkdownIt({
                html: true, // Izinkan HTML di dalam teks
                breaks: true, // Tambahkan line breaks otomatis
                linkify: true, // Buat tautan otomatis dari URL
                typographer: true, // Kutipan dan simbol otomatis
            });


            for await (const response of result.stream) {
                buffer.push(response.text());
            }
            const parsedResponse = md.render(buffer.join("") || "Tidak ada respons.");
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: parsedResponse },
            ]);

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("An unknown error occurred.");
            }
        }
        finally {
            setIsTyping(false);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (shouldHideComponents) return <>{children}</>;

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="bg-gray-200 w-full h-full">
                {isLoading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                            <p className="text-center text-sm text-gray-600">
                                Maaf jikalau responsive di HP jelek karena khusus laptop
                            </p>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </main>

            {/* AI Chatbot Toggle */}
            <div
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition"
                onClick={() => setIsChatOpen(!isChatOpen)}
                title="Toggle Chat dengan Gemini AI"
            >
                <AiOutlineRobot size={24} />
            </div>

            {/* Chatbot Window */}
            {isChatOpen && (
                <div className="fixed bottom-16 right-4 w-[300px] h-[400px] bg-white rounded-lg shadow-lg flex flex-col">
                    <div className="flex items-center justify-between p-2">
                        <AiOutlineClear
                            onClick={() => setMessages([])}
                            title="Hapus semua pesan"
                            className="cursor-pointer h-6 w-6"
                        />
                        <h2 className="text-lg font-bold text-gray-800">Chat AI</h2>
                        <AiOutlineX
                            onClick={() => setIsChatOpen(false)}
                            className="cursor-pointer"
                        />
                    </div>
                    <div className="flex-grow overflow-auto p-4 space-y-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`${msg.sender === "user"
                                    ? "ml-auto bg-blue-500 text-white"
                                    : "mr-auto bg-gray-200"
                                    } p-2 rounded-lg max-w-[80%]`}
                                dangerouslySetInnerHTML={{ __html: msg.text }}
                            />
                        ))}
                        {isTyping && (
                            <div className="mr-auto bg-gray-200 p-2 rounded-lg max-w-[80%]">
                                mengetik...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center p-2 border-t relative"
                    >
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ketik pesan..."
                            className="flex-grow rounded-lg p-2 bg-gray-100 focus:outline-none pr-10"
                            required
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 transition"
                        >
                            <AiOutlineSend size={24} />
                        </button>
                    </form>
                </div>
            )}

            <Toaster />
        </SidebarProvider>
    );
}
