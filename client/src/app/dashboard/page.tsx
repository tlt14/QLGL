"use client";
import useSWR from "swr";
import Header from "../components/Header";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import Stat from "./components/Stat";
import { Fa500Px, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
const fetchDashboard = async () => {
  const res = await fetch("http://localhost:4000/dashboard");
  const data = await res.json();
  return data;
};
export default function Page() {
  const { data, error, mutate } = useSWR("/dashboard", fetchDashboard, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return (
    <div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Stat
          icon={<FaUsers size={34} className="text-blue-600" />}
          title={"Học sinh"}
          value={data?.totalStudents}
        />
        <Stat
          icon={<FaChalkboardTeacher size={34} className="text-blue-600" />}
          title={"Lớp học"}
          value={data?.totalClass}
        />
        <Stat
          icon={<FaUsers size={34} className="text-blue-600" />}
          title={"Giáo lý viên"}
          value={data?.totalUser}
        />
        <PieChart className="col-span-1 p-2" />
        <BarChart />
      </div>
    </div>
  );
}
