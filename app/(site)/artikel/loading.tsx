export default function ArtikelLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-12 animate-pulse">
      <div className="mb-10">
        <div className="h-3 w-16 bg-card rounded mb-3" />
        <div className="h-9 w-32 bg-card rounded" />
      </div>
      <div className="flex gap-2 mb-10">
        {[80, 64, 72, 56].map((w, i) => (
          <div key={i} className="h-7 bg-card rounded-full" style={{ width: w }} />
        ))}
      </div>
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
