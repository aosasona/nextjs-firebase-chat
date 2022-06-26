import { useState, useEffect, useContext, useRef } from "react";
import type { NextPage, GetServerSideProps } from "next";
import { GlobalContext } from "@/context/GlobalContext";
import * as timeago from "timeago.js";
import { io, Socket } from "socket.io-client";
import ProtectedLayout from "@/defaults/ProtectedLayout";
import { API_URL } from "config/api.config";
import Error from "@/components/Error";
import request from "utils/request.util";
import { FiChevronLeft, FiSend } from "react-icons/fi";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";

interface Props {
  username: string;
}

interface Data {
  message: string;
  focus: boolean;
}

interface Status {
  loading: boolean;
  error: boolean;
  success: boolean;
  text: string;
}

const ChatsPage: NextPage<Props> = ({ username }) => {
  //   const socket = io(API_URL, {
  //     reconnectionDelayMax: 10000,
  //     reconnectionAttempts: Infinity,
  //     query: {
  //       chatId: "",
  //     },
  //   });
  const router = useRouter();
  const { state } = useContext(GlobalContext);
  const [user, setUser] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [chatID, setChatID] = useState<string>("");
  const [data, setData] = useState<Data>({
    message: "",
    focus: false,
  });
  const [status, setStatus] = useState<Status>({
    loading: true,
    error: false,
    success: false,
    text: "",
  });

  // Error state handler
  const setError = (text: string) => {
    return setStatus((status) => ({ ...status, error: true, text }));
  };

  // Get Chats
  const getChats = () => {
    request
      .auth(state.Token)
      .get(`/chats/${username}`)
      .then(({ data }) => {
        // console.log(data);
        setUser(data?.data?.user);
        setChatID(data?.data?.chatId);
        setStatus((status) => ({ ...status, success: true, loading: false }));
      })
      .catch(({ response }) => {
        setStatus((status) => ({
          ...status,
          loading: false,
          error: true,
          text: response?.data?.message || "Something went wrong!",
        }));
      });
  };

  // Get data on page render
  useEffect(() => {
    // Get chats
    if (state.Token) {
      getChats();
    }
  }, [state, username]);

  // SET FOCUS
  const setFocus = () => {
    setData((data: Data) => ({ ...data, focus: true }));
  };
  // Remove focus
  const removeFocus = () => {
    setData((data: Data) => ({ ...data, focus: false }));
  };

  // SOCKET
  const socketRef = useRef<Socket>();
  let conn: any = socketRef.current;
  useEffect(() => {
    const SOCKET_URL = API_URL.split("/api")[0];
    if (!status.loading && status.success) {
      const socket = io(`${SOCKET_URL}`, {
        autoConnect: true,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: Infinity,
        transports: ["websocket"],
        auth: {
          chatId: chatID || "",
        },
      });

      socketRef.current = socket;

      socket.connect();

      socket.on("connect", () => {
        socket.emit("chat", { chatId: chatID || "" });
        // console.log("Connected to socket");
      });

      // Get ALL messages
      socket.on(`chat:${chatID || ""}`, (data: any) => {
        setMessages(data?.messages);
      });

      // NEW MESSAGE
      socket.on(`received:${chatID || ""}`, (data: any) => {
        // console.log(data);
        // if (data?.message?.sender.toString() !== state.ID.toString()) {
        //   setMessages((messages) => [...messages, data.message]);
        // }
        setMessages(data?.messages);
      });

      // CATCH ERRORS
      socket.on(`error:${chatID || ""}`, (data: any) => {
        setError(data?.message);
      });
    }
  }, [status, chatID]);

  // Send message
  const sendMessage = () => {
    if (!conn) {
      return setError("Something went wrong!");
    }
    if (data.message.trim().length === 0) {
      return;
    }

    if (conn) {
      // Data
      const payload = {
        sender: state.ID,
        receiver: user?._id.toString(),
        message: data.message,
        chatId: chatID || "",
      };
      conn.emit("sent", payload);

      // If there is no chat ID - new conversation
      if (!chatID) {
        getChats();
      }

      // Add message to messages array
      conn.emit("chat", { chatId: chatID || "" });

      // Clear textbox
      setData((data: Data) => ({ ...data, message: "" }));
    }
  };

  return (
    <ProtectedLayout title={`${username}`}>
      <div className="w-screen flex items-center text-neutral-500 fixed top-0 bg-neutral-800 text-center gap-x-3 py-4 px-4 drop-shadow-md z-[999]">
        <FiChevronLeft
          size={25}
          className="cursor-pointer hover:bg-neutral-700 rounded-full p-1 "
          onClick={() => router.push("/chat")}
        />
        <h1 className="font-bold tracking-wider self-end uppercase">
          {username}
        </h1>
      </div>

      {/*   Main conversation */}
      <main className="w-[90%] lg:w-2/5 mx-auto my-[9vh]">
        <Error
          visible={status.error}
          text={status.text}
          onClose={() =>
            setStatus((status) => ({ ...status, error: false, text: "" }))
          }
        />
        {status.loading ? (
          <div className="">
            <Loader />
          </div>
        ) : (
          <>
            {messages.length > 0 ? (
              <div className="flex flex-col gap-y-3 w-full">
                {messages.map((current: any, index: number) => (
                  <div
                    key={index}
                    className={`max-w-[80%] text-sm font-semibold rounded-lg py-2 px-3 ${
                      current?.sender.toString() === user?._id?.toString()
                        ? "bg-neutral-600 text-neutral-100 self-start"
                        : "bg-neutral-100 text-neutral-800 self-end"
                    }`}
                  >
                    {current?.message}
                    <p className="text-right opacity-40 text-[10px] font-normal">
                      {timeago.format(current?.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs font-medium text-neutral-600 pt-5">
                Start a new conversation
              </p>
            )}
          </>
        )}
      </main>

      <div className="w-screen fixed bottom-0 bg-neutral-800 py-3 px-2 z-[999]">
        <div className="w-full lg:w-4/6 mx-auto flex gap-x-2">
          <textarea
            className="w-full text-base bg-neutral-900 focus:outline-none placeholder:text-neutral-700 px-2 py-2 resize-none"
            rows={data.focus ? 4 : 2}
            placeholder="Type a message..."
            onChange={(e) =>
              setData((data) => ({ ...data, message: e.target.value }))
            }
            value={data.message}
            onFocus={setFocus}
            onBlur={removeFocus}
          ></textarea>
          <button
            name="Send"
            className="w-max text-neutral-400 aspect-square p-3"
            onClick={sendMessage}
          >
            <FiSend size={23} />
          </button>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { params } = ctx;

  return {
    props: {
      username: params?.username || "",
    },
  };
};

export default ChatsPage;
