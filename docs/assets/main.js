import { renderSections, textToParagraphs } from './renderSections.js';

// Configuração centralizada das seções para facilitar manutenção e adição de novos arquivos.
// Os arquivos listados aqui precisam refletir exatamente os nomes existentes em ./data
// para evitarmos erros de carregamento (404) na aplicação estática.
const SECTION_CONFIG = [
  {
    id: 'coaf-obrigacoes',
    title: 'Obrigações de Comunicação ao COAF',
    file: './data/coaf_obrigacoes.txt',
  },
  {
    id: 'compliance-bancario',
    title: 'Programa de Compliance Bancário',
    file: './data/compliance_bancario.txt',
  },
  {
    id: 'concessao-credito',
    title: 'Boas Práticas na Concessão de Crédito',
    file: './data/concessao_credito_responsavel.txt',
  },
  {
    id: 'etica-servico-publico',
    title: 'Ética no Serviço Público para Instituições Financeiras Estatais',
    file: './data/etica_servico_publico.txt',
  },
  {
    id: 'prevencao-lavagem-dinheiro',
    title: 'Prevenção à Lavagem de Dinheiro e ao Financiamento do Terrorismo',
    file: './data/prevencao_lavagem_dinheiro.txt',
  },
  {
    id: 'regras-mercado-financeiro',
    title: 'Regras do Mercado Financeiro e de Capitais para Compliance',
    file: './data/regras_mercado_financeiro.txt',
  },
];

/**
 * Busca o conteúdo de cada arquivo de texto e monta o objeto esperado pelo renderizador.
 * Comentário extenso para deixar claro o fluxo ao leitor humano.
 */
async function loadSections() {
  const container = document.getElementById('sections-container');
  const feedbackMessage = document.getElementById('loading-message');

  if (!container) {
    throw new Error('Elemento com id "sections-container" não encontrado.');
  }

  try {
    const sections = await Promise.all(
      SECTION_CONFIG.map(async ({ id, title, file }) => {
        const response = await fetch(file);

        if (!response.ok) {
          throw new Error(`Não foi possível carregar o arquivo: ${file}`);
        }

        const rawText = await response.text();
        const paragraphs = textToParagraphs(rawText);

        return { id, title, paragraphs };
      })
    );

    renderSections(container, sections);

    if (feedbackMessage) {
      feedbackMessage.remove();
    }
  } catch (error) {
    console.error(error);

    if (feedbackMessage) {
      feedbackMessage.textContent = 'Erro ao carregar o conteúdo. Atualize a página e tente novamente.';
      feedbackMessage.classList.add('feedback');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSections();
});
