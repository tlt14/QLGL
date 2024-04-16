"use client";
import { IStudent } from "@/app/types/common";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

const fetchStudents = async (idClass: string) => {
  const res = await fetch(`http://localhost:4000/students/${idClass}/classes`);
  const data = await res.json();
  return data;
};
const fetchAttendanceRecords = async (idClass: string, date: string) => {
  const res = await fetch(
    `http://localhost:4000/attendance-sessions/getSessionIdByClassIdAndDate/${idClass}/${date}`
  );
  const data = await res.json();
  return data;
};
const getRecords = async (sessionId: string) => {
  const res = await fetch(
    `http://localhost:4000/attendance-records/get-by-session/${sessionId}`
  );
  const data = await res.json();
  return data;
};

export default function Page({ params }: { params: { id: string } }) {
  const [date, setDate] = useState(new Date());

  const { data, error, isLoading } = useSWR("/students", () =>
    fetchStudents(params.id)
  );
  const { data: sessionId } = useSWR("/getSessionIdByClassIdAndDate", () =>
    fetchAttendanceRecords(params.id, date.toISOString().split("T")[0])
  );
  const { data: records } = useSWR(
    () => (sessionId?.id ? "/records" : null),
    () => {
      return sessionId?.id ? getRecords(sessionId.id) : [];
    }
  );

  const handleAttendance = async (idStudent: string, state: boolean) => {
    const res = await fetch(
      `http://localhost:4000/attendance-sessions/attendance/${params.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date.toISOString().split("T")[0],
          student: idStudent,
        }),
      }
    );
    const data = await res.json();
    console.log(data);
    mutate("/records");
  };
  console.log(
    new Date(date).toISOString().split("T")[0],
    sessionId?.id !== undefined
  );

  useEffect(() => {
    if (date) {
      mutate("/getSessionIdByClassIdAndDate");
    }
  }, [date]);
  return (
    <div className="w-full md:w-10/12 mx-auto mt-2 ">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 items-center">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-0 py-3">
              Họ và tên
            </th>
            <th scope="col" className="px-0 py-3">
              Ngày{" "}
              {sessionId?.date ? (
                sessionId.date
              ) : (
                <>
                  <input
                    type="date"
                    value={date.toISOString().split("T")[0]}
                    onChange={(e) => {
                      setDate(new Date(e.target.value));
                    }}
                  />
                </>
              )}
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
                <td className="px-0 py-4">{item.full_name || ""}</td>
                <td className="px-0 py-4">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      console.log(
                        item.id,
                        date.toISOString().split("T")[0],
                        sessionId?.id
                      );
                      handleAttendance(item.id, e.target.checked);
                    }}
                    checked={
                      records &&
                      records?.students?.some(
                        (record: any) => record.student.id === item.id
                      ) &&
                      sessionId?.id !== undefined
                        ? true
                        : false
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
