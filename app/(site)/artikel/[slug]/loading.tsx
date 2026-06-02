export default function ArtikelDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      <div className="flex gap-2 mb-8">
        <div className="h-3 w-16 bg-card rounded" />
        <div className="h-3 w-2 bg-card rounded" />
        <div className="h-3 w-20 bg-card rounded" />
      </div>

      <div className="max-w-[680px] mx-auto mb-10">
        <div className="h-3 w-20 bg-card rounded mb-4" />
        <div className="h-10 bg-card rounded mb-3" />
        <div className="h-10 w-3/4 bg-card rounded mb-6" />
        <div className="h-5 bg-card rounded mb-2" />
        <div className="h-5 w-5/6 bg-card rounded mb-6" />
        <div className="flex justify-between">
          <div className="h-3 w-32 bg-card rounded" />
          <div className="h-3 w-24 bg-card rounded" />
        </div>
      </div>

      <div className="aspect-[2/1] bg-card rounded-xl mb-10" />

      <div className="max-w-[680px] mx-auto space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 bg-card rounded" style={{ width: i % 3 === 2 ? "70%" : "100%" }} />
        ))}
        <div className="h-4 bg-card rounded w-4/5" />
        <div className="pt-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-card rounded" style={{ width: i % 4 === 3 ? "60%" : "100%" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
