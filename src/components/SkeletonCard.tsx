export default function SkeletonCard() {
  return (
    <div className="bg-white shadow-md rounded p-5 border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-2/3 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}
