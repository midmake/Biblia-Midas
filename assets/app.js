import { BOOKS, DAILY_VERSES, formatReference, getBook, normalizeText } from "./bible-data.js";

var API_BASE = "https://bible-api.com/";
var STORAGE = {
  favorites: "midas.biblia.favorites.v1",
  notes: "midas.biblia.notes.v1",
  reading: "midas.biblia.last-reading.v1",
  preferences: "midas.biblia.preferences.v1",
  chapterIndex: "midas.biblia.chapter-index.v1",
  chapterPrefix: "midas.biblia.chapter."
};

var app = document.querySelector("#app");
var verseSheet = document.querySelector("#verse-sheet");
var settingsSheet = document.querySelector("#settings-sheet");
var launchesSheet = document.querySelector("#launches-sheet");
var toastElement = document.querySelector("#toast");
var state = {
  selectedVerse: null,
  testament: "AT",
  bookFilter: "",
  savedTab: "favorites",
  currentDailyWord: null,
  renderToken: 0
};

var fontLevels = [
  { value: "1rem", label: "Pequeno" },
  { value: "1.14rem", label: "Normal" },
  { value: "1.3rem", label: "Grande" }
];

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function loadValue(key, fallback) {
  return safeParse(localStorage.getItem(key), fallback);
}

function saveValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    showToast("O navegador não permitiu salvar neste aparelho");
  }
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanVerseText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function keyForVerse(verse) {
  return [verse.bookId, verse.chapter, verse.verse].join(":");
}

function getFavorites() {
  return loadValue(STORAGE.favorites, []);
}

function getNotes() {
  return loadValue(STORAGE.notes, {});
}

function isFavorite(verse) {
  var key = keyForVerse(verse);
  return getFavorites().some(function (item) {
    return keyForVerse(item) === key;
  });
}

function getPreferences() {
  return Object.assign({ theme: "light", fontLevel: 1 }, loadValue(STORAGE.preferences, {}));
}

function applyPreferences() {
  var preferences = getPreferences();
  var level = Math.max(0, Math.min(fontLevels.length - 1, Number(preferences.fontLevel) || 0));
  document.documentElement.dataset.theme = preferences.theme === "dark" ? "dark" : "light";
  document.documentElement.style.setProperty("--reader-size", fontLevels[level].value);
  document.querySelector('meta[name="theme-color"]').content = preferences.theme === "dark" ? "#101b18" : "#fbf8f1";
  document.querySelector("#theme-toggle").checked = preferences.theme === "dark";
  document.querySelector("#font-size-output").textContent = fontLevels[level].label;
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(function () {
    toastElement.classList.remove("visible");
  }, 2400);
}

function navigate(route) {
  if (location.hash === route) {
    renderRoute();
    return;
  }
  location.hash = route.replace(/^#/, "");
}

function routeParts() {
  var hash = location.hash || "#/inicio";
  return hash.replace(/^#\/?/, "").split("/").map(function (part) {
    return decodeURIComponent(part);
  });
}

function activeNavigation(route) {
  var active = route;
  if (route === "livro" || route === "leitura") active = "biblia";
  if (route === "palavra-do-dia") active = "inicio";
  document.querySelectorAll("[data-nav]").forEach(function (button) {
    button.classList.toggle("active", button.dataset.nav === active);
  });
}

function closeDialog(dialog) {
  if (dialog && dialog.open) dialog.close();
}

function openDialog(dialog) {
  if (dialog.open) return;
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function footerMarkup() {
  return [
    '<footer class="app-footer">',
    "Uma experiência MIDAS · Transformando momentos em ouro.<br />",
    '<button type="button" data-action="open-launches">Veja nossos lançamentos</button>',
    "</footer>"
  ].join("");
}

function formatToday() {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  }).format(new Date());
}

function getLastReading() {
  return loadValue(STORAGE.reading, { bookId: "JHN", chapter: 1, verse: null });
}

function saveLastReading(bookId, chapter, verse) {
  saveValue(STORAGE.reading, {
    bookId: bookId,
    chapter: Number(chapter),
    verse: verse ? Number(verse) : null,
    updatedAt: new Date().toISOString()
  });
}

function dailyIndex(length, salt) {
  var now = new Date();
  var seed = Number(
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0")
  );
  return Math.abs(seed + (salt || 0)) % length;
}

function getDailyWord() {
  var daily = DAILY_VERSES[dailyIndex(DAILY_VERSES.length)];
  return Object.assign({}, daily, {
    reference: formatReference(daily.bookId, daily.chapter, daily.verse)
  });
}

