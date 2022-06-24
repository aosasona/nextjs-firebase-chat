import { useEffect, useContext } from "react";
import type { ReactNode, FC } from "react";
import { useRouter } from "next/router";
import { GlobalContext } from "../context/GlobalContext";
import Meta from "@/defaults/Meta";

interface Props {
  children: ReactNode;
  title: string;
}

const ProtectedLayout: FC<Props> = ({ children, title }) => {
  const { state } = useContext(GlobalContext);
  const router = useRouter();
  useEffect(() => {
    // Check if user is logged in
    if (!state.Token && !state.Loading) {
      // Redirect to login page
      router.push("/");
    }
  }, [router, state.Loading, state.Token]);
  return (
    <>
      <Meta title={title} />
      {children}
    </>
  );
};

export default ProtectedLayout;
