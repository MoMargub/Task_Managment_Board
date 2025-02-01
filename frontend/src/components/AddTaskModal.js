import React, { Fragment, useEffect, useState } from "react";
import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import BtnPrimary from "./BtnPrimary";
import BtnSecondary from "./BtnSecondary";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import moment from "moment";

const AddTaskModal = ({
  isAddTaskModalOpen,
  setAddTaskModal,
  projectId = null,
  taskId = null,
  edit = false,
  refreshData,
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (edit && isAddTaskModalOpen && projectId && taskId) {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URI}/project/${projectId}/task/${taskId}`
        )
        .then((res) => {
          console.log("API Response:", res);
          setTitle(res.data[0].task[0].title);
          setDesc(res.data[0].task[0].description || "");
          setDueDate(res.data[0]?.task?.[0]?.dueDate);
          setPriority(res.data[0]?.task?.[0]?.priority || "Medium");
        })
        .catch((error) => {
          toast.error("Something went wrong");
        });
    }
  }, [isAddTaskModalOpen, projectId, taskId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!edit) {
      axios
        .post(`${process.env.REACT_APP_BASE_URI}/project/${projectId}/task`, {
          title,
          description: desc,
          dueDate,
          priority,
        })
        .then((res) => {
          console.log("APPPP", res);
          setAddTaskModal(false);
          toast.success("Task created successfully");
          setTitle("");
          setDesc("");
          setDueDate(null);
          setPriority("Medium");
        })

        .catch((error) => {
          if (error.response.status === 422) {
            toast.error(error.response.data.details[0].message);
          } else {
            toast.error("Something went wrong");
          }
        });
    } else {
      const formateDate = moment(dueDate).format("DD-MM-YYYY");

      axios
        .put(
          `${process.env.REACT_APP_BASE_URI}/project/${projectId}/task/${taskId}`,
          { title, description: desc, dueDate: formateDate, priority: priority }
        )
        .then((res) => {
          console.log("PUT RESPONSE", res);

          setAddTaskModal(false);
          toast.success("Task updated successfully");
          setTitle("");
          setDesc("");
          setDueDate(null);
          refreshData(true);
          setPriority("Medium");
        })
        .catch((error) => {
          if (error.response.status === 422) {
            toast.error(error.response.data.details[0].message);
          } else {
            toast.error("Something went wrong");
          }
        });
    }
  };

  return (
    <Transition appear show={isAddTaskModalOpen} as={Fragment}>
      <Dialog
        as="div"
        open={isAddTaskModalOpen}
        onClose={() => setAddTaskModal(false)}
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
              enterTo="opacity-300 scale-100"
              leave="ease-in duration-200"
              leaveTo="opacity-0 scale-95"
              leaveFrom="opacity-100 scale-100"
            >
              <DialogPanel className="rounded-md bg-white w-6/12">
                <DialogTitle
                  as="div"
                  className="bg-white shadow px-6 py-4 rounded-t-md sticky top-0"
                >
                  <h1>{edit ? "Edit" : "Create"} Project</h1>
                  <button
                    onClick={() => setAddTaskModal(false)}
                    className=" absolute right-6 top-4 text-gray-500 hover:bg-gray-100 rounded focus:outline-none focus:ring focus:ring-offset-1 focus:ring-indigo-200 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className=" w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </DialogTitle>
                <form onSubmit={handleSubmit} className="gap-4 px-8 py-4">
                  <div className="mb-3">
                    <label htmlFor="title" className="block text-gray-600">
                      Title
                    </label>
                    <input
                      value={title}
                      onChange={(e) => {
                        console.log("Selected Date:", e);
                        setTitle(e.target.value);
                      }}
                      className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400"
                      placeholder="Project title"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      htmlFor="Description"
                      className="block text-gray-600"
                    >
                      Description
                    </label>
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400"
                      rows="6"
                      placeholder="Project description"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="dueDate" className="block text-gray-600">
                      Select Due Date
                    </label>
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      dateFormat="MMMM d, yyyy"
                      className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400"
                      placeholderText="Select a date"
                      calendarClassName="react-calendar"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="priority" className="block text-gray-600">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="flex justify-end items-center space-x-2">
                    <BtnSecondary onClick={() => setAddTaskModal(false)}>
                      Cancel
                    </BtnSecondary>
                    <BtnPrimary>Save</BtnPrimary>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddTaskModal;