function homeMarkup() {
  var last = getLastReading();
  var lastBook = getBook(last.bookId) || getBook("JHN");
  var daily = getDailyWord();

  return [
    '<section class="page home-page">',
    '<div class="hero">',
    '<div class="hero-date">' + escapeHtml(formatToday()) + "</div>",
    '<p class="hero-label">Palavra do dia</p>',
    "<h1>" + escapeHtml(daily.title) + "</h1>",
    '<blockquote class="hero-verse">“' + escapeHtml(daily.text) + '”</blockquote>',
    '<cite class="hero-reference">' + escapeHtml(daily.reference) + "</cite>",
    '<button class="button primary" type="button" data-route="#/palavra-do-dia">Abrir palavra do dia</button>',
    "</div>",
    '<section class="section" aria-labelledby="continue-title">',
    '<div class="section-header"><h2 id="continue-title">Continue de onde parou</h2></div>',
    '<button class="continue-card" type="button" data-route="#/leitura/' + lastBook.id + "/" + last.chapter + '">',
    '<span class="book-miniature">' + escapeHtml(lastBook.short) + "</span>",
    "<span><strong>" + escapeHtml(lastBook.name) + " " + last.chapter + "</strong>",
    "<small>Sua última leitura</small></span>",
    '<span class="arrow" aria-hidden="true">›</span>',
    "</button>",
    "</section>",
    '<section class="section" aria-labelledby="explore-title">',
    '<div class="section-header"><h2 id="explore-title">Para este momento</h2></div>',
    '<div class="quick-grid">',
    '<button class="quick-card featured" type="button" data-route="#/palavra-do-dia">',
    '<span class="card-icon" aria-hidden="true">☀</span><strong>Palavra do dia</strong><small>' + escapeHtml(formatToday()) + "</small>",
    "</button>",
    '<button class="quick-card" type="button" data-route="#/biblia">',
    '<span class="card-icon" aria-hidden="true">✝</span><strong>Bíblia Sagrada</strong><small>Escolha um livro e capítulo</small>',
    "</button>",
    '<button class="quick-card" type="button" data-route="#/buscar">',
    '<span class="card-icon" aria-hidden="true">⌕</span><strong>Encontrar passagem</strong><small>Busque por livro e versículo</small>',
    "</button>",
    '<button class="quick-card" type="button" data-route="#/salvos">',
    '<span class="card-icon" aria-hidden="true">♡</span><strong>Meus salvos</strong><small>Favoritos e anotações</small>',
    "</button>",
    "</div>",
    "</section>",
    footerMarkup(),
    "</section>"
  ].join("");
}

function booksMarkup() {
  var normalizedFilter = normalizeText(state.bookFilter);
  var books = BOOKS.filter(function (book) {
    var matchesTestament = book.testament === state.testament;
    var matchesFilter =
      !normalizedFilter ||
      normalizeText(book.name).includes(normalizedFilter) ||
      normalizeText(book.short).includes(normalizedFilter);
    return matchesTestament && matchesFilter;
  });

  return [
    '<section class="page books-page">',
    '<header class="page-heading"><p class="eyebrow">66 livros · 1.189 capítulos</p><h1>Escolha um livro</h1><p>Antigo e Novo Testamento em uma leitura simples.</p></header>',
    '<label class="search-field">',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>',
    '<span class="sr-only"></span>',
    '<input id="book-filter" type="search" autocomplete="off" placeholder="Buscar um livro" value="' + escapeHtml(state.bookFilter) + '" />',
    "</label>",
    '<div class="tabs" role="tablist" aria-label="Testamento">',
    '<button type="button" role="tab" data-action="testament" data-value="AT" class="' + (state.testament === "AT" ? "active" : "") + '">Antigo Testamento</button>',
    '<button type="button" role="tab" data-action="testament" data-value="NT" class="' + (state.testament === "NT" ? "active" : "") + '">Novo Testamento</button>',
    "</div>",
    '<div class="books-list">',
    books.map(function (book) {
      return [
        '<button class="book-button" type="button" data-route="#/livro/' + book.id + '">',
        '<span class="book-abbr">' + escapeHtml(book.short) + "</span>",
        "<span><strong>" + escapeHtml(book.name) + "</strong><small>" + book.chapters + (book.chapters === 1 ? " capítulo" : " capítulos") + "</small></span>",
        "</button>"
      ].join("");
    }).join(""),
    "</div>",
    books.length ? "" : '<div class="empty-state"><div class="state-icon">⌕</div><h2>Nenhum livro encontrado</h2><p>Tente outro nome ou abreviação.</p></div>',
    footerMarkup(),
    "</section>"
  ].join("");
}

