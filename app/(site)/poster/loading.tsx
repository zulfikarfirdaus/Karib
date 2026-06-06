export default function PosterLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-12 animate-pulse">
      <div className="mb-10">
        <div className="h-9 w-24 bg-card rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-card rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
