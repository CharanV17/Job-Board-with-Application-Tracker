import { useEffect, useState } from "react";
import { applicationService } from "../../services/application.service";
import { useAuthStore } from "../../store/auth";
import EmptyState from "../../components/ui/EmptyState";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const columns = [
  { key: "Applied", title: "Applied", color: "bg-blue-100" },
  { key: "Screening", title: "Screening", color: "bg-yellow-100" },
  { key: "Interview", title: "Interview", color: "bg-purple-100" },
  { key: "Offer", title: "Offer", color: "bg-green-100" },
  { key: "Rejected", title: "Rejected", color: "bg-red-100" }
];

export default function CandidateDashboard() {
  const user = useAuthStore((s) => s.user);
  const loadingAuth = useAuthStore((s) => s.loading);

  const [apps, setApps] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

const fetchApplications = async () => {
  try {
    const data = await applicationService.getMyApplications();
    setApps(data);
  } catch (err) {
    console.error(err);
    setApps([]); // ensures EmptyState triggers instead of stuck UI
  }
  setLoadingData(false);
};


  useEffect(() => {
    if (!loadingAuth && user) fetchApplications();
  }, [loadingAuth, user]);

  // Loading stage
  if (loadingAuth || loadingData)
    return <div className="text-center py-20">Loading...</div>;

  // Empty state
  if (apps.length === 0)
    return (
      <EmptyState
        title="No applications yet"
        message="Start applying to jobs and track your progress here."
      />
    );

  // Group apps by status
  const grouped = columns.reduce((acc: any, col) => {
    acc[col.key] = apps.filter((a: any) => a.status === col.key);
    return acc;
  }, {});

  const [columnData, setColumnData] = useState(grouped);

  useEffect(() => {
    setColumnData(grouped);
  }, [apps]);

  const onDragEnd = async (result: any) => {
    const { destination, source } = result;
    if (!destination) return;

    const srcCol = source.droppableId;
    const dstCol = destination.droppableId;
    if (srcCol === dstCol && destination.index === source.index) return;

    const app = columnData[srcCol][source.index];

    const updated = structuredClone(columnData);
    updated[srcCol].splice(source.index, 1);
    updated[dstCol].splice(destination.index, 0, { ...app, status: dstCol });
    setColumnData(updated);

    try {
      await applicationService.updateStatus(app._id, dstCol);
    } catch {
      alert("Failed to update status");
      fetchApplications();
    }
  };

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