function bindBooksPage() {
  var filter = document.querySelector("#book-filter");
  if (!filter) return;
  filter.addEventListener("input", function (event) {
    state.bookFilter = event.target.value;
    var selection = event.target.selectionStart;
    app.innerHTML = booksMarkup();
    bindBooksPage();
    var next = document.querySelector("#book-filter");
    next.focus();
    next.setSelectionRange(selection, selection);
  });
}

function bookPickerMarkup(bookId) {
  var book = getBook(bookId);
  if (!book) return notFoundMarkup();
  var last = getLastReading();

  return [
    '<section class="page chapter-page">',
    '<header class="page-heading"><p class="eyebrow">' + (book.testament === "AT" ? "Antigo Testamento" : "Novo Testamento") + "</p>",
    "<h1>" + escapeHtml(book.name) + "</h1><p>Escolha um capítulo para começar a leitura.</p></header>",
    '<div class="chapter-grid">',
    Array.from({ length: book.chapters }, function (_, index) {
      var chapter = index + 1;
      var current = last.bookId === book.id && Number(last.chapter) === chapter;
      return '<button type="button" class="' + (current ? "current" : "") + '" data-route="#/leitura/' + book.id + "/" + chapter + '" aria-label="' + escapeHtml(book.name) + " capítulo " + chapter + '">' + chapter + "</button>";
    }).join(""),
    "</div>",
    footerMarkup(),
    "</section>"
  ].join("");
}

function chapterCacheKey(bookId, chapter) {
  return STORAGE.chapterPrefix + bookId + "." + chapter;
}

function readChapterCache(bookId, chapter) {
  return loadValue(chapterCacheKey(bookId, chapter), null);
}

function writeChapterCache(bookId, chapter, verses) {
  var index = loadValue(STORAGE.chapterIndex, []);
  var cacheKey = chapterCacheKey(bookId, chapter);
  try {
    saveValue(cacheKey, { verses: verses, storedAt: Date.now() });
    index = index.filter(function (item) { return item !== cacheKey; });
    index.push(cacheKey);
    while (index.length > 30) {
      localStorage.removeItem(index.shift());
    }
    saveValue(STORAGE.chapterIndex, index);
  } catch (error) {
    if (index.length) localStorage.removeItem(index[0]);
  }
}

async function fetchChapter(bookId, chapter, options) {
  var book = getBook(bookId);
  var cached = readChapterCache(bookId, chapter);
  if (!book) throw new Error("Livro não encontrado.");
  if (cached && cached.verses && !(options && options.refresh)) return cached.verses;

  var reference = encodeURIComponent(book.apiName + " " + chapter);
  var url = API_BASE + reference + "?translation=almeida&single_chapter_book_matching=indifferent";

  try {
    var response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("A passagem não pôde ser carregada.");
    var data = await response.json();
    if (!Array.isArray(data.verses) || !data.verses.length) throw new Error("A passagem veio vazia.");
    var verses = data.verses.map(function (item) {
      return {
        bookId: book.id,
        chapter: Number(item.chapter || chapter),
        verse: Number(item.verse),
        text: cleanVerseText(item.text),
        reference: formatReference(book.id, item.chapter || chapter, item.verse)
      };
    });
    writeChapterCache(book.id, chapter, verses);
    return verses;
  } catch (error) {
    if (cached && cached.verses) return cached.verses;
    throw error;
  }
}

function skeletonMarkup() {
  return [
    '<div class="skeleton" aria-label="Carregando capítulo">',
    Array.from({ length: 12 }, function () { return '<div class="skeleton-line"></div>'; }).join(""),
    "</div>"
  ].join("");
}

function getAdjacentChapter(bookId, chapter, direction) {
  var bookIndex = BOOKS.findIndex(function (book) { return book.id === bookId; });
  var book = BOOKS[bookIndex];
  var targetChapter = Number(chapter) + direction;
  if (targetChapter >= 1 && targetChapter <= book.chapters) {
    return { bookId: book.id, chapter: targetChapter };
  }
  var adjacentBook = BOOKS[bookIndex + direction];
  if (!adjacentBook) return null;
  return {
    bookId: adjacentBook.id,
    chapter: direction > 0 ? 1 : adjacentBook.chapters
  };
}

