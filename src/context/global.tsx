// context/global.tsx
"use client";
import { addToStore, createInitStore, getAllFromStore } from "@/components/db";
import { List, Map } from "immutable";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

export const defaultFirstMessage = {
  text: "Halo! Ada yang bisa saya bantu?",
  isUser: false,
};

interface Room {
  id: string;
  title: string;
  lastUpdated: string;
}

interface GlobalContextProps {
  innerWidth: number;
  chats: Map<string, Map<string, any>>;
  setChats: (chats: Map<string, Map<string, any>>) => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  handleAddRoom: () => void;
  contextLoading: boolean;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [innerWidth, setInnerWidth] = useState<number>(0);
  const [chats, setChats] = useState<Map<string, Map<string, any>>>(Map({}));
  const [rooms, setRooms] = useState<Room[]>([]);
  const [contextLoading, setContextLoading] = useState(true);

  const fetchRooms = async () => {
    await createInitStore();

    // await createNewStore(
    //   [
    //     {
    //       name: "chat-",
    //       keyPath: "id",
    //     },
    //   ],
    //   1
    // );

    const r = await getAllFromStore("rooms");
    console.log("rooms first", r);
    if (r.length) {
      r.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
      setRooms(r);
    } else {
      const roomId = uuidv4();
      const newRoom = {
        id: roomId,
        title: "",
        lastUpdated: new Date().toISOString(),
      };
      setRooms([newRoom, ...rooms]);
      await addToStore("rooms", newRoom);
      await addToStore("scroll", {
        id: roomId,
        value: 0,
      });
      await addToStore("chats", { ...defaultFirstMessage, room_id: roomId });
      console.log("create store");
      router.push("?room=" + roomId);
    }

    console.log("set context loading");
    setContextLoading(false);
  };

  const handleAddRoom = async () => {
    const roomId = uuidv4();
    const newRoom = {
      id: roomId,
      title: "",
      lastUpdated: new Date().toISOString(),
    };
    await addToStore("rooms", newRoom);
    await addToStore("scroll", {
      id: roomId,
      value: 0,
    });
    await addToStore("chats", { ...defaultFirstMessage, room_id: roomId });
    router.push("?room=" + roomId);
    setRooms([newRoom, ...rooms]);
  };

  useEffect(() => {
    fetchRooms();
    // set window
    setInnerWidth(window.innerWidth);
    const handleResize = () => setInnerWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        innerWidth,
        chats,
        setChats,
        rooms,
        setRooms,
        handleAddRoom,
        contextLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
