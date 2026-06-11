import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { KanbanCard } from './KanbanCard'
import { KanbanColumn } from './KanbanColumn'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ActionModal from '../common/ActionModal'
import { api } from '../../lib/api'
import { formatDistanceToNow } from 'date-fns'

const createDealSchema = z.object({
  title: z.string().trim().min(2, 'Title required'),
  value: z.coerce.number().min(0).default(0),
  clientId: z.string().min(1, 'Client required'),
  stageId: z.string().min(1, 'Stage required'),
})

function DealsPage() {
  const [isNewDealOpen, setIsNewDealOpen] = useState(false)
  const queryClient = useQueryClient()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const { data, isLoading } = useQuery({
    queryKey: ['dealsData'],
    queryFn: async () => {
      const [stagesRes, dealsRes, clientsRes] = await Promise.all([
        api.get('/deals/stages'),
        api.get('/deals?page=1&pageSize=100'),
        api.get('/clients?page=1&pageSize=100')
      ])
      return {
        pipelineStages: stagesRes.stages || [],
        deals: dealsRes.items || [],
        clients: clientsRes.items || []
      }
    }
  })

  const { pipelineStages = [], deals = [], clients = [] } = data || {}

  const addDealMutation = useMutation({
    mutationFn: (newDeal) => api.post('/deals', newDeal),
    onSuccess: () => {
      setIsNewDealOpen(false)
      reset()
      queryClient.invalidateQueries({ queryKey: ['dealsData'] })
    },
    onError: (err) => {
      console.error('Failed to add deal:', err)
      alert(err.message || 'Failed to add deal')
    }
  })

  const moveDealMutation = useMutation({
    mutationFn: ({ dealId, stageId }) => api.patch(`/deals/${dealId}/stage`, { stageId }),
    onMutate: async ({ dealId, stageId }) => {
      await queryClient.cancelQueries({ queryKey: ['dealsData'] })
      const previousData = queryClient.getQueryData(['dealsData'])
      
      if (previousData) {
        queryClient.setQueryData(['dealsData'], {
          ...previousData,
          deals: previousData.deals.map(d => d.id === dealId ? { ...d, stageId } : d)
        })
      }
      return { previousData }
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['dealsData'], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dealsData'] })
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createDealSchema),
    defaultValues: { title: '', value: 0, clientId: '', stageId: '' }
  })

  const onAddDeal = (data) => {
    addDealMutation.mutate(data)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id) {
      const dealId = active.id;
      const stageId = over.id;
      
      const deal = deals.find(d => d.id === dealId)
      if (deal && deal.stageId !== stageId) {
        moveDealMutation.mutate({ dealId, stageId })
      }
    }
  }

  const { stages, summary } = useMemo(() => {
    let totalValue = 0
    let openDeals = 0

    const grouped = pipelineStages.map(stage => {
      const stageDeals = deals.filter(d => d.stageId === stage.id)
      const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0)
      
      totalValue += stageValue
      if (stage.name !== 'Closed Won' && stage.name !== 'Closed Lost') {
        openDeals += stageDeals.length
      }

      return {
        id: stage.id,
        name: stage.name,
        value: `$${(stageValue / 1000).toFixed(1)}k`,
        deals: stageDeals
      }
    })

    return {
      stages: grouped,
      summary: [
        { label: 'Open deals', value: openDeals.toString() },
        { label: 'Pipeline value', value: `$${(totalValue / 1000).toFixed(1)}k` },
        { label: 'Avg. close time', value: '18d' }, // Kept static for now
      ]
    }
  }, [deals, pipelineStages])

  return (
    <main className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7">
      <div className="flex items-start justify-between gap-4 max-[520px]:flex-col">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
            Sales pipeline
          </p>
          <h1 className="mt-2 text-[29px] font-bold tracking-normal text-slate-900">Deals</h1>
        </div>
        <button
          className="rounded-md border-0 bg-blue-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
          type="button"
          onClick={() => setIsNewDealOpen(true)}
        >
          New deal
        </button>
      </div>

      <section
        className="mt-6 grid grid-cols-3 gap-3.5 max-[520px]:grid-cols-1"
        aria-label="Deal summary"
      >
        {summary.map((item) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4" key={item.label}>
            <p className="m-0 text-xs font-bold text-slate-500">{item.label}</p>
            <strong className="mt-3 block text-2xl text-slate-900">{item.value}</strong>
          </article>
        ))}
      </section>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <section
          className="mt-4 grid grid-cols-4 gap-3.5 overflow-x-auto pb-1 max-[520px]:grid-cols-1 max-[520px]:overflow-x-visible"
          aria-label="Deal pipeline board"
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <article className="min-h-[420px] min-w-60 rounded-lg border border-slate-200 bg-slate-50 animate-pulse" key={i}>
                <div className="border-b border-slate-200 p-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></div>
              </article>
            ))
          ) : stages.map((stage) => (
            <KanbanColumn key={stage.id} stage={stage}>
              {stage.deals.map((deal) => (
                <KanbanCard key={deal.id} deal={deal} />
              ))}
            </KanbanColumn>
          ))}
        </section>
      </DndContext>

      {isNewDealOpen && (
        <ActionModal
          title="New deal"
          description="Create a pipeline opportunity."
          primaryLabel="Create deal"
          onClose={() => setIsNewDealOpen(false)}
          onSubmit={handleSubmit(onAddDeal)}
          isSubmitting={addDealMutation.isPending}
        >
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Deal title</span>
            <input 
              className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.title ? "border-red-300" : "border-slate-200")} 
              placeholder="Expansion package" 
              {...register('title')}
            />
            {errors.title && <span className="text-[10px] text-red-600">{errors.title.message}</span>}
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Client</span>
            <select 
              className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.clientId ? "border-red-300" : "border-slate-200")}
              {...register('clientId')}
            >
              <option value="">Select a client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.clientId && <span className="text-[10px] text-red-600">{errors.clientId.message}</span>}
          </label>
          <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Value ($)</span>
              <input 
                type="number"
                className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.value ? "border-red-300" : "border-slate-200")} 
                placeholder="12000" 
                {...register('value')}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Stage</span>
              <select 
                className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.stageId ? "border-red-300" : "border-slate-200")}
                {...register('stageId')}
              >
                <option value="">Select stage...</option>
                {pipelineStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
          </div>
        </ActionModal>
      )}
    </main>
  )
}

export default DealsPage
