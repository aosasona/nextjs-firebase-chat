import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Meta from "@/defaults/Meta";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";

interface Data {
  username: string;
  password: string;
}

interface Status {
  error: boolean;
  loading: boolean;
  message: string;
}

const Login: NextPage = () => {
  const [data, setData] = useState<Data>({
    username: "",
    password: "",
  });
  const [status, setStatus] = useState<Status>({
    error: false,
    loading: false,
    message: "",
  });

  //Change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Form handler
  const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };
  return (
    <div className="flex flex-col items-center w-screen h-screen mt-[8vh]">
      <Meta title="Login" desc="This is a description" />
      <main className="w-[94%] lg:w-2/5 mx-auto">
        <div className="px-3 text-left lg:text-center">
          <h1 className="text-5xl lg:text-6xl font-bold">Velox</h1>
          <h4 className="text-neutral-600 font-medium text-xs mt-1 lg:mt-3">
            Login to use Velox and start chatting!
          </h4>
        </div>

        <form
          className="flex flex-col w-full rounded-2xl px-2 lg:px-4 mt-8"
          onSubmit={formHandler}
        >
          <div>
            <Input
              type="text"
              name="username"
              label="Username"
              required={true}
              value={data.username}
              onChange={handleChange}
              className="mb-4"
            />

            <Input
              type="password"
              name="password"
              label="Password"
              required={true}
              value={data.password}
              onChange={handleChange}
              className="mb-4"
            />

            <div className="mt-8">
              <Button type="submit">
                {status.loading ? "Loading..." : "Login"}
              </Button>
            </div>

            <Link href="/sign-up">
              <p className="text-xs text-neutral-100 font-normal text-center mt-8">
                Create a new account
              </p>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
