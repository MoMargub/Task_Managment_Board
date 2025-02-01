import {
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Dialog,
} from "@headlessui/react";
import axios from "axios";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

const TaskModal = ({ isOpen, setIsTaskOpen, id }) => {
  const [taskData, setTaskData] = useState("");

  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
  };

  useEffect(() => {
    if (isOpen) {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URI}/project/${id.projectId}/task/${id.id}`
        )
        .then((data) => {
          setTaskData({ ...data.data[0].task[0] });
        })
        .catch((error) => {
          toast.error("Something went wrong");
          console.error(error);
        });
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        open={isOpen}
        onClose={() => setIsTaskOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 overflow-y-auto">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </TransitionChild>
          <div className="fixed inset-0 flex items-center justify-center p-4 w-screen h-screen">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="rounded-md bg-white max-w-[85%] w-[85%] h-[85%] overflow-y-hidden">
                <DialogTitle
                  as="div"
                  className={
                    "bg-white shadow px-6 py-4 rounded-t-md sticky top-0"
                  }
                >
                  <h1>Task details</h1>
                  <button
                    onClick={() => setIsTaskOpen(false)}
                    className="absolute right-6 top-4 text-gray-500 hover:bg-gray-100 rounded focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-500/30 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </DialogTitle>
                <div className="flex gap-4 h-[inherit]">
                  <div className="!w-8/12 px-8 space-y-3 py-4 min-h-max  overflow-y-auto">
                    <h1 className="text-3xl font-semibold ">
                      {capitalizeFirstLetter(taskData.title)}
                    </h1>
                    <p className="text-gray-600">
                      Description: {capitalizeFirstLetter(taskData.description)}
                    </p>

                    <p className="text-gray-600">
                      Due Date:{" "}
                      {capitalizeFirstLetter(
                        moment(taskData.dueDate).format("DD-MM-YYYY")
                      )}
                    </p>
                    <p className="text-gray-600">
                      Status: {capitalizeFirstLetter(taskData.stage)}
                    </p>

                    <p className="text-gray-600">
                      {" "}
                      Priority: {capitalizeFirstLetter(taskData?.priority)}
                    </p>
                    {/* <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select> */}
                  </div>
                  <div className="w-4/12 py-4 pr-4"></div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaskModal;