function readerShellMarkup(book, chapter) {
  var previous = getAdjacentChapter(book.id, chapter, -1);
  var next = getAdjacentChapter(book.id, chapter, 1);
  return [
    '<section class="page reader-page">',
    '<div class="chapter-picker">',
    '<button type="button" ' + (previous ? 'data-route="#/leitura/' + previous.bookId + "/" + previous.chapter + '"' : "disabled") + ' aria-label="Capítulo anterior">‹</button>',
    '<button class="chapter-title-button" type="button" data-route="#/livro/' + book.id + '"><strong>' + escapeHtml(book.name) + " " + chapter + '</strong><small>TOQUE PARA ESCOLHER O CAPÍTULO</small></button>',
    '<button type="button" ' + (next ? 'data-route="#/leitura/' + next.bookId + "/" + next.chapter + '"' : "disabled") + ' aria-label="Próximo capítulo">›</button>',
    "</div>",
    '<article class="reader" id="reader-content">' + skeletonMarkup() + "</article>",
    '<p class="reader-source">João Ferreira de Almeida · edição histórica em domínio público</p>',
    footerMarkup(),
    "</section>"
  ].join("");
}

function versesMarkup(verses, next) {
  var favorites = getFavorites();
  var notes = getNotes();
  return [
    verses.map(function (verse) {
      var key = keyForVerse(verse);
      var favorite = favorites.some(function (item) { return keyForVerse(item) === key; });
      var hasNote = Boolean(notes[key] && notes[key].note);
      return [
        '<button class="verse" id="verse-' + verse.verse + '" type="button" data-action="open-verse" data-verse="' + verse.verse + '">',
        '<span class="verse-number">' + verse.verse + "</span>",
        escapeHtml(verse.text),
        favorite ? '<span class="verse-mark" aria-label="Favorito">♥</span>' : "",
        hasNote ? '<span class="verse-mark" aria-label="Com anotação">✎</span>' : "",
        "</button>"
      ].join("");
    }).join(" "),
    '<div class="reader-end"><p>Você chegou ao fim deste capítulo.</p>',
    next
      ? '<button class="button secondary" type="button" data-route="#/leitura/' + next.bookId + "/" + next.chapter + '">Ler o próximo capítulo</button>'
      : '<button class="button secondary" type="button" data-route="#/inicio">Voltar ao início</button>',
    "</div>"
  ].join("");
}

