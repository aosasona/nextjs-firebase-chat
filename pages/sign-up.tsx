import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Meta from "@/defaults/Meta";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Error from "@/components/Error";

interface Data {
  username: string;
  password: string;
  confirmPassword: string;
}

interface Status {
  error: boolean;
  loading: boolean;
  message: string;
}

const SignUp: NextPage = () => {
  const [data, setData] = useState<Data>({
    username: "",
    password: "",
    confirmPassword: "",
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

  // Error handler
  const resetError = () => {
    setStatus({ ...status, error: false, message: "" });
  };

  // Form handler
  const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center w-screen h-screen mt-[6vh] lg:mt-[8vh]"
      >
        <Meta title="Login" desc="This is a description" />
        <main className="w-[94%] lg:w-2/5 mx-auto">
          <div className="px-3 text-left lg:text-center">
            <h1 className="text-5xl lg:text-6xl font-bold">Velox</h1>
            <h4 className="text-neutral-600 font-medium text-xs mt-1 lg:mt-3">
              Create an account to start using Velox!
            </h4>
          </div>

          <form
            className="flex flex-col w-full rounded-2xl px-2 lg:px-4 mt-8"
            onSubmit={formHandler}
          >
            <Error
              visible={status.error}
              text={status.message}
              onClose={resetError}
            />
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

              <div className="lg:grid lg:grid-cols-2 lg:gap-3">
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  required={true}
                  value={data.password}
                  onChange={handleChange}
                  className="mb-4"
                />

                <Input
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  required={true}
                  value={data.password}
                  onChange={handleChange}
                  className="mb-4"
                />
              </div>
              <div className="mt-4">
                <Button name="sign-up" type="submit">
                  {status.loading ? "Loading..." : "Create An Account"}
                </Button>
              </div>

              <Link href="/">
                <p className="text-xs text-neutral-100 font-normal text-center cursor-pointer mt-8">
                  Sign in to your account
                </p>
              </Link>
            </div>
          </form>
        </main>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignUp;