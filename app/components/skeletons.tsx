export function StatisticsSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-52">
      <div className="skeleton h-32 w-full"></div>
      <div className="skeleton h-32 w-32"></div>
      <div className="skeleton h-32 w-32"></div>
      <div className="skeleton h-32 w-32"></div>
    </div>
  );
}

export function ReservationTableSkeleton() {
  return (
    <div className="relative overflow-x-auto max-h-[680px] p-5 bg-neutral-content">
      <div className="skeleton h-32 w-full"></div>
    </div>
  );
}
