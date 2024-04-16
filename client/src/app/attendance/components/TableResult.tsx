import { IStudent } from "@/app/types/common";

export default function TableResult({
  data,
  students,
}: {
  data: any;
  students: IStudent[];
}) {
  if (!data || Object.keys(data).length === 0) {
    return <div>No data available</div>;
  }
  // Chuyển data thành một mảng các cặp sessionDate và attendanceRecords
  const dataEntries = Object?.entries(data);

  console.log("dataEntries", dataEntries);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              #
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            {dataEntries.map(([sessionDate, _]) => (
              <th scope="col" className="px-6 py-3" key={sessionDate}>
                {sessionDate}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students?.map((student, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {rowIndex + 1}
              </th>
              <td className="px-6 py-4">{student.full_name}</td>
              {dataEntries.map(([sessionDate, attendanceRecords], colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {(attendanceRecords as any).find(
                    (record: any) => record.student.id === student.id
                  )
                    ? "Present"
                    : "Absent"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
