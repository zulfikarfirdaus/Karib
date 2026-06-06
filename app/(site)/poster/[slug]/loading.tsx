export default function PosterDetailLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-32 pb-12 animate-pulse">
      <div className="aspect-square bg-card rounded-2xl mb-8" />
      <div className="h-4 w-1/3 bg-card rounded mb-3" />
      <div className="h-6 w-full bg-card rounded mb-2" />
      <div className="h-6 w-4/5 bg-card rounded" />
    </div>
  );
}
