import { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import { GlobalContext } from "@/context/GlobalContext";
import { useRouter } from "next/router";
import ProtectedLayout from "@/defaults/ProtectedLayout";
import request from "utils/request.util";
import Error from "@/components/Error";
import { HiOutlineUserCircle } from "react-icons/hi";

const Index: NextPage = () => {
  const router = useRouter();
  const { state } = useContext(GlobalContext);
  const [conversations, setConversations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [status, setStatus] = useState<{
    loading: boolean;
    error: boolean;
    text: string;
  }>({
    loading: true,
    error: false,
    text: "",
  });

  useEffect(() => {
    if (state.Token) {
      // Get chats
      request
        .auth(state.Token)
        .get("/chats")
        .then(({ data }) => {
          setConversations(data?.data);
          setStatus({ ...status, loading: false });
        })
        .catch(({ response }) => {
          setStatus({
            ...status,
            loading: false,
            error: true,
            text: response?.data?.message || "Something went wrong!",
          });
        });

      // Get users
      request
        .auth(state.Token)
        .get("/users")
        .then(({ data }) => {
          //   console.log(data);
          setUsers(data?.data);
          setStatus({ ...status, loading: false });
        })
        .catch(({ response }) => {
          setStatus({
            ...status,
            loading: false,
            error: true,
            text: response?.data?.message || "Something went wrong!",
          });
        });
    }
  }, [state.Token]);

  return (
    <ProtectedLayout title="Chats">
      <main className="w-[92%] lg:w-2/5 mx-auto mt-[4vh] lg:mt-[9vh]">
        <h1 className="text-5xl lg:text-6xl font-bold">Chats</h1>
        <Error
          visible={status.error}
          text={status.text}
          onClose={() =>
            setStatus((status) => ({ ...status, error: false, text: "" }))
          }
        />
        <div className="flex flex-col gap-y-2 py-3 mt-4">
          {status.loading ? (
            <div className="my-[10vh] flex items-center justify-center">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              {conversations?.length > 0 ? (
                <></>
              ) : (
                <div className="my-[10vh] flex items-center justify-center">
                  <p className="text-neutral-700 text-sm">
                    No conversations yet.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        {users?.length > 0 && (
          <>
            <h1 className="text-4xl lg:text-4xl font-bold">
              Start A Conversation
            </h1>
            <section className="grid grid-cols-2 gap-4 mt-4">
              {users.map((user, index) => (
                <div
                  className="flex flex-row items-center justify-start gap-x-3 bg-neutral-800 py-4 px-5 rounded-2xl hover:border-2 hover:border-neutral-100 cursor-pointer transition-all duration-200"
                  key={index}
                  onClick={() => router.push(`/chat/${user?.username}`)}
                >
                  <HiOutlineUserCircle size={33} className="text-neutral-500" />
                  <p className="text-neutral-500 font-medium">
                    {user?.username}
                  </p>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </ProtectedLayout>
  );
};

export default Index;
