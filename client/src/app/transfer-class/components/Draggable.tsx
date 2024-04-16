import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { IStudent } from "@/app/types/common";

interface DraggableProps {
  student: IStudent;
  onDrop: (event: any) => void;
}

const Draggable: React.FC<DraggableProps> = ({ student, onDrop }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${student.id}`,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onDrop(student)}
      className="cursor-move font-medium md:font-bold text-black p-2 divide-y-2 border border-dotted border-gray-400 mb-1 md:mb-3 text-sm md:text-lg"
      draggable
    >
      {student.full_name}
    </div>
  );
};

export default Draggable;
