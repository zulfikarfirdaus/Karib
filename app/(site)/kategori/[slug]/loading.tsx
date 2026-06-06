export default function KategoriLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-12 animate-pulse">
      <div className="h-4 w-24 bg-card rounded mb-4" />
      <div className="h-10 w-48 bg-card rounded mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <div className="aspect-[16/10] bg-card rounded-xl mb-4" />
            <div className="h-3 w-1/3 bg-card rounded mb-2" />
            <div className="h-5 bg-card rounded mb-2" />
            <div className="h-4 w-2/3 bg-card rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