async function renderReader(bookId, chapterValue, requestedVerse) {
  var book = getBook(bookId);
  var chapter = Number(chapterValue);
  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) {
    app.innerHTML = notFoundMarkup();
    return;
  }

  var renderToken = ++state.renderToken;
  app.innerHTML = readerShellMarkup(book, chapter);
  window.scrollTo({ top: 0, behavior: "auto" });

  try {
    var verses = await fetchChapter(book.id, chapter);
    if (renderToken !== state.renderToken) return;
    var reader = document.querySelector("#reader-content");
    var next = getAdjacentChapter(book.id, chapter, 1);
    reader.innerHTML = versesMarkup(verses, next);
    reader.dataset.bookId = book.id;
    reader.dataset.chapter = String(chapter);
    reader.verses = verses;
    saveLastReading(book.id, chapter, requestedVerse || null);

    if (requestedVerse) {
      requestAnimationFrame(function () {
        var target = document.querySelector("#verse-" + Number(requestedVerse));
        if (target) {
          target.classList.add("selected");
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }
  } catch (error) {
    if (renderToken !== state.renderToken) return;
    document.querySelector("#reader-content").innerHTML = [
      '<div class="error-card">',
      '<div class="state-icon" aria-hidden="true">↻</div>',
      "<h2>Não foi possível abrir o capítulo</h2>",
      "<p>Confira sua conexão e tente novamente. Os capítulos já visitados continuam disponíveis sem internet.</p>",
      '<button class="button secondary" type="button" data-action="retry-reader" data-book="' + book.id + '" data-chapter="' + chapter + '">Tentar novamente</button>',
      "</div>"
    ].join("");
  }
}

function searchMarkup() {
  return [
    '<section class="page search-page">',
    '<header class="page-heading"><p class="eyebrow">Encontre uma palavra</p><h1>O que você procura?</h1><p>Digite uma referência ou escolha uma leitura conhecida.</p></header>',
    '<form id="reference-search">',
    '<label class="search-field">',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>',
    '<input id="reference-input" type="search" autocomplete="off" enterkeyhint="search" placeholder="Ex.: João 3:16" aria-label="Referência bíblica" />',
    '<button class="search-submit" type="submit">Buscar</button>',
    "</label>",
    '<p class="search-helper">Você pode buscar “Salmos 23”, “João 3:16” ou apenas o nome de um livro.</p>',
    "</form>",
    '<div id="search-results" class="search-results"></div>',
    '<section class="section" id="topic-section"><div class="section-header"><h2>Leituras conhecidas</h2></div>',
    '<div class="topic-list">',
    '<button class="topic-card" type="button" data-route="#/leitura/PSA/23"><span class="topic-icon" aria-hidden="true">♙</span><span><strong>Salmo 23</strong><small>O Senhor é o meu pastor</small></span><span aria-hidden="true">›</span></button>',
    '<button class="topic-card" type="button" data-route="#/leitura/1CO/13"><span class="topic-icon" aria-hidden="true">♡</span><span><strong>1 Coríntios 13</strong><small>O caminho do amor</small></span><span aria-hidden="true">›</span></button>',
    '<button class="topic-card" type="button" data-route="#/leitura/MAT/5"><span class="topic-icon" aria-hidden="true">☀</span><span><strong>Mateus 5</strong><small>O Sermão do Monte</small></span><span aria-hidden="true">›</span></button>',
    '<button class="topic-card" type="button" data-route="#/leitura/JHN/3"><span class="topic-icon" aria-hidden="true">✝</span><span><strong>João 3</strong><small>O amor de Deus</small></span><span aria-hidden="true">›</span></button>',
    "</div></section>",
    footerMarkup(),
    "</section>"
  ].join("");
}

function findBookAtStart(input) {
  var normalized = normalizeText(input);
  var candidates = [];
  BOOKS.forEach(function (book) {
    book.aliases.concat([book.name, book.short]).forEach(function (alias) {
      candidates.push({ book: book, alias: normalizeText(alias) });
    });
  });
  candidates.sort(function (a, b) { return b.alias.length - a.alias.length; });
  return candidates.find(function (candidate) {
    return normalized === candidate.alias || normalized.startsWith(candidate.alias + " ");
  });
}

function parseReference(input) {
  var normalized = normalizeText(input);
  var match = findBookAtStart(input);
  if (!match) return null;
  var rest = normalized.slice(match.alias.length).trim();
  if (!rest) return { book: match.book, chapter: null, startVerse: null, endVerse: null };
  var numbers = rest.match(/^(\d{1,3})(?:[: ](\d{1,3})(?:-(\d{1,3}))?)?$/);
  if (!numbers) return null;
  return {
    book: match.book,
    chapter: Number(numbers[1]),
    startVerse: numbers[2] ? Number(numbers[2]) : null,
    endVerse: numbers[3] ? Number(numbers[3]) : numbers[2] ? Number(numbers[2]) : null
  };
}

function bindSearchPage() {
  var form = document.querySelector("#reference-search");
  if (!form) return;
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    var input = document.querySelector("#reference-input").value.trim();
    var results = document.querySelector("#search-results");
    if (!input) return;

    var parsed = parseReference(input);
    if (!parsed) {
      var normalizedInput = normalizeText(input);
      var matchingBooks = BOOKS.filter(function (book) {
        return normalizeText(book.name).includes(normalizedInput);
      }).slice(0, 6);
      results.innerHTML = matchingBooks.length
        ? matchingBooks.map(function (book) {
            return '<button class="result-card" type="button" data-route="#/livro/' + book.id + '"><strong>LIVRO</strong><p>' + escapeHtml(book.name) + " · " + book.chapters + " capítulos</p></button>";
          }).join("")
        : '<div class="empty-state"><div class="state-icon">⌕</div><h2>Não encontramos essa referência</h2><p>Tente escrever no formato “João 3:16”.</p></div>';
      return;
    }

    if (!parsed.chapter) {
      navigate("#/livro/" + parsed.book.id);
      return;
    }
    if (parsed.chapter < 1 || parsed.chapter > parsed.book.chapters) {
      results.innerHTML = '<div class="empty-state"><div class="state-icon">!</div><h2>Capítulo inexistente</h2><p>' + escapeHtml(parsed.book.name) + " possui " + parsed.book.chapters + " capítulos.</p></div>";
      return;
    }
    if (!parsed.startVerse) {
      navigate("#/leitura/" + parsed.book.id + "/" + parsed.chapter);
      return;
    }

    results.innerHTML = skeletonMarkup();
    try {
      var verses = await fetchChapter(parsed.book.id, parsed.chapter);
      var selected = verses.filter(function (verse) {
        return verse.verse >= parsed.startVerse && verse.verse <= parsed.endVerse;
      });
      if (!selected.length) throw new Error("Versículo inexistente.");
      results.innerHTML = selected.map(function (verse) {
        return '<button class="result-card" type="button" data-action="search-verse" data-book="' + verse.bookId + '" data-chapter="' + verse.chapter + '" data-verse="' + verse.verse + '"><strong>' + escapeHtml(verse.reference) + "</strong><p>" + escapeHtml(verse.text) + "</p></button>";
      }).join("");
      results.verses = selected;
    } catch (error) {
      results.innerHTML = '<div class="error-card"><div class="state-icon">↻</div><h2>Não foi possível buscar</h2><p>Confira a referência e sua conexão.</p></div>';
    }
  });
}

