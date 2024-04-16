"use client";
import useSWR from "swr";
import TableResult from "./components/TableResult";
import { IClass } from "../types/common";
import { useState } from "react";
const fetchAttendance = async (classId: string) => {
  const res = await fetch(
    "http://localhost:4000/attendance-records/get-by-class/" + classId
  );
  const data = await res.json();
  return data;
};

const fetchClasses = async () => {
  const res = await fetch("http://localhost:4000/classes");
  const data = await res.json();
  return data;
};

const fetchStudents = async (classId: string) => {
  const res = await fetch(`http://localhost:4000/students/${classId}/classes`);
  const data = await res.json();
  return data;
};

export default function Page() {
  const { data } = useSWR("/classes", fetchClasses);
  const [chooseClass, setChooseClass] = useState<IClass>();
  const { data: records } = useSWR(
    chooseClass ? `/attendance-records/get-by-class/${chooseClass.id}` : null,
    () => fetchAttendance(chooseClass?.id as string)
  );

  const { data: students } = useSWR(
    chooseClass ? `/students/${chooseClass.id}/classes` : null,
    () => fetchStudents(chooseClass?.id as string)
  );
  return (
    <div className="px-0 md:px-4 bg-blue-600">
      <h1 className="text-center text-xl font-bold p-2 text-white">Kết quả điểm danh </h1>
      {/* select class */}
      <select
        className="w-full border border-gray-300 rounded-md mb-2 p-2 "
        onChange={(e) => {
          const classId = e.target.value;
          const classSelected = (data as IClass[]).find(
            (item: IClass) => item.id === classId
          );
          setChooseClass(classSelected);
        }}
      >
        <option value="" className="bg-gray-800 text-white">
          Select Class
        </option>
        {data?.map((item: IClass) => (
          <option
            key={item.id}
            value={item.id}
            className="bg-gray-800 text-white"
          >
            {item.name}
          </option>
        ))}
      </select>
      <TableResult data={records} students={students} />
    </div>
  );
}
