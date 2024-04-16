// Import các components và hàm từ React và MUI
"use client";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import useSWR from "swr";
import { IClass, IStudent } from "../types/common";
import { DndContext, useDroppable } from "@dnd-kit/core";
import Draggable from "./components/Draggable";
import Droppable from "./components/Droppable";
import { message, notification } from "antd";

// Hàm fetchClasses không thay đổi
async function fetchClasses(): Promise<IClass[]> {
  const res = await fetch("http://localhost:4000/classes");
  const data = await res.json();
  return data;
}

// Hàm fetchStudents không thay đổi
async function fetchStudents(idClass: string): Promise<IStudent[]> {
  const res = await fetch(`http://localhost:4000/students/${idClass}/classes`);
  const data = await res.json();
  return data;
}

interface RecordType extends IStudent {}
export default function Page() {
  const { data: classes } = useSWR<IClass[]>("classes", fetchClasses);
  const [selectedClassLeft, setSelectedClassLeft] = useState("");
  const [selectedClassRight, setSelectedClassRight] = useState("");
  const [studentsLeft, setStudentsLeft] = useState<IStudent[]>([]);
  const [studentsRight, setStudentsRight] = useState<IStudent[]>([]);

  // Fetch students for left class when selected class changes
  useEffect(() => {
    if (selectedClassLeft) {
      fetchStudents(selectedClassLeft).then((data) => {
        setStudentsLeft(data);
      });
    }
  }, [selectedClassLeft]);

  // Fetch students for right class when selected class changes
  useEffect(() => {
    if (selectedClassRight) {
      fetchStudents(selectedClassRight).then((data) => {
        setStudentsRight(data);
      });
    }
  }, [selectedClassRight]);

  const handleChangeClass = async () => {
    console.log({ studentsLeft, studentsRight });

    const res = await fetch("http://localhost:4000/students/saveChanges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classFrom: selectedClassLeft,
        classTo: selectedClassRight,
        leftStudents: studentsLeft,
        rightStudents: studentsRight,
      }),
    });

    if (res.ok) {
      setSelectedClassLeft("");
      setSelectedClassRight("");
      setStudentsLeft([]);
      setStudentsRight([]);
      const data = await res.json();
      message.success(data.message);
    } else {
      message.error("Chuyển lớp thất bại");
    }
  };
  const moveStudentRight = (student: IStudent) => {
    if (selectedClassRight === "") {
      return message.error("Vui lòng chọn lớp muốn chuyển");
    }
    // Remove student from the left container
    const updatedStudentsLeft = studentsLeft.filter((s) => s.id !== student.id);
    setStudentsLeft(updatedStudentsLeft);

    // Add student to the right container
    setStudentsRight([...studentsRight, student]);
  };

  // Function to move a student from the right container to the left container
  const moveStudentLeft = (student: IStudent) => {
    if (selectedClassLeft === "") {
      return message.error("Vui lòng chọn lớp cần chuyển");
    }
    console.log("Move student left: ", student);
    // Remove student from the right container
    const updatedStudentsRight = studentsRight.filter(
      (s) => s.id !== student.id
    );
    setStudentsRight(updatedStudentsRight);
    // Add student to the left container
    setStudentsLeft([...studentsLeft, student]);
  };
  return (
    <div className="px-0 md:p-10 bg-blue-600 pt-2">
      <div className="flex gap-2">
        <select
          value={selectedClassLeft}
          onChange={(e) => setSelectedClassLeft(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select Class</option>
          {classes &&
            classes.length > 0 &&
            classes?.map((item: IClass) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>

        <select
          value={selectedClassRight}
          onChange={(e) => setSelectedClassRight(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select Class</option>
          {classes &&
            classes.length > 0 &&
            classes
              ?.filter((item: IClass) => item.id !== selectedClassLeft)
              ?.map((item: IClass) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
        </select>
      </div>
      <DndContext>
        <div className="flex gap-4 mt-2">
          {/* Render Draggable for each student in studentsLeft */}
          <div className="w-1/2 bg-red-50 ">
            {studentsLeft.length > 0 ? (
              studentsLeft.map((student) => (
                <Draggable
                  key={student.id}
                  student={student}
                  onDrop={() => moveStudentRight(student)}

                />
              ))
            ) : (
              <p className="text-center text-black">
                No students in this class
              </p>
            )}
          </div>
          {/* Render Droppable for studentsRight */}
          <div className="w-1/2 bg-yellow-200 ">
            <Droppable
              students={studentsRight}
              onDrop={(student) => moveStudentLeft(student)}
            ></Droppable>
          </div>
        </div>
      </DndContext>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          color="success"
          onClick={handleChangeClass}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
