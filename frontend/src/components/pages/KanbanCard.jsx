import { useDraggable } from '@dnd-kit/core';

export function KanbanCard({ deal }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { dealId: deal.id }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  } : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-slate-300 transition-colors" 
    >
      <div className="flex items-start justify-between gap-2.5">
        <h3 className="m-0 text-[13px] font-bold leading-snug text-slate-700">
          {deal.title}
        </h3>
        <span className="whitespace-nowrap text-xs font-bold text-blue-700">
          ${(deal.value / 1000).toFixed(1)}k
        </span>
      </div>
      <p className="mt-2 text-[11px] font-bold text-slate-500">{deal.client?.name}</p>
      <div className="mt-4 flex items-center justify-between gap-2.5 text-[10px] font-bold text-slate-400">
        <span>{deal.owner?.name}</span>
        <time className="whitespace-nowrap">Close {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'}</time>
      </div>
    </article>
  );
}
