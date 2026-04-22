import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({
  id,
  children,
  column,
}: {
  id: string;
  children: React.ReactNode;
  column: string;
}) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id,
      data: { column },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default SortableItem;
