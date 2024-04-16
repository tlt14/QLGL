"use client";
import ModalConfirm from "@/app/components/ModalConfirm";
import { IStudent } from "@/app/types/common";
import { FormEvent, useState } from "react";
import { FaEdit, FaFileExcel, FaPlus, FaTrashAlt } from "react-icons/fa";
import useSWR from "swr";
import { CSVLink } from "react-csv";
const fetchGrades = async (idClass: string) => {
  const res = await fetch(`http://localhost:4000/students/${idClass}/classes`);
  const data = await res.json();
  return data;
};
// import { useRouter } from "next/router";
import { mutate } from "swr";
export default function Student({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR("/students", () =>
    fetchGrades(params.id)
  );
  const [chooseUser, setChooseUser] = useState<IStudent>({} as IStudent);
  const [showModal, setShowModal] = useState(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  console.log({ data, error, isLoading }, params.id);
  const handleUpdateStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (chooseUser && chooseUser.id) {
      {
        const res = await fetch(
          `http://localhost:4000/students/${chooseUser.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(chooseUser),
          }
        );
        const data = await res.json();
        mutate("/students");
        setShowModal(false);
      }
    } else {
      const data = {
        ...chooseUser,
        class: params.id,
      };
      await fetch(`http://localhost:4000/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          mutate("/students");
          setShowModal(false);
        });
    }
  };
  const handleDeleteStudent = async () => {
    if (chooseUser && chooseUser.id) {
      {
        const res = await fetch(
          `http://localhost:4000/students/${chooseUser.id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        mutate("/students");
        setShowModal(false);
      }
    }
  };

  return (
    <section>
      <div className="w-full flex bg-white justify-between items-center p-2">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 ">
          Quản lí khối lớp
        </h1>
        <div>
          <CSVLink
            data={
              data?.map((item: IStudent) => {
                return {
                  ...item,
                  class: item.class.name,
                };
              }) || []
            }
            filename="students.csv"
            className="bg-green-500 p-2 px-4 rounded focus:bg-green-800 inline-flex gap-2"
            target="_blank"
            href="#"
          >
            <FaFileExcel size={20} />{" "}
            <span className="hidden md:block">Xuất excel</span>
          </CSVLink>
          <button
            className="ml-2 bg-green-500 p-2 px-4 rounded focus:bg-green-800 inline-flex gap-2"
            onClick={() => {
              setShowModal(true);
              setChooseUser({} as IStudent);
            }}
          >
            <FaPlus size={20} /> <span className="hidden md:block">Thêm</span>
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white mt-2">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-0 py-3">
                Tên Thánh
              </th>
              <th scope="col" className="px-0 py-3">
                Họ và tên
              </th>
              <th scope="col" className="px-0 py-3">
                Giới tính
              </th>
              <th scope="col" className="px-0 py-3">
                Số điện thoại
              </th>
              <th scope="col" className="px-0 py-3">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item: IStudent) => {
              return (
                <tr
                  key={item.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-2"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="checkbox-table-search-2"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="flex items-center px-0 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.holy_name}
                  </th>
                  <td className="px-0 py-4">{item.full_name || ""}</td>
                  <td className="px-0 py-4">
                    <div className="flex items-center">
                      {item.sex ? "Nam" : "Nữ"}
                    </div>
                  </td>
                  <td className="px-0 py-4">{item.phone || ""}</td>

                  <td className="px-0 py-4 flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => {
                        setChooseUser(item);
                        setShowModal(true);
                      }}
                    >
                      <FaEdit color="green" size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setChooseUser(item);
                        setIsShowModalConfirm(true);
                      }}
                    >
                      <FaTrashAlt color="red" size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Edit user modal */}
        <div
          id="editUserModal"
          tabIndex={-1}
          aria-hidden="true"
          className={`${
            showModal ? "block" : "hidden"
          } fixed top-0 left-0 right-0 z-50 items-center justify-center  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
        >
          <div className="relative w-full max-w-2xl max-h-full">
            {/* Modal content */}
            <form
              className="relative bg-white rounded-lg shadow dark:bg-gray-700"
              onSubmit={(e) => {
                setChooseUser({} as IStudent);
                handleUpdateStudent(e);
              }}
            >
              {/* Modal header */}
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit user
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="editUserModal"
                  onClick={() => {
                    setShowModal(false);
                    // setChooseUser({} as IStudent);
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tên thánh
                    </label>
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Bonnie"
                      required
                      value={chooseUser?.holy_name || ""}
                      onChange={(e) => {
                        setChooseUser({
                          ...chooseUser,
                          holy_name: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="last-name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Họ tên
                    </label>
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Green"
                      required
                      value={chooseUser?.full_name || ""}
                      onChange={(e) => {
                        setChooseUser({
                          ...chooseUser,
                          full_name: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Ngày rửa tội
                    </label>
                    <input
                      type="date"
                      name="baptism_day"
                      id="baptism_day"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      value={
                        new Date(chooseUser?.baptism_day || 0)
                          ?.toISOString()
                          ?.slice(0, 10) || ""
                      }
                      onChange={(e) => {
                        setChooseUser({
                          ...chooseUser,
                          baptism_day: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="phone-number"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Điện thoại
                    </label>
                    <input
                      type="number"
                      name="phone-number"
                      id="phone-number"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="e.g. +(12)3456 789"
                      required
                      value={chooseUser?.phone || ""}
                      onChange={(e) => {
                        setChooseUser({
                          ...chooseUser,
                          phone: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="department"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tên cha
                    </label>
                    <input
                      type="text"
                      name="department"
                      id="department"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Development"
                      required
                      value={chooseUser?.father_name || ""}
                      onChange={(e) => {
                        setChooseUser({
                          ...chooseUser,
                          father_name: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="company"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tên mẹ
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder={""}
                      required
                      value={chooseUser?.mother_name || ""}
                      onChange={(e) => {
                        setChooseUser({
                          ...chooseUser,
                          mother_name: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="current-password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Lớp
                    </label>
                    <input
                      type="text"
                      name="current-password"
                      id="current-password"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder=""
                      disabled
                      value={chooseUser?.class?.name || params.id}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="new-password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Giới tính
                    </label>
                    <input
                      type="text"
                      name="new-password"
                      id="new-password"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      // placeholder="••••••••"
                      required
                      value={chooseUser?.sex}
                      onChange={(e) => {
                        setChooseUser({
                          ...chooseUser,
                          sex: +e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Save all
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isShowModalConfirm && (
        <ModalConfirm
          message="Do you want to delete this student?"
          onConfirm={handleDeleteStudent}
          onClose={() => setIsShowModalConfirm(false)}
        />
      )}
    </section>
  );
}
