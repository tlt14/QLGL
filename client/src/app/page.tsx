"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import useSWR from "swr";
import { IStudent } from "./types/common";
const fetchStudent = async (phone: string) => {
  const res = await fetch(`http://localhost:4000/students/${phone}/search`);
  const data = await res.json();
  return data;
};
export default function Home() {
  const { data, status, update } = useSession();
  const router = useRouter();
  const keySearch = useRef<HTMLInputElement>(null);
  const pathname = useSearchParams();

  const { data: students, mutate } = useSWR(
    keySearch.current?.value || pathname.get("student")
      ? `?student=${keySearch.current?.value || pathname.get("student")}`
      : null,
    () =>
      fetchStudent(
        keySearch.current?.value || (pathname.get("student") as string)
      )
  );
  console.log(pathname.get("student"), students);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`?student=${keySearch.current?.value}`);
    console.log(keySearch.current?.value);
    mutate();
  };
  if (status === "authenticated") {
    return router.push("/dashboard");
  } else
    return (
      <SessionProvider>
        <main className="min-h-screen p-24">
          <h1 className="text-center py-4 text-3xl font-bold bg-gradient-to-t from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Tra cứu học viên
          </h1>

          <section className="w-full">
            <form className="max-w-full mx-auto" onSubmit={handleSubmit}>
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search..."
                  required
                  ref={keySearch}
                />
                <button
                  type="submit"
                  className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
              </div>
            </form>
          </section>

          <div className="w-full mt-3">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      STT
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Tên thánh
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Tên học viên
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Lớp
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Số điện thoại
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Điểm giữa kỳ
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Điểm cuối kỳ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students && students.length > 0 ? (
                    students.map((student: IStudent, index: number) => {
                      return (
                        <tr
                          key={student.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {index + 1}
                          </th>
                          <td className="px-6 py-4">{student.holy_name}</td>
                          <td className="px-6 py-4">{student.full_name}</td>
                          <td className="px-6 py-4">{student.class.name}</td>
                          <td className="px-6 py-4">{student.phone}</td>
                          <td className="px-6 py-4">
                            {student.scores?.[0]?.midterm || "-"}
                          </td>
                          <td className="px-6 py-4">
                            {student.scores?.[0]?.final || "-"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </SessionProvider>
    );
}
