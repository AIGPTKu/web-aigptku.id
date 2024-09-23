// app/page.tsx
"use client";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github.css"; // Import a highlight.js theme
import Resizer from "react-image-file-resizer";
import ReactLoading from "react-loading";
import {
  MdOutlineAttachFile,
  MdOutlineContentCopy,
  MdSend,
} from "react-icons/md";
import { Map, List } from "immutable";
import { useGlobalContext } from "@/context/global";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you
import {
  FaArrowUp,
  FaBarsStaggered,
  FaCheck,
  FaRegCircleStop,
} from "react-icons/fa6";
import Sidebar from "@/components/Sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { PiSidebarFill } from "react-icons/pi";
import { RiAttachmentLine, RiEditFill } from "react-icons/ri";
import {
  addToStore,
  getAllFromStore,
  getAllIndexedFromStore,
  getFromStore,
} from "@/components/db";
import remarkGfm from "remark-gfm";
import { IoAttachSharp, IoStopCircle } from "react-icons/io5";
import { GrFormClose } from "react-icons/gr";
import { TbCircleArrowUpFilled } from "react-icons/tb";
import { IoMdArrowUp } from "react-icons/io";

const ChatBubble: React.FC<{ message: Map<string, any> }> = ({ message }) => {
  const { innerWidth } = useGlobalContext();
  const isUser = message.get("isUser") as boolean;

  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "100%",
      }}
    >
      {message.get("filetype") && (
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            marginBottom: 10,
          }}
        >
          <img
            src={message.get("file")}
            alt=""
            style={{
              width: "100%",
              borderRadius: 20,
            }}
          />
        </div>
      )}
      <div
        className={`chat-bubble ${
          isUser ? "chat-bubble-user" : "chat-bubble-bot"
        }`}
      >
        <ReactMarkdown
          components={{
            code({ node, className, children }) {
              const match = /language-(\w+)/.exec(className || "");
              return match || !!/\n/.exec(String(children)) ? (
                <div
                  style={{
                    position: "relative",
                    border: "1px solid #272727",
                    borderRadius: 10,
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
                    <span style={{ fontSize: 10 }}>
                      {(match && match[1]) || "kode"}
                    </span>
                    <ButtonCopyCode
                      content={String(children).replace(/\n$/, "")}
                    />
                  </div>
                  <SyntaxHighlighter
                    customStyle={{
                      margin: 0,
                      fontSize: innerWidth < 768 ? 10 : 14,
                      borderRadius: "0px 0px 10px 10px",
                      backgroundColor: "black",
                    }}
                    style={nightOwl}
                    language={(match && match[1]) || ""}
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    // {...props}
                  />
                </div>
              ) : (
                <code
                  className={className}
                  style={{
                    backgroundColor: "#401b97",
                    padding: "2px 5px",
                    fontSize: innerWidth < 768 ? 12 : 14,
                  }}
                  children={children}
                />
              );
            },
            table({ className, children }) {
              return (
                <div
                  style={{
                    width: "100%",
                    overflowX: "auto",
                  }}
                >
                  <table className={className}>{children}</table>
                </div>
              );
            },
          }}
          className="markdown"
          children={message.get("text") as string}
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        />
      </div>
    </div>
  );
};
const ChatBubbleMemo: React.FC<{ message: Map<string, any> }> = React.memo(
  ({ message }) => {
    const { innerWidth } = useGlobalContext();
    const isUser = message.get("isUser") as boolean;

    return (
      <div
        style={{
          alignSelf: isUser ? "flex-end" : "flex-start",
          maxWidth: "100%",
        }}
      >
        {message.get("filetype") && (
          <div
            style={{
              width: "100%",
              maxWidth: 400,
              marginBottom: 10,
            }}
          >
            <img
              src={message.get("file")}
              alt=""
              style={{
                width: "100%",
                borderRadius: 20,
              }}
            />
          </div>
        )}
        <div
          className={`chat-bubble ${
            isUser ? "chat-bubble-user" : "chat-bubble-bot"
          }`}
        >
          <ReactMarkdown
            components={{
              code({ node, className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                return match || !!/\n/.exec(String(children)) ? (
                  <div
                    style={{
                      position: "relative",
                      border: "1px solid #272727",
                      borderRadius: 10,
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
                      <span style={{ fontSize: 10 }}>
                        {(match && match[1]) || "kode"}
                      </span>
                      <ButtonCopyCode
                        content={String(children).replace(/\n$/, "")}
                      />
                    </div>
                    <SyntaxHighlighter
                      customStyle={{
                        margin: 0,
                        fontSize: innerWidth < 768 ? 10 : 14,
                        borderRadius: "0px 0px 10px 10px",
                        backgroundColor: "black",
                      }}
                      style={nightOwl}
                      language={(match && match[1]) || ""}
                      PreTag="div"
                      children={String(children).replace(/\n$/, "")}
                      // {...props}
                    />
                  </div>
                ) : (
                  <code
                    className={className}
                    style={{
                      backgroundColor: "#401b97",
                      padding: "2px 5px",
                      fontSize: innerWidth < 768 ? 12 : 14,
                    }}
                    children={children}
                  />
                );
              },
              table({ className, children }) {
                return (
                  <div
                    style={{
                      width: "100%",
                      overflowX: "auto",
                    }}
                  >
                    <table className={className}>{children}</table>
                  </div>
                );
              },
            }}
            className="markdown"
            children={message.get("text") as string}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
          />
          {!(message.get("isUser") as boolean) && (
            <ButtonCopy content={message.get("text")} />
          )}
        </div>
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
        // alert(navigator.clipboard);
        navigator.clipboard?.writeText(content);
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

interface FunctionCall {
  name: string;
  arguments: {
    prompt: string;
    query: string;
  };
}

const HomePage: React.FC = React.memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    innerWidth,
    chats,
    setChats,
    rooms,
    setRooms,
    handleAddRoom,
    contextLoading,
  } = useGlobalContext();
  const [messages, setMessages] = useState<List<Map<string, any>>>(List([]));
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [isReadyToPushMessage, setIsReadyToPushMessage] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isRoomNameEmpty, setIsRoomNameEmpty] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // console.log("sidebar", sidebarActive);
  const [inRenderedMessage, setInRenderedMessage] = useState<
    List<Map<string, any>>
  >(List([]));

  const [inputValue, setInputValue] = useState("");
  const inputTextRef = useRef<HTMLTextAreaElement>(null);
  const [isFinishRenderMessage, setIsFinishRenderMessage] = useState(true);
  const [reader, setReader] =
    useState<ReadableStreamDefaultReader<Uint8Array>>();
  const [abortController, setAbortController] = useState<AbortController>();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Contoh kombinasi: Ctrl + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault(); // Mencegah perilaku default
      handleSubmit();
    }
  };

  const handleFunctionCall = async (data: FunctionCall) => {
    // console.log(data);
    switch (data.name) {
      case "image_generate": {
        const newMessages = { text: "", isUser: false };

        const placeholderImage =
          "https://images.placeholders.dev/?width=1024&height=1024&text=Sedang%20generate%20gambar%20...&bgColor=%23000&textColor=%23fff&fontSize=30";

        setInRenderedMessage(
          List([
            Map({
              text: `![Image](${placeholderImage})\n`,
              isUser: newMessages.isUser,
            }),
          ])
        );

        const res = await fetch(`http://localhost:4000/v1/generative/image`, {
          method: "POST",
          headers: {
            Accept: "text/event-stream",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: data.arguments.prompt,
          }),
        });

        if (res.status >= 400) {
          console.error("Error fetching user data:", res.status);
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        let receivedText = "";

        try {
          while (true) {
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

              if (data.image_url) {
                newMessages.text += `![Image](${data.image_url})\n`;
                setInRenderedMessage(
                  List([
                    Map({
                      text: newMessages.text,
                      isUser: newMessages.isUser,
                    }),
                  ])
                );
                data = null;
                continue;
              }

              newMessages.text += data.content;
              newMessages.text = newMessages.text
                .replaceAll(/\\\(|\\\)|\\\[|\\\]/g, "$$$")
                .replaceAll(/^---\n|\n---$/g, "");
              if (/[`-]+/.exec(data.content)) {
                data = null;
                continue;
              }

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

        break;
      }
      case "web_search": {
        const newMessages = { text: "", isUser: false };
        setInRenderedMessage(
          List([
            Map({
              text: `Maaf fitur **Web Search** masih dalam tahap pengembangan. silahkan coba lagi nanti`,
              isUser: newMessages.isUser,
            }),
          ])
        );
        break;
      }
    }
    return setIsFinishRenderMessage(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFinishRenderMessage) {
      stopStream();
      abortController?.abort();
      return;
    }

    if (inputValue.trim()) {
      try {
        const size = messages.size;
        const prevContent = [];

        for (let i = size - 1; i >= 0; i--) {
          if (size < 2 || prevContent.length >= 9) {
            break;
          }

          const isUser = messages.get(i)?.get("isUser") as boolean;

          if (!isUser && i < size - 1) {
            continue;
          }

          const text = messages.get(i)?.get("text") as string;

          prevContent.unshift({
            role: isUser ? "user" : "assistant",
            content: text,
          });
        }

        const roomId = searchParams.get("room") as string;

        const input = inputValue.trim();
        const inputFile = file?.url;

        const obj = {
          text: inputValue,
          isUser: true,
          room_id: roomId,
          file: "",
          filetype: "",
        };

        if (inputFile) {
          obj["file"] = inputFile;
          obj["filetype"] = "image";
        }

        const newMessage = Map(obj);

        // console.log("input", newMessage);
        setMessages(messages.push(newMessage));
        setInputValue("");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 300);

        addToStore("chats", Object.fromEntries(newMessage.entries()));

        if (isRoomNameEmpty) {
          handleSetAutoRoomName(input);
        }

        const abort = new AbortController();
        setAbortController(abort);

        const res = await fetch(`http://localhost:4000/v1/generative`, {
          method: "POST",
          signal: abort.signal,
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
                file: file?.url,
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
        setReader(reader);
        const decoder = new TextDecoder("utf-8");

        let receivedText = "";

        const newMessages = { text: "", isUser: false };

        let isFunctionCall = false;

        try {
          let loop = 0;
          while (true) {
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

              loop++;

              let data = JSON.parse(line.trim());
              // console.log(data);
              if (data.function_call?.name) {
                handleFunctionCall(data.function_call);
                isFunctionCall = true;
                continue;
              }

              newMessages.text += data.content;
              newMessages.text = newMessages.text
                .replaceAll(/\\\(|\\\)|\\\[|\\\]/g, "$$$")
                .replaceAll(/^---\n|\n---$/g, "");
              if (/[`-]+/.exec(data.content)) {
                data = null;
                continue;
              }

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
          // reader?.cancel();
          if (!isFunctionCall) {
            setIsFinishRenderMessage(true);
          }
        }
      } catch (error) {
        console.error("Error processing stream:", error);
      }
    }
  };

  const stopStream = () => {
    if (reader) {
      reader.releaseLock();
      setReader(undefined);
    }
  };

  const handleSaveScroll = () => {
    const roomId = searchParams.get("room") as string;
    if (!roomId) return;

    setChats(
      chats.merge(
        Map({
          [roomId]: Map({
            scroll: scrollY,
            lists: messages,
          }),
        })
      )
    );

    addToStore("scroll", {
      id: roomId,
      value: scrollY,
    });
  };

  const handleSetAutoRoomName = (name: string) => {
    const roomId = searchParams.get("room") as string;
    const newData = {
      id: roomId,
      title: name
        .split(" ")
        .map((s) => s[0].toUpperCase() + s.substring(1))
        .join(" "),
      lastUpdated: new Date().toISOString(),
    };

    const newRooms = rooms.map((data) => (data.id === roomId ? newData : data));

    setRooms(newRooms);
    addToStore("rooms", newData);
  };

  const handleAttachChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      // setFile({
      //   data: e.target.files[0],
      //   url: URL.createObjectURL(e.target.files[0]),
      //   name: e.target.files[0].name,
      // });
      resizeImage(e.target.files[0]);
    }
  };

  const resizeImage = (file: File) => {
    Resizer.imageFileResizer(
      file,
      1024, // max width
      1024, // max height
      "jpeg", // compress format
      80, // quality
      0, // rotation
      (f) => {
        setFile({
          data: f,
          url: URL.createObjectURL(f as File),
          name: file.name,
        });

        uploadFile(f as File);
      },
      "file" // output type, options: 'base64' | 'blob' | 'file'
    );
  };

  const uploadFile = async (file: File) => {
    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`https://api.aigptku.id/v1/upload/temp`, {
      method: "POST",
      body: formData,
    });

    if (res.status >= 400) {
      console.error("Error fetching user data:", res.status);
      return;
    }

    const response = await res.json();
    setFile((current: any) => {
      return { ...current, url: response.data.url };
    });
    setImageUploadLoading(false);
  };

  useEffect(() => {
    if (window.innerWidth > 768) {
      setSidebarActive(true);
    } else {
      setSidebarActive(false);
    }

    // const message = Map({
    //   id: 0,
    //   text: "Halo! Ada yang bisa saya bantu?",
    //   isUser: false,
    // });

    // setMessages(messages.push(message));

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (inputTextRef.current) {
      inputTextRef.current.style.height = "auto"; // Reset height to auto
      inputTextRef.current.style.height =
        inputTextRef.current.scrollHeight > 150
          ? "144px"
          : `${inputTextRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  }, [inputValue]);

  useEffect(() => {
    if (isFinishRenderMessage && inRenderedMessage.size > 0) {
      const wait = setTimeout(() => {
        console.log("CHANGE");

        const roomId = searchParams.get("room") as string;

        const rendered = (inRenderedMessage.get(0) as Map<string, any>).merge(
          Map({
            room_id: roomId,
          })
        );

        setInRenderedMessage(List([]));
        setMessages(messages.push(rendered));
        setIsReadyToPushMessage(true);
        addToStore("chats", Object.fromEntries(rendered.entries()));
      }, 300);
      return () => clearTimeout(wait);
    } else if (
      inRenderedMessage.size > 0 &&
      window.innerHeight >= screen.height - 200
    ) {
      // console.log("scroll");
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [inRenderedMessage, isFinishRenderMessage]);

  useEffect(() => {
    if (messages.size > 10) {
      setMessages((m) => m.slice(1));
    }
  }, [messages]);

  useEffect(() => {
    const loadChat = async () => {
      const roomId = searchParams.get("room") as string;
      if (!roomId && rooms.length) {
        // console.log(rooms);
        router.push("?room=" + rooms[0].id);
        return;
      }

      setIsNotFound(false);

      let chat = chats.get(roomId) as Map<string, any>;
      if (!chat) {
        const lists = (await getAllIndexedFromStore("chats", {
          indexName: "idx_room_id",
          indexValue: roomId,
        })) as any[];
        // console.log("list", lists);

        if (!lists.length) {
          setIsNotFound(true);
          setShowContent(true);
          return;
        }

        // lists.sort(
        //   (a, b) =>
        //     new Date(a.lastUpdated).getTime() -
        //     new Date(b.lastUpdated).getTime()
        // );

        const immutableList = lists.map((list) => Map(list));

        const scroll: {
          id: string;
          value: number;
        } = await getFromStore("scroll", roomId);
        // console.log("scroll", scroll);
        chat = Map<string, any>({
          scroll: scroll.value,
          lists: List(immutableList),
        });
        setChats(
          chats.merge(
            Map({
              [roomId]: chat,
            })
          )
        );
      }

      const scroll = chat.get("scroll") as number;
      const lists = chat.get("lists") as List<Map<string, any>>;
      let listsStartIndex = lists.size - 10;
      if (listsStartIndex < 0) {
        listsStartIndex = 0;
      }

      setMessages(lists.slice(listsStartIndex));

      const t = setTimeout(() => {
        window.scrollTo({
          top: scroll,
          // behavior: "smooth",
        });
        setShowContent(true);
      }, 10);

      return () => clearTimeout(t);
    };
    // console.log("context", contextLoading);
    if (!contextLoading) {
      loadChat();
    }
  }, [searchParams, contextLoading]);

  useEffect(() => {
    if (rooms.length) {
      const room = searchParams.get("room") as string;
      // console.log("init room", rooms, room);
      setIsRoomNameEmpty(
        rooms
          .filter((data) => data.id === room)
          .map((data) => (data.title ? false : true))[0] || false
      );
    }
  }, [rooms, searchParams]);
  // console.log(isRoomNameEmpty);
  useEffect(() => {
    if (isReadyToPushMessage) {
      const timeout = setTimeout(() => {
        const id = searchParams.get("room") as string;
        let room = chats.get(id) as Map<string, any>;

        // console.log("size", room?.size);
        if (!room?.size) {
          room = Map<string, any>({
            scroll: 0,
          });
        }

        setChats(
          chats.merge(
            Map({
              [id]: room.merge(
                Map({
                  lists: messages,
                })
              ),
            })
          )
        );

        setIsReadyToPushMessage(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isReadyToPushMessage]);
  // console.log(chats);
  useEffect(() => {
    if (scrollY >= 0) {
      const timeout = setTimeout(() => {
        handleSaveScroll();
        // console.log(scrollY);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [scrollY]);

  useEffect(() => {
    if (!contextLoading) {
      if (sidebarActive && innerWidth < 768) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }, [innerWidth]);

  // console.log(file);

  return (
    <SidebarContainer
      active={sidebarActive}
      closeSidebar={() => {
        document.body.style.overflow = "auto";
        setSidebarActive(false);
      }}
    >
      <Sidebar
        width={sidebarWidth}
        active={sidebarActive}
        setActive={setSidebarActive}
        action={() => {
          handleSaveScroll();
          setShowContent(false);
        }}
      />
      <div
        className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4"
        style={{
          marginLeft: sidebarActive && innerWidth >= 768 ? sidebarWidth : 0,
          // minHeight: "100vh",
        }}
      >
        <div
          className="max-w-md bg-white shadow-lg rounded-lg p-6"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#10001b",
          }}
        >
          <div
            id="navbar"
            className="navbar"
            style={{
              backgroundImage:
                "linear-gradient( 109.6deg,  rgba(228,107,232,1) 11.2%, rgba(87,27,226,1) 96.7% )",
              position: "fixed",
              right: 0,
              top: 0,
              width:
                sidebarActive && innerWidth >= 768
                  ? innerWidth - sidebarWidth
                  : "100vw",
              padding: "0 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 60,
            }}
          >
            {!sidebarActive && (
              <div
                style={
                  innerWidth >= 768
                    ? {
                        left: 10,
                        position: "absolute",
                        display: "block",
                        width: "100%",
                      }
                    : {
                        position: "absolute",
                        padding: "0 10px",
                        width: "100vw",
                        display: "flex",
                        justifyContent: "space-between",
                      }
                }
              >
                <button
                  onClick={() => {
                    const e = document.getElementById("navbar") as HTMLElement;
                    e.style.transition = "ease-in-out 300ms";

                    setSidebarActive(true);
                    if (innerWidth < 768) {
                      document.body.style.overflow = "hidden";
                    }

                    setTimeout(() => {
                      e.style.transition = "";
                    }, 300);
                  }}
                  className="room"
                  style={{
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  {innerWidth >= 768 ? (
                    <PiSidebarFill size={20} color="white" />
                  ) : (
                    <FaBarsStaggered size={20} color="white" />
                  )}
                </button>
                <button
                  onClick={() => {
                    handleAddRoom();
                    setSidebarActive(true);
                  }}
                  className="room"
                  style={{
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <RiEditFill size={20} color="white" />
                </button>
              </div>
            )}
            <img
              style={{ cursor: "pointer" }}
              src="/aigptku.id-white.png"
              alt=""
              width={150}
            />
          </div>
          <div
            id="content"
            className="space-y-4"
            style={{
              opacity: showContent ? 1 : 0,
              width: innerWidth < 768 ? "98vw" : "80%",
              maxWidth: "800px",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              padding: "120px 20px",
            }}
          >
            {isNotFound && (
              <div
                style={{
                  width: "calc(98vw - 20px * 2)",
                  height: "70vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <h1>404 | Halaman Tidak ditemukan</h1>
              </div>
            )}

            {messages.map((msg, index) => (
              <ChatBubbleMemo key={index} message={msg} />
            ))}
            {inRenderedMessage.map((msg, index) => (
              <ChatBubble key={index} message={msg} />
            ))}
          </div>
          <form
            style={{
              minHeight: 70,
              position: "fixed",
              bottom: 0,
              width:
                sidebarActive && innerWidth >= 768
                  ? innerWidth - sidebarWidth
                  : "100vw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "#10001b",
              // boxShadow: "0 -10px 6px rgba(24, 0, 40, 0.5)",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "80%",
                maxWidth: "800px",
                marginBottom: 20,
                borderRadius: 20,
                paddingLeft: 50,
                paddingRight: 50,
              }}
              className="input"
            >
              {file && (
                <div
                  style={{
                    width: "100%",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <div
                      onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="closefile"
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "black",
                        position: "absolute",
                        right: -5,
                        top: -5,
                        borderRadius: 10,
                        zIndex: 2,
                      }}
                    >
                      <GrFormClose size={20} color="white" />
                    </div>
                    {imageUploadLoading && (
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          zIndex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ReactLoading
                          delay={0}
                          type="spin"
                          color="black"
                          height={"30%"}
                          width={"30%"}
                        />
                      </div>
                    )}
                    <img
                      src={file.url}
                      alt=""
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 10,
                        objectFit: "cover",
                        filter: imageUploadLoading ? "blur(2px)" : "none",
                      }}
                    />
                  </div>
                </div>
              )}
              <textarea
                style={{
                  // minHeight: 50,
                  // padding: "12px 50px",
                  width: "100%",
                  backgroundColor: "transparent",
                  outline: "none",
                  color: "white",
                  resize: "none",
                }}
                ref={inputTextRef}
                rows={1}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputSubmit}
                className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={
                  innerWidth > 768
                    ? "Tekan Cmd/Ctrl + Enter untuk mengirim..."
                    : "Tanyakan apapun..."
                }
              />
              <label
                style={{
                  left: 10,
                  bottom: 10,
                  position: "absolute",
                  cursor: "pointer",
                }}
              >
                <IoAttachSharp className="mdsend" size={30} />
                <input
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  type="file"
                  onChange={handleAttachChange}
                  className={"fileInput"}
                  accept="image/*"
                />
              </label>
              <button
                style={{
                  right: 10,
                  bottom: 10,
                  position: "absolute",
                }}
                type="button"
                onClick={handleSubmit}
              >
                {isFinishRenderMessage ? (
                  <IoMdArrowUp className="mdsend" size={30} />
                ) : (
                  <IoStopCircle className="mdsend" size={30} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SidebarContainer>
  );
});

const SidebarContainer = ({
  children,
  active,
  closeSidebar,
}: {
  children: React.ReactNode;
  active: boolean;
  closeSidebar: () => void;
}) => {
  const { innerWidth } = useGlobalContext();
  return (
    <div>
      <div
        onClick={() => (active && innerWidth < 768 ? closeSidebar() : null)}
        style={
          active && innerWidth < 768
            ? {
                position: "fixed",
                backgroundColor: "black",
                opacity: 0.5,
                width: "100vw",
                height: "100vh",
                zIndex: 9,
                transition: "ease-in-out 300ms",
              }
            : {
                position: "relative",
                transition: "ease-in-out 300ms",
              }
        }
      />
      {children}
    </div>
  );
};

export default HomePage;
