export default function LoadingFallback({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white font-bold">
      {message}
    </div>
  );
}