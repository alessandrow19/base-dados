/**
 * Converte texto simples em um arranjo de parágrafos limpos.
 * Mantemos essa função exportada para facilitar a testagem unitária.
 *
 * @param {string} rawText Texto puro lido do arquivo.
 * @returns {string[]} Lista de parágrafos sem espaços desnecessários.
 */
export function textToParagraphs(rawText) {
  return rawText
    .split(/\r?\n\s*\r?\n/g) // quebra por linhas em branco.
    .map((paragraph) => paragraph.trim())
    .map((paragraph) => paragraph.replace(/^#+\s*/, '')) // remove marcadores de título do markdown.
    .filter(Boolean); // remove parágrafos vazios.
}

/**
 * Renderiza dinamicamente as seções no contêiner informado.
 * A função aceita dados já estruturados para manter a lógica de DOM isolada.
 *
 * @param {HTMLElement} container Elemento que receberá as seções.
 * @param {Array<{id: string, title: string, paragraphs: string[]}>} sections Dados das seções.
 */
export function renderSections(container, sections) {
  if (!container) {
    throw new Error('Um contêiner válido é necessário para renderizar as seções.');
  }

  // Limpa qualquer conteúdo anterior para evitar duplicidade em recarregamentos.
  container.innerHTML = '';

  sections.forEach((sectionData) => {
    const sectionElement = container.ownerDocument.createElement('section');
    sectionElement.id = sectionData.id;

    const titleElement = container.ownerDocument.createElement('h2');
    titleElement.textContent = sectionData.title;
    sectionElement.appendChild(titleElement);

    sectionData.paragraphs.forEach((paragraphText) => {
      const paragraphElement = container.ownerDocument.createElement('p');
      paragraphElement.textContent = paragraphText;
      sectionElement.appendChild(paragraphElement);
    });

    container.appendChild(sectionElement);
  });
}
