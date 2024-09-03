// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Import a highlight.js theme
import { MdOutlineContentCopy, MdSend } from "react-icons/md";
import { Map, List } from "immutable";
import { useGlobalContext } from "@/context/global";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactDOMServer from "react-dom/server";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you
import { FaCheck } from "react-icons/fa6";

const ChatBubble: React.FC<{ message: Map<string, any> }> = ({ message }) => {
  return (
    <div
      className={`chat-bubble ${
        message.get("isUser") ? "chat-bubble-user" : "chat-bubble-bot"
      }`}
    >
      <ReactMarkdown
        components={{
          code({ node, className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div
                style={{
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: 25,
                    padding: "0px 10px",
                    backgroundColor: "#1e1e1e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: 10 }}>{match[1]}</span>
                  <ButtonCopyCode
                    content={String(children).replace(/\n$/, "")}
                  />
                </div>
                <SyntaxHighlighter
                  customStyle={{
                    margin: 0,
                    fontSize: innerWidth < 768 ? 10 : 14,
                  }}
                  style={nightOwl}
                  language={match[1]}
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  // {...props}
                />
              </div>
            ) : (
              <code
                className={className}
                style={{ backgroundColor: "#1e1e1e" }}
                children={children}
              />
            );
          },
        }}
        className="markdown"
        children={message.get("text") as string}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      ></ReactMarkdown>
    </div>
  );
};

const ChatBubbleMemo: React.FC<{ message: Map<string, any> }> = React.memo(
  ({ message }) => {
    return (
      <div
        className={`chat-bubble ${
          (message.get("isUser") as boolean)
            ? "chat-bubble-user"
            : "chat-bubble-bot"
        }`}
      >
        <ReactMarkdown
          components={{
            code({ node, className, children }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: 25,
                      padding: "0px 10px",
                      backgroundColor: "#1e1e1e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    <span style={{ fontSize: 10 }}>{match[1]}</span>
                    <ButtonCopyCode
                      content={String(children).replace(/\n$/, "")}
                    />
                  </div>
                  <SyntaxHighlighter
                    customStyle={{
                      margin: 0,
                      fontSize: innerWidth < 768 ? 10 : 14,
                      borderRadius: "0px 0px 20px 20px",
                    }}
                    style={nightOwl}
                    language={match[1]}
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    // {...props}
                  />
                </div>
              ) : (
                <code
                  className={className}
                  style={{ backgroundColor: "#1e1e1e" }}
                  children={children}
                />
              );
            },
          }}
          className="markdown"
          children={message.get("text") as string}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        />
        {!(message.get("isUser") as boolean) && (
          <ButtonCopy content={message.get("text")} />
        )}
      </div>
    );
  }
);

const ButtonCopy = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <button
      style={{
        margin: "10px 0",
        display: "flex",
        alignItems: "center",
      }}
      onClick={(e) => {
        e.currentTarget.style.opacity = "0.5";
        setCopied(true);
        navigator.clipboard.writeText(content);
      }}
      className="btncopy"
    >
      {copied ? (
        <FaCheck size={15} color="white" />
      ) : (
        <MdOutlineContentCopy size={15} color="white" />
      )}
      <span
        style={{
          marginLeft: 5,
          fontSize: 12,
          verticalAlign: "center",
          textAlign: "center",
        }}
      >
        {copied ? "Disalin" : "Salin Teks"}
      </span>
    </button>
  );
};

const ButtonCopyCode = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
      }}
      onClick={(e) => {
        e.currentTarget.style.opacity = "0.5";
        setCopied(true);
        navigator.clipboard.writeText(content);
      }}
      className="btncopy"
    >
      {copied ? (
        <FaCheck size={13} color="white" />
      ) : (
        <MdOutlineContentCopy size={13} color="white" />
      )}
      <span
        style={{
          marginLeft: 5,
          fontSize: 10,
          verticalAlign: "center",
          textAlign: "center",
        }}
      >
        {copied ? "Disalin" : "Salin Kode"}
      </span>
    </button>
  );
};

