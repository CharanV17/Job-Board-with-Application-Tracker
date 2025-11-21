import { useEffect, useState } from "react";
import { applicationService } from "../../services/application.service";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const columns = [
  { key: "Applied", title: "Applied", color: "bg-blue-100" },
  { key: "Screening", title: "Screening", color: "bg-yellow-100" },
  { key: "Interview", title: "Interview", color: "bg-purple-100" },
  { key: "Offer", title: "Offer", color: "bg-green-100" },
  { key: "Rejected", title: "Rejected", color: "bg-red-100" }
];

export default function CandidateDashboard() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    const data = await applicationService.getMyApplications();
    setApps(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Group apps by column
  const grouped = columns.reduce((acc: any, col) => {
    acc[col.key] = apps.filter((a: any) => a.status === col.key);
    return acc;
  }, {});

  // Convert to structure usable by DnD
  const [columnData, setColumnData] = useState<any>({});

  useEffect(() => {
    const initial: any = {};
    columns.forEach((col) => {
      initial[col.key] = grouped[col.key] || [];
    });
    setColumnData(initial);
  }, [apps]);

const onDragEnd = async (result: any) => {
  const { destination, source } = result;

  if (!destination) return;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  const sourceCol = source.droppableId;
  const destCol = destination.droppableId;

  const app = columnData[sourceCol][source.index];

  const updated = { ...columnData };
  updated[sourceCol] = [...updated[sourceCol]];
  updated[destCol] = [...updated[destCol]];

  updated[sourceCol].splice(source.index, 1);
  updated[destCol].splice(destination.index, 0, {
    ...app,
    status: destCol
  });

  setColumnData(updated);

  try {
    await applicationService.updateStatus(app._id, destCol);
  } catch (err) {
    alert("Failed to update status");
    fetchApps();
  }
};


  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Application Tracker</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {columns.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded-lg shadow min-h-[300px] ${
                    snapshot.isDraggingOver ? "bg-gray-200" : "bg-gray-50"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-3">{col.title}</h2>

                  {columnData[col.key]?.map((app: any, index: number) => (
                    <Draggable key={app._id} draggableId={app._id} index={index}>
                      {(provided) => (
                        <div
                          className={`p-4 mb-3 rounded ${col.color} shadow cursor-pointer`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h3 className="font-medium">{app.job.title}</h3>
                          <p className="text-sm text-gray-600">
                            {app.job.location}
                          </p>
                          <div className="text-xs text-gray-500 mt-2">
                            Applied:{" "}
                            {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  {columnData[col.key]?.length === 0 && (
                    <p className="text-gray-400 text-sm">No applications</p>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