function dailyWordMarkup() {
  var daily = getDailyWord();
  state.currentDailyWord = daily;
  return [
    '<section class="page daily-page">',
    '<header class="page-heading"><p class="eyebrow">Palavra do dia</p><h1>' + escapeHtml(formatToday()) + "</h1><p>Uma mensagem bíblica escolhida para acompanhar o seu dia.</p></header>",
    '<article class="daily-stage">',
    '<div class="daily-symbol" aria-hidden="true">☀</div>',
    '<div class="daily-date">' + escapeHtml(formatToday()) + "</div>",
    "<h1>" + escapeHtml(daily.title) + "</h1>",
    "<blockquote>“" + escapeHtml(daily.text) + "”</blockquote>",
    "<cite>" + escapeHtml(daily.reference) + "</cite>",
    "</article>",
    '<div class="daily-actions">',
    '<button type="button" data-route="#/leitura/' + daily.bookId + "/" + daily.chapter + "/" + daily.verse + '">Ler capítulo completo</button>',
    '<button type="button" data-action="share-daily">Compartilhar</button>',
    "</div>",
    '<p class="reader-source">A palavra muda automaticamente a cada novo dia.</p>',
    footerMarkup(),
    "</section>"
  ].join("");
}

function savedMarkup() {
  var favorites = getFavorites();
  var notes = getNotes();
  var noteItems = Object.keys(notes).map(function (key) { return notes[key]; }).filter(function (item) {
    return item && item.note;
  });
  var items = state.savedTab === "favorites" ? favorites : noteItems;

  return [
    '<section class="page saved-page">',
    '<header class="page-heading"><p class="eyebrow">Sua caminhada</p><h1>Meus salvos</h1><p>Versículos e reflexões guardados somente neste aparelho.</p></header>',
    '<div class="tabs saved-tabs" role="tablist">',
    '<button type="button" data-action="saved-tab" data-value="favorites" class="' + (state.savedTab === "favorites" ? "active" : "") + '">Favoritos (' + favorites.length + ")</button>",
    '<button type="button" data-action="saved-tab" data-value="notes" class="' + (state.savedTab === "notes" ? "active" : "") + '">Anotações (' + noteItems.length + ")</button>",
    "</div>",
    items.length
      ? '<div class="saved-list">' + items.map(function (item) {
          var key = keyForVerse(item);
          return [
            '<article class="saved-card">',
            '<div class="saved-card-header"><strong>' + escapeHtml(item.reference || formatReference(item.bookId, item.chapter, item.verse)) + "</strong>",
            '<button type="button" data-action="remove-saved" data-kind="' + state.savedTab + '" data-key="' + escapeHtml(key) + '" aria-label="Remover">×</button></div>',
            '<button class="result-card" type="button" data-route="#/leitura/' + item.bookId + "/" + item.chapter + "/" + item.verse + '"><p>' + escapeHtml(item.text) + "</p></button>",
            state.savedTab === "notes" ? '<div class="saved-note">' + escapeHtml(item.note) + "</div>" : "",
            "</article>"
          ].join("");
        }).join("") + "</div>"
      : [
          '<div class="empty-state"><div class="state-icon">' + (state.savedTab === "favorites" ? "♡" : "✎") + "</div>",
          "<h2>" + (state.savedTab === "favorites" ? "Nenhum favorito ainda" : "Nenhuma anotação ainda") + "</h2>",
          "<p>Durante a leitura, toque em um versículo para " + (state.savedTab === "favorites" ? "salvá-lo." : "escrever uma reflexão.") + "</p>",
          '<button class="button secondary" type="button" data-route="#/biblia">Abrir a Bíblia</button></div>'
        ].join(""),
    footerMarkup(),
    "</section>"
  ].join("");
}