const HomePage: React.FC = React.memo(() => {
  const { innerWidth } = useGlobalContext();
  const [messages, setMessages] = useState<List<Map<string, any>>>(List([]));

  const [inRenderedMessage, setInRenderedMessage] = useState<
    List<Map<string, any>>
  >(List([]));

  const [inputValue, setInputValue] = useState("");
  const [isFinishRenderMessage, setIsFinishRenderMessage] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      try {
        const input = inputValue.trim();
        setMessages(messages.push(Map({ text: inputValue, isUser: true })));
        setInputValue("");

        const prevContent = [];
        const size = messages.size;
        const start = size - 1;

        for (let i = start; i < size; i++) {
          const text = messages.get(i)?.get("text") as string;
          const isUser = messages.get(i)?.get("isUser") as boolean;

          prevContent.push({
            content: text,
            role: isUser ? "user" : "assistant",
          });
        }

        const res = await fetch(`https://api.aigptku.id/v1/generative`, {
          method: "POST",
          headers: {
            Accept: "text/event-stream",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room: "xxx",
            contents: [
              ...prevContent,
              {
                role: "user",
                content: input,
              },
            ],
          }),
        });

        if (res.status >= 400) {
          console.error("Error fetching user data:", res.status);
          return;
        }

        setIsFinishRenderMessage(false);

        const reader = res.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        let receivedText = "";

        const newMessages = { text: "", isUser: false };

        try {
          while (true) {
            console.log("RENDER");
            const { done, value } = await reader!.read();
            if (done) break;

            // Decode the chunk and append it to the received text
            receivedText += decoder.decode(value, { stream: true });

            // Process each line of the received text
            const lines = receivedText.split("data: ");
            for (const line of lines) {
              if (!line.trim()) {
                continue;
              }

              let data = JSON.parse(line.trim());
              newMessages.text += data.content;
              newMessages.text = newMessages.text.replaceAll(
                /\\\(|\\\)|\\\[|\\\]/g,
                "$$$"
              );
              setInRenderedMessage(
                List([
                  Map({
                    text: newMessages.text,
                    isUser: newMessages.isUser,
                  }),
                ])
              );
              data = null;
            }

            receivedText = "";
          }
        } finally {
          // Ensure the reader is closed when the loop exits
          reader?.cancel();
        }
        setIsFinishRenderMessage(true);
      } catch (error) {
        console.error("Error processing stream:", error);
      }
    }
  };

  useEffect(() => {
    const message = Map({
      text: "Halo! Ada yang bisa saya bantu?",
      isUser: false,
    });

    setMessages(messages.push(message));
  }, []);

  useEffect(() => {
    if (isFinishRenderMessage && inRenderedMessage.size > 0) {
      const wait = setTimeout(() => {
        console.log("CHANGE");
        const rendered = inRenderedMessage.get(0) as Map<string, any>;
        setInRenderedMessage(List([]));
        setMessages(messages.push(rendered));
      }, 300);
      return () => clearTimeout(wait);
    } else if (inRenderedMessage.size > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [inRenderedMessage, isFinishRenderMessage]);

  useEffect(() => {
    if (messages.size > 10) {
      setMessages((m) => m.slice(1));
    }
  }, [messages]);

  return (
    <div
      className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="w-full h-full max-w-md bg-white shadow-lg rounded-lg p-6"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#180028",
        }}
      >
        <div
          className="navbar"
          style={{
            backgroundColor: "#ffd7f0",
            position: "fixed",
            top: 0,
            width: "100%",
            padding: "0 20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            style={{ cursor: "pointer" }}
            src="/aigptku.id-min.png"
            alt=""
            width={150}
          />
        </div>
        <div
          className="space-y-4"
          style={{
            width: innerWidth < 768 ? "98vw" : "80vw",
            maxWidth: "800px",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            padding: "120px 20px",
          }}
        >
          {messages.map((msg, index) => (
            <ChatBubbleMemo key={index} message={msg} />
          ))}
          {inRenderedMessage.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          style={{
            height: 50,
            display: "flex",
            flexDirection: "row",
            position: "fixed",
            bottom: 20,
            width: "80%",
            maxWidth: "800px",
            justifyContent: "center",
          }}
        >
          <input
            style={{
              height: "100%",
              width: "100%",
              paddingLeft: innerWidth < 768 ? "4%" : "2%",
              paddingRight: innerWidth < 768 ? "15%" : "8%",
              borderRadius: 20,
            }}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Tekan Enter untuk mengirim..."
          />
          <button
            style={{
              right: innerWidth < 768 ? "7%" : 10,
              position: "absolute",
              height: "100%",
              width: "5%",
            }}
            type="submit"
          >
            <MdSend className="mdsend" size={30} />
          </button>
        </form>
      </div>
    </div>
  );
});

export default HomePage;
