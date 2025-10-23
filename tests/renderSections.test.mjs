import test from 'node:test';
import assert from 'node:assert/strict';

import { renderSections, textToParagraphs } from '../docs/assets/renderSections.js';

class MockElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.textContent = '';
    this.id = '';
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  get innerHTML() {
    return this.children
      .map((child) => child.textContent)
      .join('');
  }

  set innerHTML(_) {
    this.children = [];
  }

  querySelectorAll(tagName) {
    const matches = [];
    const searchTag = tagName.toUpperCase();

    const traverse = (element) => {
      element.children.forEach((child) => {
        if (child.tagName === searchTag) {
          matches.push(child);
        }

        traverse(child);
      });
    };

    traverse(this);
    return matches;
  }

  querySelector(tagName) {
    return this.querySelectorAll(tagName)[0] ?? null;
  }
}

class MockDocument {
  createElement(tagName) {
    return new MockElement(tagName, this);
  }
}

test('textToParagraphs remove espaços extras e linhas vazias', () => {
  const rawText = 'Primeiro parágrafo.\n\n Segundo parágrafo com espaço.\n\n\n';
  const paragraphs = textToParagraphs(rawText);

  assert.deepStrictEqual(paragraphs, [
    'Primeiro parágrafo.',
    'Segundo parágrafo com espaço.',
  ]);
});

test('renderSections cria seções com títulos e parágrafos', () => {
  const mockDocument = new MockDocument();
  const container = new MockElement('main', mockDocument);

  const sectionsData = [
    {
      id: 'introducao',
      title: 'Introdução',
      paragraphs: ['Parágrafo 1', 'Parágrafo 2'],
    },
  ];

  renderSections(container, sectionsData);

  const renderedSections = container.querySelectorAll('section');
  assert.strictEqual(renderedSections.length, 1);

  const [section] = renderedSections;
  assert.strictEqual(section.id, 'introducao');
  assert.strictEqual(section.querySelector('h2').textContent, 'Introdução');

  const renderedParagraphs = section
    .querySelectorAll('p')
    .map((element) => element.textContent);
  assert.deepStrictEqual(renderedParagraphs, ['Parágrafo 1', 'Parágrafo 2']);
});
