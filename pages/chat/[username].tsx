import { useState, useEffect, useContext } from "react";
import type { NextPage, GetServerSideProps } from "next";
import { GlobalContext } from "@/context/GlobalContext";
import { io } from "socket.io-client";
import ProtectedLayout from "@/defaults/ProtectedLayout";
import { API_URL } from "config/api.config";
import Error from "@/components/Error";
import request from "utils/request.util";
import { FiChevronLeft, FiSend } from "react-icons/fi";
import { useRouter } from "next/router";

interface Props {
  username: string;
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
  const [messages, setMessages] = useState<any>({});
  const [conversations, setConversations] = useState<any[]>([]);
  const [data, setData] = useState<any>({
    message: "",
    focus: false,
  });
  const [status, setStatus] = useState<{
    loading: boolean;
    error: boolean;
    text: string;
  }>({
    loading: true,
    error: false,
    text: "",
  });

  // Get data on page render
  useEffect(() => {
    // Get chats
    if (state.Token) {
      request
        .auth(state.Token)
        .get(`/chats/${username}`)
        .then(({ data }) => {
          setUser(data?.data?.user);
          setConversations(data?.data?.messages);
          setStatus((status) => ({ ...status, loading: false }));
        })
        .catch(({ response }) => {
          setStatus((status) => ({
            ...status,
            loading: false,
            error: true,
            text: response?.data?.message || "Something went wrong!",
          }));
        });
    }
  }, [state, username]);

  // SOCKET LISTENERS
  //   const socket = io(API_URL);
  const socket = io(`${API_URL}`, { autoConnect: false });

  return (
    <ProtectedLayout title={`${username}`}>
      <Error
        visible={status.error}
        text={status.text}
        onClose={() =>
          setStatus((status) => ({ ...status, error: false, text: "" }))
        }
      />
      <div className="w-screen flex items-center text-neutral-500 fixed top-0 bg-neutral-800 text-center gap-x-3 py-4 px-4 drop-shadow-md">
        <FiChevronLeft size={20} onClick={() => router.push("/chat")} />
        <h1 className="font-bold tracking-wider self-end uppercase">
          {username}
        </h1>
      </div>

      <div className="w-screen flex gap-2 fixed bottom-0 bg-neutral-800 py-3 px-2">
        <textarea
          className="w-full bg-neutral-900 resize-none"
          rows={1}
        ></textarea>
        <button className="w-max text-neutral-400 aspect-square px-2">
          <FiSend size={23} />
        </button>
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
