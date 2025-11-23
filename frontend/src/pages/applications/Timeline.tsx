interface Props {
  history: {
    status: string;
    at: string;
    changedBy?: string;
  }[];
}

export default function Timeline({ history }: Props) {
  if (!history || history.length === 0)
    return <p className="text-gray-500">No history available</p>;

  return (
    <div className="space-y-4 mt-4">
      {history.map((h, i) => (
        <div
          key={i}
          className="p-3 border-l-4 border-blue-600 bg-blue-50 rounded"
        >
          <p className="font-semibold">{h.status}</p>
          <p className="text-gray-600 text-sm">
            {new Date(h.at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
