"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} from "@google/generative-ai";
import MarkdownIt from "markdown-it";
import { AiOutlineSend, AiOutlineClear } from "react-icons/ai";

const Home = () => {
    const API_KEY = "AIzaSyDi-qZs_ywGuJcPYHAfN-5qJAUwV5uqugM";

    const [messages, setMessages] = useState<
        { sender: "user" | "bot"; text: string }[]
    >([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
                html: true,
                breaks: true,
                linkify: true,
                typographer: true,
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
        } finally {
            setIsTyping(false);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="h-screen ml-7 bg-gray-100 flex overflow-hidden">
            {/* Container Chat AI */}
            <div className="w-full h-full bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
                {/* Header Chat */}
                <div className="p-4 bg-gray-100 flex items-center justify-between border-b">
                    <h2 className="text-lg font-bold text-gray-800">Chat AI</h2>
                    <AiOutlineClear
                        onClick={() => setMessages([])}
                        title="Hapus semua pesan"
                        className="cursor-pointer text-gray-600"
                        size={24}
                    />
                </div>
                

                <div className="flex-grow overflow-auto p-4 space-y-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`${msg.sender === "user"
                                ? "ml-auto bg-blue-500 text-white"
                                : "mr-auto bg-gray-200"
                                } p-3 rounded-lg max-w-[40%]`}
                            dangerouslySetInnerHTML={{ __html: msg.text }}
                        />
                    ))}
                    {isTyping && (
                        <div className="mr-auto bg-gray-200 p-2 rounded-lg max-w-[40%]">
                            mengetik...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center p-4 bg-gray-50 border-t"
                >
                    <div className="relative w-[50%]">
                        <Input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ketik pesan..."
                            className="w-full pr-10"
                            required
                        />
                        <AiOutlineSend className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-600" size={24} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Home;
