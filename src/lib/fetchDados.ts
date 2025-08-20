// src/lib/fetchDados.ts

/**
 * Busca o JSON atualizado no backend.
 * Sempre tenta primeiro /data/dados-atualizados.json
 */
export async function fetchDadosSeguro() {
  const urls = [
    '/data/dados-atualizados.json',
    (import.meta as any)?.env?.BASE_URL
      ? String((import.meta as any).env.BASE_URL).replace(/\/?$/, '/') +
        'data/dados-atualizados.json'
      : '/data/dados-atualizados.json',
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      // ignora e tenta a próxima URL
    }
  }
  return null;
}

/**
 * Garante que sempre exista a chave medicos_dentistas
 */
export function normalizarDados(raw: any) {
  if (!raw) return null;
  if (raw.medicos_dentistas) return raw;

  const profs = Array.isArray(raw.profissoes) ? raw.profissoes : [];

  const med =
    profs.find(
      (p: any) =>
        String(p?.nome).toLowerCase().startsWith('médico') ||
        String(p?.nome).toLowerCase().startsWith('medico')
    ) || {};

  const den =
    profs.find((p: any) => String(p?.nome).toLowerCase().startsWith('dent')) || {};

  return {
    ...raw,
    medicos_dentistas: {
      medicos: med,
      dentistas: den,
      total: (med.vendas || 0) + (den.vendas || 0),
    },
  };
}
