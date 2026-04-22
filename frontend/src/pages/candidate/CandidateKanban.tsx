import  { useEffect, useState } from "react";

// 🟢 ONLY TYPE imported as type
import type { DragEndEvent } from "@dnd-kit/core";

// 🟢 REAL values imported normally
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import axios from "axios";

type Application = {
  _id: string;
  status: string;
  job: {
    title: string;
    company?: string;
  };
};

const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Rejected"];

const CandidateKanban = () => {
  const [columns, setColumns] = useState<{ [key: string]: Application[] }>({});

  // ===========================
  // FETCH APPLICATIONS
  // ===========================
  const fetchApplications = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("/api/applications/my", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const grouped: any = {};
    STATUSES.forEach((status) => (grouped[status] = []));

    res.data.applications.forEach((app: Application) => {
      grouped[app.status].push(app);
    });

    setColumns(grouped);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ===========================
  // DRAG END HANDLER
  // ===========================
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const fromCol = active.data.current?.column;
    const toCol = over.data.current?.column;

    if (!fromCol || !toCol || fromCol === toCol) return;

    const fromItems = [...columns[fromCol]];
    const toItems = [...columns[toCol]];

    const draggedItem = fromItems.find((i) => i._id === active.id);
    if (!draggedItem) return;

    // Update UI instantly
    setColumns({
      ...columns,
      [fromCol]: fromItems.filter((i) => i._id !== active.id),
      [toCol]: [...toItems, { ...draggedItem, status: toCol }],
    });

    // Send API update
    const token = localStorage.getItem("token");
    await axios.put(
      `/api/applications/${active.id}/status`,
      { status: toCol },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  return (
    <div className="w-full p-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {STATUSES.map((status) => (
          <div key={status} className="bg-gray-100 rounded-lg p-3 shadow">
            <h2 className="text-lg font-semibold text-center mb-3">{status}</h2>

            <SortableContext
              items={columns[status]?.map((item) => item._id) || []}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {columns[status]?.map((app: Application) => (
                  <SortableItem
                    key={app._id}
                    id={app._id}
                    column={status}
                  >
                    <div className="p-3 bg-white shadow rounded-lg border">
                      <p className="font-semibold">{app.job.title}</p>
                      <p className="text-sm text-gray-500">
                        {app.job.company || "Company"}
                      </p>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </DndContext>
    </div>
  );
};

export default CandidateKanban;
