"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { IStudent } from "@/app/types/common";
import { message } from "antd";

// Fetch classes function remains unchanged

const fetchStudents = async (idClass: string) => {
  const res = await fetch(`http://localhost:4000/scores/class/${idClass}`);
  const data = await res.json();
  return data;
};

const fetchClasses = async () => {
  const res = await fetch("http://localhost:4000/classes");
  const data = await res.json();
  return data;
};

export default function Page({ params }: { params: { id: string } }) {
  const { data: classes } = useSWR("/classes", fetchClasses);
  const [chooseClass, setChooseClass] = useState<any>(null);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [scores, setScores] = useState<{
    [id: string]: { midterm: string; final: string };
  }>({});

  const {
    data: studentData,
    error,
    isLoading,
  } = useSWR(chooseClass ? `/students/${chooseClass.id}/classes` : null, () =>
    fetchStudents(chooseClass.id)
  );

  useEffect(() => {
    if (studentData && studentData.length > 0) {
      const scoresData: { [id: string]: { midterm: string; final: string } } =
        {};
      studentData.forEach((student: any) => {
        scoresData[student.id] = {
          midterm: student.midterm,
          final: student.final,
        };
      });
      setScores(scoresData);
      setStudents(studentData);
    }else{
      setStudents([]);
      setScores({});
    }
  }, [studentData]);

  const updateScore = (studentId: string, type: string, value: string) => {
    setScores((prevScores) => ({
      ...prevScores,
      [studentId]: {
        ...prevScores[studentId],
        [type]: value,
      },
    }));
  };

  const sendScores = async () => {
    const updatedScores = Object.entries(scores).map(([id, score]) => ({
      student: id,
      ...score,
    }));
    // check data here
    if (!updatedScores.every(({ student, midterm, final }) => student && midterm && final)) {
      message.error("Vui lòng điền đầy đủ điểm thi");
      return;
    }
    try {
      await fetch("http://localhost:4000/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedScores),
      });
      console.log("Scores updated successfully!");
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };
  console.log(students)

  return (
    <div className="w-full bg-blue-600 pt-2">
      <form className="max-w-sm mx-auto">
        <label
          htmlFor="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Chọn lớp muốn ghi điểm
        </label>
        <select
          id="countries"
          className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => {
            const selectedClass = classes.find(
              (item: any) => item.id === e.target.value
            );
            setChooseClass(selectedClass);
          }}
        >
          {classes?.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </form>

      <table className="w-full text-sm text-left rtl:text-right dark:text-gray-400 items-center text-white">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-0 py-3">
              Họ và tên
            </th>
            <th scope="col" className="px-0 py-3">
              Điểm giữa kỳ
            </th>
            <th scope="col" className="px-0 py-3">
              Điểm cuối kỳ
            </th>
          </tr>
        </thead>
        <tbody>
          {students.length>0?
          students?.map((item: any) => (
            <tr
              key={item.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-0 py-4">{item.student.full_name || ""}</td>
              <td className="px-0 py-4">
                <input
                  className="w-10 outline-none "
                  type="number"
                  value={scores[item.id]?.midterm || ""}
                  onChange={(e) =>
                    updateScore(item.id, "midterm", e.target.value)
                  }
                />
              </td>
              <td className="px-0 py-4">
                <input
                  className="w-10 outline-none "
                  type="number"
                  value={scores[item.id]?.final || ""}
                  onChange={(e) =>
                    updateScore(item.id, "final", e.target.value)
                  }
                />
              </td>
            </tr>
          )):<tr><td>Không có học sinh nào trong lớp</td></tr>}
        </tbody>
      </table>
      <div className="w-full justify-center flex ">
      <button onClick={sendScores} className="btn p-2 bg-green-500 text-white  mt-2 rounded focus:bg-green-800">Lưu điểm</button>

      </div>
    </div>
  );
}
