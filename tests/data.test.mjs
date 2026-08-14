import assert from "node:assert/strict";
import { BOOKS, DAILY_VERSES, getBook, normalizeText } from "../assets/bible-data.js";

assert.equal(BOOKS.length, 66, "A lista deve conter os 66 livros");
assert.equal(
  BOOKS.reduce(function (total, book) { return total + book.chapters; }, 0),
  1189,
  "A lista deve conter os 1.189 capítulos"
);
assert.equal(new Set(BOOKS.map(function (book) { return book.id; })).size, 66, "IDs de livros devem ser únicos");
assert.equal(getBook("JHN").name, "João");
assert.equal(normalizeText("João"), "joao");

DAILY_VERSES.forEach(function (dailyVerse) {
  var book = getBook(dailyVerse.bookId);
  assert.ok(book, "Livro ausente na palavra do dia " + dailyVerse.id);
  assert.ok(dailyVerse.chapter >= 1 && dailyVerse.chapter <= book.chapters, "Capítulo inválido em " + dailyVerse.id);
  assert.ok(dailyVerse.verse >= 1, "Versículo inválido em " + dailyVerse.id);
});

console.log("Dados bíblicos validados: 66 livros, 1.189 capítulos e " + DAILY_VERSES.length + " palavras diárias.");
