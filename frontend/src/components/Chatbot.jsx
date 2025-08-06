import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, User } from "lucide-react"


export default function Chatbot() {
    const [messages, setMessages] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const [hideChatbot, setHideChatbot] = useState(false)
    const messagesEndRef = useRef(null)
    const presetMessages = ["Hello", "What are your store hours?", "Recommend me a product"]

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])


    useEffect(() => {
        const handleScroll = () => {
            const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
            setHideChatbot(scrolledToBottom)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const sendMessage = async (message) => {
        const newMessages = [...messages, { text: message, sender: "user" }]
        setMessages(newMessages)
        setInput("")

        try {
            const response = await fetch("https://shopx-mf2i.onrender.com/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            })

            if (!response.ok) {
                throw new Error("Failed to fetch response from bot")
            }

            const data = await response.json()
            const botResponse = data.response

            if (Array.isArray(botResponse)) {
                const productList = botResponse.map(
                    (product) => `<li class="mb-2"><strong>${product.name}</strong> - ${product.price} USD</li>`,
                )
                setMessages([
                    ...newMessages,
                    { text: `<ul class="list-disc pl-5 space-y-1">${productList.join("")}</ul>`, sender: "bot", isHtml: true },
                ])
            } else {
                setMessages([...newMessages, { text: botResponse, sender: "bot" }])
            }
        } catch (error) {
            console.error(error)
            setMessages([...newMessages, { text: "Sorry, I couldn't understand that.", sender: "bot" }])
        }
    }

    return (
        <AnimatePresence>
            {!hideChatbot && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }} // Smooth fade-out animation
                    className="fixed bottom-4 right-4 flex flex-col items-end z-50"
                >
                    <AnimatePresence>
                        {!isOpen && (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
                                onClick={() => setIsOpen(true)}
                            >
                                <MessageCircle className="w-8 h-8 text-white" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col w-full max-w-sm md:max-w-md h-[32rem] mx-auto p-4 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 to-black text-white font-sans relative overflow-hidden border border-gray-700"
                            >
                                <button
                                    className="absolute top-2 right-2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                    AI Assistant
                                </div>
                                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex items-start p-3 rounded-xl ${msg.sender === "user" ? "bg-indigo-900 ml-auto" : "bg-gray-800"
                                                } max-w-[80%]`}
                                        >
                                            {msg.sender === "bot" ? (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mr-2 flex-shrink-0">
                                                    <MessageCircle className="w-5 h-5 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center ml-2 order-2 flex-shrink-0">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                            <div className={`whitespace-pre-wrap ${msg.sender === "user" ? "text-right mr-2" : "text-left"}`}>
                                                {msg.isHtml ? <div dangerouslySetInnerHTML={{ __html: msg.text }} /> : msg.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Type your message..."
                                            className="flex-1 p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            onKeyPress={(e) => e.key === "Enter" && input.trim() && sendMessage(input)}
                                        />
                                        <button
                                            onClick={() => input.trim() && sendMessage(input)}
                                            className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg hover:opacity-90 transition-opacity duration-200"
                                        >
                                            <Send className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {presetMessages.map((msg, index) => (
                                            <button
                                                key={index}
                                                className="px-3 py-1 text-sm bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors duration-200"
                                                onClick={() => sendMessage(msg)}
                                            >
                                                {msg}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
