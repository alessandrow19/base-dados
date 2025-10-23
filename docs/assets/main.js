import { renderSections, textToParagraphs } from './renderSections.js';

// Configuração centralizada das seções para facilitar manutenção e adição de novos arquivos.
const SECTION_CONFIG = [
  { id: 'introducao', title: 'Introdução', file: './data/introducao.txt' },
  { id: 'dados', title: 'Dados', file: './data/dados.txt' },
  { id: 'conclusao', title: 'Conclusão', file: './data/conclusao.txt' },
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