function notFoundMarkup() {
  return [
    '<section class="page">',
    '<div class="empty-state"><div class="state-icon">?</div><h1>Página não encontrada</h1>',
    "<p>Esta passagem ou experiência não existe.</p>",
    '<button class="button primary" type="button" data-route="#/inicio">Voltar ao início</button></div>',
    "</section>"
  ].join("");
}

function renderRoute() {
  var parts = routeParts();
  var route = parts[0] || "inicio";
  state.renderToken += 1;
  activeNavigation(route);
  closeDialog(verseSheet);
  window.scrollTo({ top: 0, behavior: "auto" });

  if (route === "inicio") {
    app.innerHTML = homeMarkup();
  } else if (route === "biblia") {
    app.innerHTML = booksMarkup();
    bindBooksPage();
  } else if (route === "livro") {
    app.innerHTML = bookPickerMarkup(parts[1]);
  } else if (route === "leitura") {
    renderReader(parts[1], parts[2], parts[3]);
  } else if (route === "buscar") {
    app.innerHTML = searchMarkup();
    bindSearchPage();
  } else if (route === "salvos") {
    app.innerHTML = savedMarkup();
  } else if (route === "palavra-do-dia") {
    app.innerHTML = dailyWordMarkup();
  } else {
    app.innerHTML = notFoundMarkup();
  }
}

function findVerseInReader(verseNumber) {
  var reader = document.querySelector("#reader-content");
  if (!reader || !reader.verses) return null;
  return reader.verses.find(function (verse) {
    return verse.verse === Number(verseNumber);
  });
}

function openVerseSheet(verse) {
  state.selectedVerse = verse;
  document.querySelector("#sheet-reference").textContent = verse.reference;
  document.querySelector("#sheet-text").textContent = verse.text;
  document.querySelector("#note-form").hidden = true;
  document.querySelector("#favorite-action").classList.toggle("active", isFavorite(verse));
  document.querySelector("#favorite-action span:last-child").textContent = isFavorite(verse) ? "Salvo" : "Salvar";
  var note = getNotes()[keyForVerse(verse)];
  document.querySelector("#note-action").classList.toggle("active", Boolean(note && note.note));
  document.querySelector("#note-text").value = note && note.note ? note.note : "";
  openDialog(verseSheet);
}

function toggleFavorite(verse) {
  var key = keyForVerse(verse);
  var favorites = getFavorites();
  var existing = favorites.findIndex(function (item) { return keyForVerse(item) === key; });
  if (existing >= 0) {
    favorites.splice(existing, 1);
    showToast("Removido dos favoritos");
  } else {
    favorites.unshift(verse);
    showToast("Versículo salvo");
  }
  saveValue(STORAGE.favorites, favorites);
  openVerseSheet(verse);
}

function shareTextForVerse(verse) {
  return "“" + verse.text + "”\n\n" + verse.reference + "\nBíblia Sagrada — Midas";
}

function deepLinkForVerse(verse) {
  var base = location.origin + location.pathname.replace(/[^/]*$/, "");
  return base + "#/leitura/" + verse.bookId + "/" + verse.chapter + "/" + verse.verse;
}

async function shareVerse(verse) {
  var shareData = {
    title: verse.reference + " — Bíblia Sagrada",
    text: shareTextForVerse(verse),
    url: deepLinkForVerse(verse)
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
    }
  }
  await copyText(shareData.text + "\n" + shareData.url);
  showToast("Texto copiado para compartilhar");
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  var area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function removeSaved(kind, key) {
  if (kind === "favorites") {
    var favorites = getFavorites().filter(function (item) { return keyForVerse(item) !== key; });
    saveValue(STORAGE.favorites, favorites);
    showToast("Removido dos favoritos");
  } else {
    var notes = getNotes();
    delete notes[key];
    saveValue(STORAGE.notes, notes);
    showToast("Anotação removida");
  }
  app.innerHTML = savedMarkup();
}

