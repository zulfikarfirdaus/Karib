export default function TanyaJawabLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-12 animate-pulse">
      <div className="mb-10">
        <div className="h-3 w-24 bg-card rounded mb-3" />
        <div className="h-9 w-44 bg-card rounded" />
      </div>
      <div className="space-y-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="pb-8 border-b border-border">
            <div className="h-3 w-16 bg-card rounded mb-3" />
            <div className="h-6 bg-card rounded mb-2" />
            <div className="h-6 w-3/4 bg-card rounded mb-4" />
            <div className="h-4 bg-card rounded mb-2" />
            <div className="h-4 w-5/6 bg-card rounded mb-4" />
            <div className="h-3 w-24 bg-card rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
