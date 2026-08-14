export const BOOKS = [
  { id: "GEN", name: "Gênesis", short: "Gn", apiName: "Genesis", chapters: 50, testament: "AT", aliases: ["genesis", "gen", "gn"] },
  { id: "EXO", name: "Êxodo", short: "Êx", apiName: "Exodus", chapters: 40, testament: "AT", aliases: ["exodo", "exo", "ex"] },
  { id: "LEV", name: "Levítico", short: "Lv", apiName: "Leviticus", chapters: 27, testament: "AT", aliases: ["levitico", "lev", "lv"] },
  { id: "NUM", name: "Números", short: "Nm", apiName: "Numbers", chapters: 36, testament: "AT", aliases: ["numeros", "num", "nm"] },
  { id: "DEU", name: "Deuteronômio", short: "Dt", apiName: "Deuteronomy", chapters: 34, testament: "AT", aliases: ["deuteronomio", "deut", "dt"] },
  { id: "JOS", name: "Josué", short: "Js", apiName: "Joshua", chapters: 24, testament: "AT", aliases: ["josue", "jos", "js"] },
  { id: "JDG", name: "Juízes", short: "Jz", apiName: "Judges", chapters: 21, testament: "AT", aliases: ["juizes", "jui", "jz"] },
  { id: "RUT", name: "Rute", short: "Rt", apiName: "Ruth", chapters: 4, testament: "AT", aliases: ["rute", "rut", "rt"] },
  { id: "1SA", name: "1 Samuel", short: "1Sm", apiName: "1 Samuel", chapters: 31, testament: "AT", aliases: ["1 samuel", "1samuel", "1 sm", "1sm"] },
  { id: "2SA", name: "2 Samuel", short: "2Sm", apiName: "2 Samuel", chapters: 24, testament: "AT", aliases: ["2 samuel", "2samuel", "2 sm", "2sm"] },
  { id: "1KI", name: "1 Reis", short: "1Rs", apiName: "1 Kings", chapters: 22, testament: "AT", aliases: ["1 reis", "1reis", "1 rs", "1rs"] },
  { id: "2KI", name: "2 Reis", short: "2Rs", apiName: "2 Kings", chapters: 25, testament: "AT", aliases: ["2 reis", "2reis", "2 rs", "2rs"] },
  { id: "1CH", name: "1 Crônicas", short: "1Cr", apiName: "1 Chronicles", chapters: 29, testament: "AT", aliases: ["1 cronicas", "1cronicas", "1 cr", "1cr"] },
  { id: "2CH", name: "2 Crônicas", short: "2Cr", apiName: "2 Chronicles", chapters: 36, testament: "AT", aliases: ["2 cronicas", "2cronicas", "2 cr", "2cr"] },
  { id: "EZR", name: "Esdras", short: "Ed", apiName: "Ezra", chapters: 10, testament: "AT", aliases: ["esdras", "esd", "ed"] },
  { id: "NEH", name: "Neemias", short: "Ne", apiName: "Nehemiah", chapters: 13, testament: "AT", aliases: ["neemias", "nee", "ne"] },
  { id: "EST", name: "Ester", short: "Et", apiName: "Esther", chapters: 10, testament: "AT", aliases: ["ester", "est", "et"] },
  { id: "JOB", name: "Jó", short: "Jó", apiName: "Job", chapters: 42, testament: "AT", aliases: ["jo", "job"] },
  { id: "PSA", name: "Salmos", short: "Sl", apiName: "Psalms", chapters: 150, testament: "AT", aliases: ["salmos", "salmo", "sl", "ps"] },
  { id: "PRO", name: "Provérbios", short: "Pv", apiName: "Proverbs", chapters: 31, testament: "AT", aliases: ["proverbios", "prov", "pv"] },
  { id: "ECC", name: "Eclesiastes", short: "Ec", apiName: "Ecclesiastes", chapters: 12, testament: "AT", aliases: ["eclesiastes", "ecl", "ec"] },
  { id: "SNG", name: "Cânticos", short: "Ct", apiName: "Song of Solomon", chapters: 8, testament: "AT", aliases: ["canticos", "cantares", "cantico dos canticos", "ct"] },
  { id: "ISA", name: "Isaías", short: "Is", apiName: "Isaiah", chapters: 66, testament: "AT", aliases: ["isaias", "isa", "is"] },
  { id: "JER", name: "Jeremias", short: "Jr", apiName: "Jeremiah", chapters: 52, testament: "AT", aliases: ["jeremias", "jer", "jr"] },
  { id: "LAM", name: "Lamentações", short: "Lm", apiName: "Lamentations", chapters: 5, testament: "AT", aliases: ["lamentacoes", "lam", "lm"] },
  { id: "EZK", name: "Ezequiel", short: "Ez", apiName: "Ezekiel", chapters: 48, testament: "AT", aliases: ["ezequiel", "eze", "ez"] },
  { id: "DAN", name: "Daniel", short: "Dn", apiName: "Daniel", chapters: 12, testament: "AT", aliases: ["daniel", "dan", "dn"] },
  { id: "HOS", name: "Oséias", short: "Os", apiName: "Hosea", chapters: 14, testament: "AT", aliases: ["oseias", "ose", "os"] },
  { id: "JOL", name: "Joel", short: "Jl", apiName: "Joel", chapters: 3, testament: "AT", aliases: ["joel", "jl"] },
  { id: "AMO", name: "Amós", short: "Am", apiName: "Amos", chapters: 9, testament: "AT", aliases: ["amos", "am"] },
  { id: "OBA", name: "Obadias", short: "Ob", apiName: "Obadiah", chapters: 1, testament: "AT", aliases: ["obadias", "oba", "ob"] },
  { id: "JON", name: "Jonas", short: "Jn", apiName: "Jonah", chapters: 4, testament: "AT", aliases: ["jonas", "jon", "jn"] },
  { id: "MIC", name: "Miquéias", short: "Mq", apiName: "Micah", chapters: 7, testament: "AT", aliases: ["miqueias", "miq", "mq"] },
  { id: "NAM", name: "Naum", short: "Na", apiName: "Nahum", chapters: 3, testament: "AT", aliases: ["naum", "nam", "na"] },
  { id: "HAB", name: "Habacuque", short: "Hc", apiName: "Habakkuk", chapters: 3, testament: "AT", aliases: ["habacuque", "hab", "hc"] },
  { id: "ZEP", name: "Sofonias", short: "Sf", apiName: "Zephaniah", chapters: 3, testament: "AT", aliases: ["sofonias", "sof", "sf"] },
  { id: "HAG", name: "Ageu", short: "Ag", apiName: "Haggai", chapters: 2, testament: "AT", aliases: ["ageu", "ag"] },
  { id: "ZEC", name: "Zacarias", short: "Zc", apiName: "Zechariah", chapters: 14, testament: "AT", aliases: ["zacarias", "zac", "zc"] },
  { id: "MAL", name: "Malaquias", short: "Ml", apiName: "Malachi", chapters: 4, testament: "AT", aliases: ["malaquias", "mal", "ml"] },

  { id: "MAT", name: "Mateus", short: "Mt", apiName: "Matthew", chapters: 28, testament: "NT", aliases: ["mateus", "mat", "mt"] },
  { id: "MRK", name: "Marcos", short: "Mc", apiName: "Mark", chapters: 16, testament: "NT", aliases: ["marcos", "mar", "mc"] },
  { id: "LUK", name: "Lucas", short: "Lc", apiName: "Luke", chapters: 24, testament: "NT", aliases: ["lucas", "luc", "lc"] },
  { id: "JHN", name: "João", short: "Jo", apiName: "John", chapters: 21, testament: "NT", aliases: ["joao", "john", "joh", "jo"] },
  { id: "ACT", name: "Atos", short: "At", apiName: "Acts", chapters: 28, testament: "NT", aliases: ["atos", "at"] },
  { id: "ROM", name: "Romanos", short: "Rm", apiName: "Romans", chapters: 16, testament: "NT", aliases: ["romanos", "rom", "rm"] },
  { id: "1CO", name: "1 Coríntios", short: "1Co", apiName: "1 Corinthians", chapters: 16, testament: "NT", aliases: ["1 corintios", "1corintios", "1 co", "1co"] },
  { id: "2CO", name: "2 Coríntios", short: "2Co", apiName: "2 Corinthians", chapters: 13, testament: "NT", aliases: ["2 corintios", "2corintios", "2 co", "2co"] },
  { id: "GAL", name: "Gálatas", short: "Gl", apiName: "Galatians", chapters: 6, testament: "NT", aliases: ["galatas", "gal", "gl"] },
  { id: "EPH", name: "Efésios", short: "Ef", apiName: "Ephesians", chapters: 6, testament: "NT", aliases: ["efesios", "efe", "ef"] },
  { id: "PHP", name: "Filipenses", short: "Fp", apiName: "Philippians", chapters: 4, testament: "NT", aliases: ["filipenses", "fil", "fp"] },
  { id: "COL", name: "Colossenses", short: "Cl", apiName: "Colossians", chapters: 4, testament: "NT", aliases: ["colossenses", "col", "cl"] },
  { id: "1TH", name: "1 Tessalonicenses", short: "1Ts", apiName: "1 Thessalonians", chapters: 5, testament: "NT", aliases: ["1 tessalonicenses", "1tessalonicenses", "1 ts", "1ts"] },
  { id: "2TH", name: "2 Tessalonicenses", short: "2Ts", apiName: "2 Thessalonians", chapters: 3, testament: "NT", aliases: ["2 tessalonicenses", "2tessalonicenses", "2 ts", "2ts"] },
  { id: "1TI", name: "1 Timóteo", short: "1Tm", apiName: "1 Timothy", chapters: 6, testament: "NT", aliases: ["1 timoteo", "1timoteo", "1 tm", "1tm"] },
  { id: "2TI", name: "2 Timóteo", short: "2Tm", apiName: "2 Timothy", chapters: 4, testament: "NT", aliases: ["2 timoteo", "2timoteo", "2 tm", "2tm"] },
  { id: "TIT", name: "Tito", short: "Tt", apiName: "Titus", chapters: 3, testament: "NT", aliases: ["tito", "tit", "tt"] },
  { id: "PHM", name: "Filemom", short: "Fm", apiName: "Philemon", chapters: 1, testament: "NT", aliases: ["filemom", "filemon", "flm", "fm"] },
  { id: "HEB", name: "Hebreus", short: "Hb", apiName: "Hebrews", chapters: 13, testament: "NT", aliases: ["hebreus", "heb", "hb"] },
  { id: "JAS", name: "Tiago", short: "Tg", apiName: "James", chapters: 5, testament: "NT", aliases: ["tiago", "tia", "tg"] },
  { id: "1PE", name: "1 Pedro", short: "1Pe", apiName: "1 Peter", chapters: 5, testament: "NT", aliases: ["1 pedro", "1pedro", "1 pe", "1pe"] },
  { id: "2PE", name: "2 Pedro", short: "2Pe", apiName: "2 Peter", chapters: 3, testament: "NT", aliases: ["2 pedro", "2pedro", "2 pe", "2pe"] },
  { id: "1JN", name: "1 João", short: "1Jo", apiName: "1 John", chapters: 5, testament: "NT", aliases: ["1 joao", "1joao", "1 jo", "1jo"] },
  { id: "2JN", name: "2 João", short: "2Jo", apiName: "2 John", chapters: 1, testament: "NT", aliases: ["2 joao", "2joao", "2 jo", "2jo"] },
  { id: "3JN", name: "3 João", short: "3Jo", apiName: "3 John", chapters: 1, testament: "NT", aliases: ["3 joao", "3joao", "3 jo", "3jo"] },
  { id: "JUD", name: "Judas", short: "Jd", apiName: "Jude", chapters: 1, testament: "NT", aliases: ["judas", "jud", "jd"] },
  { id: "REV", name: "Apocalipse", short: "Ap", apiName: "Revelation", chapters: 22, testament: "NT", aliases: ["apocalipse", "apo", "ap"] }
];

