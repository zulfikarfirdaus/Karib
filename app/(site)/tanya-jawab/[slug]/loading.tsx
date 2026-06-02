export default function TanyaJawabDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      <div className="flex gap-2 mb-8">
        <div className="h-3 w-24 bg-card rounded" />
        <div className="h-3 w-2 bg-card rounded" />
        <div className="h-3 w-16 bg-card rounded" />
      </div>

      <div className="max-w-[680px] mx-auto mb-12">
        <div className="h-3 w-16 bg-card rounded mb-4" />
        <div className="h-8 bg-card rounded mb-3" />
        <div className="h-8 w-5/6 bg-card rounded mb-3" />
        <div className="h-8 w-2/3 bg-card rounded mb-6" />
        <div className="h-3 w-28 bg-card rounded" />
      </div>

      <div className="max-w-[680px] mx-auto">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
          <div className="w-2 h-2 rounded-full bg-card shrink-0" />
          <div className="h-3 w-32 bg-card rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-card rounded" style={{ width: i % 4 === 3 ? "65%" : "100%" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
