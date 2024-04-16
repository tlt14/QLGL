import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { IStudent } from "@/app/types/common";

interface DroppableProps {
  students: IStudent[];
  onDrop: (student: IStudent) => void;
}

const Droppable: React.FC<DroppableProps> = ({ students, onDrop }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  const style = {
    border: isOver ? "2px dashed #333" : "2px dashed transparent",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {students.length > 0 ? (
        students.map((student: IStudent) => (
          <div
            key={student.id}
            onClick={() => onDrop(student)}
            style={{ cursor: "pointer" }}
            className="cursor-move font-medium md:font-bold text-black p-2 divide-y-2 border border-dotted border-gray-400 mb-1 md:mb-3 text-sm md:text-lg"
          >
            {student.full_name}
          </div>
        ))
      ) : (
        <p className="text-center text-black">No students in this class</p>
      )}
    </div>
  );
};

export default Droppable;