export const PROMISES = [
  { id: "isa-41-10", category: "Força", title: "Você não está sozinho", bookId: "ISA", chapter: 41, verse: 10 },
  { id: "psa-46-1", category: "Proteção", title: "Refúgio para hoje", bookId: "PSA", chapter: 46, verse: 1 },
  { id: "jer-29-11", category: "Esperança", title: "Há um futuro preparado", bookId: "JER", chapter: 29, verse: 11 },
  { id: "php-4-6", category: "Paz", title: "Entregue suas preocupações", bookId: "PHP", chapter: 4, verse: 6 },
  { id: "php-4-7", category: "Paz", title: "Paz além do entendimento", bookId: "PHP", chapter: 4, verse: 7 },
  { id: "psa-23-4", category: "Proteção", title: "Coragem no vale", bookId: "PSA", chapter: 23, verse: 4 },
  { id: "pro-3-5", category: "Caminho", title: "Confie de todo o coração", bookId: "PRO", chapter: 3, verse: 5 },
  { id: "pro-3-6", category: "Caminho", title: "Ele endireitará suas veredas", bookId: "PRO", chapter: 3, verse: 6 },
  { id: "mat-11-28", category: "Descanso", title: "Há descanso para você", bookId: "MAT", chapter: 11, verse: 28 },
  { id: "rom-8-28", category: "Esperança", title: "Deus age em todas as coisas", bookId: "ROM", chapter: 8, verse: 28 },
  { id: "jos-1-9", category: "Força", title: "Seja forte e corajoso", bookId: "JOS", chapter: 1, verse: 9 },
  { id: "psa-37-5", category: "Caminho", title: "Entregue o seu caminho", bookId: "PSA", chapter: 37, verse: 5 },
  { id: "isa-40-31", category: "Força", title: "Forças renovadas", bookId: "ISA", chapter: 40, verse: 31 },
  { id: "jhn-14-27", category: "Paz", title: "Uma paz que permanece", bookId: "JHN", chapter: 14, verse: 27 },
  { id: "psa-121-7", category: "Proteção", title: "Guardado em todo caminho", bookId: "PSA", chapter: 121, verse: 7 },
  { id: "1co-13-7", category: "Amor", title: "O amor permanece", bookId: "1CO", chapter: 13, verse: 7 },
  { id: "isa-43-2", category: "Proteção", title: "Presença em meio às águas", bookId: "ISA", chapter: 43, verse: 2 },
  { id: "psa-147-3", category: "Consolo", title: "Cuidado para o coração", bookId: "PSA", chapter: 147, verse: 3 },
  { id: "mat-6-33", category: "Caminho", title: "O essencial em primeiro lugar", bookId: "MAT", chapter: 6, verse: 33 },
  { id: "rom-15-13", category: "Esperança", title: "Transborde em esperança", bookId: "ROM", chapter: 15, verse: 13 },
  { id: "psa-128-1", category: "Família", title: "Bênção para o lar", bookId: "PSA", chapter: 128, verse: 1 },
  { id: "jos-24-15", category: "Família", title: "Uma casa que serve ao Senhor", bookId: "JOS", chapter: 24, verse: 15 },
  { id: "1jn-4-19", category: "Amor", title: "Amados primeiro", bookId: "1JN", chapter: 4, verse: 19 },
  { id: "deu-31-8", category: "Força", title: "Ele vai adiante de você", bookId: "DEU", chapter: 31, verse: 8 }
];

export const TOPICS = [
  { name: "Ansiedade", icon: "◌", query: "Paz", description: "Palavras para respirar e confiar" },
  { name: "Força", icon: "✦", query: "Força", description: "Coragem para continuar" },
  { name: "Esperança", icon: "☀", query: "Esperança", description: "Um futuro cheio de propósito" },
  { name: "Proteção", icon: "⌂", query: "Proteção", description: "Deus presente em todo caminho" },
  { name: "Família", icon: "♡", query: "Família", description: "Bênçãos para o seu lar" },
  { name: "Amor", icon: "∞", query: "Amor", description: "O amor que permanece" }
];

export function getBook(bookId) {
  return BOOKS.find(function (book) {
    return book.id === String(bookId || "").toUpperCase();
  });
}

export function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[.ªº]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatReference(bookId, chapter, verse) {
  var book = getBook(bookId);
  var base = (book ? book.name : bookId) + " " + chapter;
  return verse ? base + ":" + verse : base;
}
