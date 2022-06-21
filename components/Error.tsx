import React from "react";
import type { FC } from "react";
import { BsX } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  visible: boolean;
  text: string;
  onClose: () => void;
}

const Error: FC<Props> = ({ visible, text, onClose }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.18 }}
          className="w-full flex justify-between items-center gap-x-1 text-sm text-red-500 bg-red-500 bg-opacity-20 rounded-xl px-4 py-4 lg:py-5 my-3"
        >
          <p className="px-1">{text || "Something went wrong"}</p>
          <BsX
            className="text-red-400 bg-red-200 hover:bg-opacity-5 bg-opacity-10 rounded-full p-[1px]"
            size={20}
            onClick={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Error;
