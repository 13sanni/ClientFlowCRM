import { useDroppable } from '@dnd-kit/core';

export function KanbanColumn({ stage, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: stage.id,
  });

  return (
    <article
      ref={setNodeRef}
      className={`min-h-[420px] min-w-60 rounded-lg border border-slate-200 transition-colors max-[520px]:min-h-0 ${isOver ? 'bg-slate-200/60 border-slate-300' : 'bg-slate-50'}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
        <div>
          <h2 className="m-0 text-sm font-bold text-slate-700">{stage.name}</h2>
          <span className="mt-1 block text-[10px] font-bold text-slate-400">
            {stage.deals.length} deals
          </span>
        </div>
        <strong className="text-xs text-slate-600">{stage.value}</strong>
      </div>
      <div className="grid gap-2.5 p-3">
        {children}
      </div>
    </article>
  );
}
