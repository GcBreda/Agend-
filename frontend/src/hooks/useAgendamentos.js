// frontend/src/hooks/useAgendamentos.js
// Custom hooks para agendamentos usando React Query
import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agendamentoService } from '../services/api'

// ── Lista todos os agendamentos do usuário logado ────────────
export function useAgendamentos() {
  return useQuery({
    queryKey: ['agendamentos'],
    queryFn:  async () => {
      const { data } = await agendamentoService.listar()
      return data.agendamentos
    }
  })
}

// ── Horários disponíveis para um profissional em uma data ────
export function useHorariosDisponiveis(profissionalId, data) {
  return useQuery({
    queryKey: ['horarios', profissionalId, data],
    queryFn:  async () => {
      const { data: res } = await agendamentoService.disponiveis({ profissionalId, data })
      return res.horarios
    },
    enabled: !!profissionalId && !!data // só busca quando ambos estiverem preenchidos
  })
}

// ── Cria um novo agendamento ─────────────────────────────────
export function useCriarAgendamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dados) => agendamentoService.criar(dados),
    onSuccess: () => {
      // Invalida o cache para forçar re-fetch
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
      queryClient.invalidateQueries({ queryKey: ['horarios'] })
    }
  })
}

// ── Cancela um agendamento ───────────────────────────────────
export function useCancelarAgendamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => agendamentoService.cancelar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
    }
  })
}
