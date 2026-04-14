import React from 'react';
import type { Demand, Priority, DemandStatus } from '../types';

export function formatPriority(priority: Priority): string {
  const map: Record<Priority, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta'
  };
  return map[priority];
}

export function formatStatus(status: DemandStatus): string {
  const map: Record<DemandStatus, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    concluida: 'Concluída'
  };
  return map[status];
}

export function buildDemandsReportMessage(demands: Demand[]): string {
  if (demands.length === 0) {
    return [
      '🙏 *AME | Relatório de Demandas da Missão*',
      '',
      'No momento não há demandas cadastradas para compartilhamento.'
    ].join('\n');
  }

  // Calcular estatísticas
  const total = demands.length;
  const pendentes = demands.filter(d => d.status === 'pendente').length;
  const emAndamento = demands.filter(d => d.status === 'em_andamento').length;
  const concluidas = demands.filter(d => d.status === 'concluida').length;

  // Cabeçalho
  const header = [
    '🙏 *AME | Relatório de Demandas da Missão*',
    '',
    `📋 *Total de demandas:* ${total}`,
    `🕓 *Pendentes:* ${pendentes}`,
    `🔄 *Em andamento:* ${emAndamento}`,
    `✅ *Concluídas:* ${concluidas}`,
    ''
  ].join('\n');

  // Lista de demandas
  const list = demands.map((demand, index) => {
    const name = demand.person?.name || 'Pessoa desconhecida';
    const point = demand.point?.name || 'Não informado';
    const date = new Date(demand.created_at).toLocaleDateString('pt-BR');

    return [
      `*${index + 1}. ${name}*`,
      `🧾 Necessidade: ${demand.description}`,
      `⚠️ Prioridade: ${formatPriority(demand.priority)}`,
      `📌 Status: ${formatStatus(demand.status)}`,
      `📍 Ponto: ${point}`,
      `📅 Data: ${date}`,
      ''
    ].join('\n');
  }).join('\n');

  // Rodapé
  const footer = '🤝 Caso possa ajudar em alguma dessas demandas, entre em contato com a equipe da missão.';

  return [header, list, footer].join('\n');
}

export async function shareDemandsReport(demands: Demand[]): Promise<void> {
  const message = buildDemandsReportMessage(demands);

  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share({
        title: 'AME | Relatório de Demandas da Missão',
        text: message
      });
      return;
    } catch (error) {
      // Se falhar no Web Share API, continua para o fallback do WhatsApp.
      console.error('Web Share API falhou:', error);
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

export const ShareDemandsReportButton: React.FC<{
  demands: Demand[];
  className?: string;
}> = ({ demands, className = '' }) => {
  const handleShare = async (): Promise<void> => {
    await shareDemandsReport(demands);
  };

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/20 transition hover:bg-[#1aa556] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 ${className}`}
      aria-label="Compartilhar relatório de demandas no WhatsApp"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.52 3.48A11.92 11.92 0 0 0 12 0C5.373 0 0 5.373 0 12a11.87 11.87 0 0 0 1.644 6.003L0 24l6.268-1.644A11.92 11.92 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.2-1.247-6.2-3.48-8.52Z"
          fill="#fff"
          opacity="0.2"
        />
        <path
          d="M17.472 14.382c-.297-.149-1.758-.866-2.03-.965-.273-.099-.472-.148-.672.149-.198.297-.768.965-.942 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.786-1.48-1.755-1.653-2.052-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.148-.672-1.617-.921-2.215-.242-.583-.487-.504-.672-.513l-.573-.01c-.198 0-.52.075-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.064 2.877 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.488 1.693.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.695.248-1.29.173-1.413-.075-.124-.273-.198-.571-.347Z"
          fill="#fff"
        />
      </svg>
      Compartilhar relatório
    </button>
  );
};