function handleDocumentClick(event) {
  var routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    event.preventDefault();
    var parentDialog = routeButton.closest("dialog");
    if (parentDialog) closeDialog(parentDialog);
    navigate(routeButton.dataset.route);
    return;
  }

  var closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) {
    closeDialog(closeButton.closest("dialog"));
    return;
  }

  var actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  var action = actionButton.dataset.action;

  if (action === "testament") {
    state.testament = actionButton.dataset.value;
    app.innerHTML = booksMarkup();
    bindBooksPage();
  }

  if (action === "open-verse") {
    var verse = findVerseInReader(actionButton.dataset.verse);
    if (verse) openVerseSheet(verse);
  }

  if (action === "search-verse") {
    var results = document.querySelector("#search-results");
    var resultVerse = results && results.verses
      ? results.verses.find(function (item) { return item.verse === Number(actionButton.dataset.verse); })
      : null;
    if (resultVerse) openVerseSheet(resultVerse);
  }

  if (action === "retry-reader") {
    renderReader(actionButton.dataset.book, actionButton.dataset.chapter);
  }

  if (action === "share-daily") {
    if (state.currentDailyWord) shareVerse(state.currentDailyWord);
  }

  if (action === "saved-tab") {
    state.savedTab = actionButton.dataset.value;
    app.innerHTML = savedMarkup();
  }

  if (action === "remove-saved") {
    removeSaved(actionButton.dataset.kind, actionButton.dataset.key);
  }

  if (action === "open-launches") {
    openDialog(launchesSheet);
  }
}

document.addEventListener("click", handleDocumentClick);

document.querySelector("#settings-button").addEventListener("click", function () {
  applyPreferences();
  openDialog(settingsSheet);
});

document.querySelector("#favorite-action").addEventListener("click", function () {
  if (state.selectedVerse) toggleFavorite(state.selectedVerse);
});

document.querySelector("#note-action").addEventListener("click", function () {
  var form = document.querySelector("#note-form");
  form.hidden = !form.hidden;
  if (!form.hidden) document.querySelector("#note-text").focus();
});

document.querySelector("#cancel-note").addEventListener("click", function () {
  document.querySelector("#note-form").hidden = true;
});

document.querySelector("#note-form").addEventListener("submit", function (event) {
  event.preventDefault();
  if (!state.selectedVerse) return;
  var value = document.querySelector("#note-text").value.trim();
  var notes = getNotes();
  var key = keyForVerse(state.selectedVerse);
  if (value) {
    notes[key] = Object.assign({}, state.selectedVerse, { note: value, updatedAt: new Date().toISOString() });
    showToast("Anotação salva");
  } else {
    delete notes[key];
    showToast("Anotação removida");
  }
  saveValue(STORAGE.notes, notes);
  document.querySelector("#note-form").hidden = true;
  document.querySelector("#note-action").classList.toggle("active", Boolean(value));
});

document.querySelector("#share-action").addEventListener("click", function () {
  if (state.selectedVerse) shareVerse(state.selectedVerse);
});

document.querySelector("#copy-action").addEventListener("click", async function () {
  if (!state.selectedVerse) return;
  await copyText(shareTextForVerse(state.selectedVerse));
  showToast("Versículo copiado");
});

document.querySelectorAll("[data-font-size]").forEach(function (button) {
  button.addEventListener("click", function () {
    var preferences = getPreferences();
    preferences.fontLevel = Math.max(
      0,
      Math.min(fontLevels.length - 1, Number(preferences.fontLevel) + Number(button.dataset.fontSize))
    );
    saveValue(STORAGE.preferences, preferences);
    applyPreferences();
  });
});

document.querySelector("#theme-toggle").addEventListener("change", function (event) {
  var preferences = getPreferences();
  preferences.theme = event.target.checked ? "dark" : "light";
  saveValue(STORAGE.preferences, preferences);
  applyPreferences();
});

function updateConnectionStatus() {
  var pill = document.querySelector("#connection-pill");
  pill.hidden = navigator.onLine;
}

window.addEventListener("online", function () {
  updateConnectionStatus();
  showToast("Conexão restabelecida");
});
window.addEventListener("offline", updateConnectionStatus);
window.addEventListener("hashchange", renderRoute);

document.querySelectorAll("dialog").forEach(function (dialog) {
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) closeDialog(dialog);
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js").catch(function () {
      // A leitura principal continua disponível mesmo se o cache não for registrado.
    });
  });
}

applyPreferences();
updateConnectionStatus();
if (!location.hash) {
  history.replaceState(null, "", "#/inicio");
}
renderRoute();
