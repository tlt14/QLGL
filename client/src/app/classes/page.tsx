"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { FaEdit, FaFileExcel, FaPlus, FaTrashAlt } from "react-icons/fa";
import useSWR, { mutate } from "swr";
import { IClass, IGrade } from "../types/common";
import { CSVLink } from "react-csv";
import ModalConfirm from "../components/ModalConfirm";

const fetchClasses = async () => {
  const res = await fetch("http://localhost:4000/classes");
  const data = await res.json();
  return data;
};
const fetchGrades = async () => {
  const res = await fetch("http://localhost:4000/grades");
  const data = await res.json();
  return data;
};
export default function Classes() {
  const { data, error, isLoading } = useSWR("/classes", fetchClasses);
  console.log({ data, error, isLoading });
  const [chooseClass, setChooseClass] = useState<IClass>({} as IClass);
  const [showModal, setShowModal] = useState(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const handleUpdateStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (chooseClass && chooseClass.id) {
      {
        const res = await fetch(
          `http://localhost:4000/classes/${chooseClass.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...chooseClass,
              id: chooseClass.id,
              name: chooseClass.name,
              grade: chooseClass.grade?.id? chooseClass.grade?.id:grades[0].id,
            }),
          }
        );
        const data = await res.json();
        mutate("/classes");
        setShowModal(false);
      }
    } else {
      const data = {
        name: chooseClass.name,
        grade:chooseClass.grade?.id? chooseClass.grade?.id : grades[0].id,
      };
      await fetch(`http://localhost:4000/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          mutate("/classes");
          setShowModal(false);
        });
    }
  };
  const handleDeleteStudent = async () => {
    if (chooseClass && chooseClass.id) {
      {
        const res = await fetch(
          `http://localhost:4000/classes/${chooseClass.id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        mutate("/classes");
        setShowModal(false);
      }
    }
  };
  const { data: grades } = useSWR("/grades", fetchGrades);
  return (
    <section>
      <div className="w-full flex bg-white justify-between items-center p-2">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 ">
          Quản lí khối lớp
        </h1>
        <div>
          <CSVLink
            data={[]}
            filename="students.csv"
            className="bg-green-500 p-2 px-4 rounded focus:bg-green-800 inline-flex gap-2"
            target="_blank"
            href="#_"
          >
            <FaFileExcel size={20} />{" "}
            <span className="hidden md:block">Xuất excel</span>
          </CSVLink>
          <button
            className="ml-2 bg-green-500 p-2 px-4 rounded focus:bg-green-800 inline-flex gap-2"
            onClick={() => {
              setShowModal(true);
              setChooseClass({} as IClass);
            }}
          >
            <FaPlus size={20} /> <span className="hidden md:block">Thêm</span>
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white mt-2">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                Tên lớp
              </th>
              <th scope="col" className="px-0 py-3">
                Tên khối
              </th>
              <th scope="col" className="px-0 py-3">
                Sỉ số
              </th>
              <th scope="col" className="px-0 py-3">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item: IClass) => {
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
                  <Link
                    href={`/students/${item.id}`}
                    className="flex items-center px-0 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.name}
                  </Link>
                  <td className="px-0 py-4">{item?.grade?.name || ""}</td>
                  <td className="px-0 py-4">
                    <div className="flex items-center">
                      {item?.students?.length || 0}
                    </div>
                  </td>
                  <td className="px-0 py-4 flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setChooseClass(item);
                      }}
                    >
                      <FaEdit color="green" size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setIsShowModalConfirm(true);
                        setChooseClass(item);
                      }}
                    >
                      <FaTrashAlt color="red" size={20} />
                    </button>
                    <Link
                      href={`/attendance/${item.id}`}
                      className="text-blue-800 bg-white rounded px-2 py-2"
                    >
                      Điểm danh
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Edit user modal */}
        <div
          id="editClassModal"
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
              onSubmit={handleUpdateStudent}
            >
              {/* Modal header */}
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Lớp học
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="editClassModal"
                  onClick={() => {
                    setShowModal(false);
                    setChooseClass({} as IClass);
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
                      Tên lớp học
                    </label>
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Khai tâm 1"
                      required
                      value={chooseClass?.name || ""}
                      onChange={(e) =>
                        setChooseClass({
                          ...chooseClass,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <div>
                      <label
                        htmlFor="countries"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Chọn khối
                      </label>
                      <select
                        id="countries"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={chooseClass?.grade?.id || ""}
                        onChange={(e) =>
                          setChooseClass({
                            ...chooseClass,
                            grade: {
                              ...chooseClass?.grade,
                              id: e.target.value,
                            },
                          })
                        }
                      >
                        {grades?.map((grade: IGrade) => (
                          <option
                            key={grade.id}
                            value={grade.id}
                            selected={chooseClass?.grade?.id === grade.id}
                          >
                            {grade.name}
                          </option>
                        ))}
                      </select>
                    </div>
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
          message="Do you want to delete this class?"
          onConfirm={handleDeleteStudent}
          onClose={() => setIsShowModalConfirm(false)}
        />
      )}
    </section>
  );
}
