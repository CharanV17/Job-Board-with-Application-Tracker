export default function EmptyState({ title, message }: any) {
  return (
    <div className="text-center py-16 text-gray-600">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p>{message}</p>
    </div>
  );
}
