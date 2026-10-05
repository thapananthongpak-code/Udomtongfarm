/** A quiet placeholder shown while the collection is being read. */
export default function PageLoading() {
  return (
    <div className="shell animate-pulse py-20" aria-busy="true">
      <div className="h-3 w-28 bg-wall" />
      <div className="mt-6 h-12 max-w-xl bg-wall" />
      <div className="mt-4 h-12 max-w-md bg-wall" />
      <div className="mt-10 h-4 max-w-lg bg-wall" />
      <div className="mt-3 h-4 max-w-sm bg-wall" />
    </div>
  );
}
