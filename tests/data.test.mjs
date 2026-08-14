import assert from "node:assert/strict";
import { BOOKS, PROMISES, getBook, normalizeText } from "../assets/bible-data.js";

assert.equal(BOOKS.length, 66, "A lista deve conter os 66 livros");
assert.equal(
  BOOKS.reduce(function (total, book) { return total + book.chapters; }, 0),
  1189,
  "A lista deve conter os 1.189 capítulos"
);
assert.equal(new Set(BOOKS.map(function (book) { return book.id; })).size, 66, "IDs de livros devem ser únicos");
assert.equal(getBook("JHN").name, "João");
assert.equal(normalizeText("João"), "joao");

PROMISES.forEach(function (promise) {
  var book = getBook(promise.bookId);
  assert.ok(book, "Livro ausente na promessa " + promise.id);
  assert.ok(promise.chapter >= 1 && promise.chapter <= book.chapters, "Capítulo inválido em " + promise.id);
  assert.ok(promise.verse >= 1, "Versículo inválido em " + promise.id);
});

console.log("Dados bíblicos validados: 66 livros, 1.189 capítulos e " + PROMISES.length + " promessas.");
