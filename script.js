
/* ====================================================
   script.js — Cours interactif BDD & SQL
   Toute la logique : données, visualisation, SQL simulé
   ==================================================== */

// ====================================================
// 1. DONNÉES DE LA BASE (simulées avec des tableaux JS)
// ====================================================

/** Table AUTEURS */
const auteursOriginal = [
    { id: 1,  nom: "Orwell",   prenom: "George",       ann_naissance: 1903, langue_ecriture: "anglais" },
    { id: 2,  nom: "Herbert",  prenom: "Frank",        ann_naissance: 1920, langue_ecriture: "anglais" },
    { id: 3,  nom: "Asimov",   prenom: "Isaac",        ann_naissance: 1920, langue_ecriture: "anglais" },
    { id: 4,  nom: "Huxley",   prenom: "Aldous",       ann_naissance: 1894, langue_ecriture: "anglais" },
    { id: 5,  nom: "Bradbury", prenom: "Ray",          ann_naissance: 1920, langue_ecriture: "anglais" },
    { id: 6,  nom: "K.Dick",   prenom: "Philip",       ann_naissance: 1928, langue_ecriture: "anglais" },
    { id: 7,  nom: "Barjavel", prenom: "René",         ann_naissance: 1911, langue_ecriture: "français" },
    { id: 8,  nom: "Boulle",   prenom: "Pierre",       ann_naissance: 1912, langue_ecriture: "français" },
    { id: 9,  nom: "Van Vogt", prenom: "Alfred Elton", ann_naissance: 1912, langue_ecriture: "anglais" },
    { id: 10, nom: "Verne",    prenom: "Jules",        ann_naissance: 1828, langue_ecriture: "français" }
];

/** Table LIVRES */
const livresOriginal = [
    { id: 1,  titre: "1984",                       id_auteur: 1,  ann_publi: 1949, note: 10 },
    { id: 2,  titre: "Dune",                       id_auteur: 2,  ann_publi: 1965, note: 8 },
    { id: 3,  titre: "Fondation",                  id_auteur: 3,  ann_publi: 1951, note: 9 },
    { id: 4,  titre: "Le meilleur des mondes",     id_auteur: 4,  ann_publi: 1931, note: 7 },
    { id: 5,  titre: "Fahrenheit 451",             id_auteur: 5,  ann_publi: 1953, note: 7 },
    { id: 6,  titre: "Ubik",                       id_auteur: 6,  ann_publi: 1969, note: 9 },
    { id: 7,  titre: "Chroniques martiennes",      id_auteur: 5,  ann_publi: 1950, note: 8 },
    { id: 8,  titre: "La nuit des temps",          id_auteur: 7,  ann_publi: 1968, note: 7 },
    { id: 9,  titre: "Blade Runner",               id_auteur: 6,  ann_publi: 1968, note: 8 },
    { id: 10, titre: "Les Robots",                 id_auteur: 3,  ann_publi: 1950, note: 9 },
    { id: 11, titre: "La Planète des singes",      id_auteur: 8,  ann_publi: 1963, note: 8 },
    { id: 12, titre: "Ravage",                     id_auteur: 7,  ann_publi: 1943, note: 8 },
    { id: 13, titre: "Le Maître du Haut Château",  id_auteur: 6,  ann_publi: 1962, note: 8 },
    { id: 14, titre: "Le monde des Ā",             id_auteur: 9,  ann_publi: 1945, note: 7 },
    { id: 15, titre: "La Fin de l'éternité",       id_auteur: 3,  ann_publi: 1955, note: 8 },
    { id: 16, titre: "De la Terre à la Lune",      id_auteur: 10, ann_publi: 1865, note: 10 }
];

// Copies de travail (modifiables, réinitialisables)
let auteurs = JSON.parse(JSON.stringify(auteursOriginal));
let livres  = JSON.parse(JSON.stringify(livresOriginal));

// Solutions des exercices
const solutions = {
    1: "SELECT * FROM livres",
    2: "SELECT titre FROM livres",
    3: "SELECT * FROM livres WHERE ann_publi > 1950",
    4: "SELECT * FROM auteurs",
    5: "SELECT * FROM livres WHERE note >= 9",
    6: "SELECT titre, nom, prenom FROM livres JOIN auteurs ON livres.id_auteur = auteurs.id",
    7: "SELECT * FROM auteurs WHERE langue_ecriture = 'français'"
};

// ====================================================
// 2. INITIALISATION AU CHARGEMENT
// ====================================================

document.addEventListener("DOMContentLoaded", () => {
    buildVisuTable();
    buildDuplicateTable();
    buildPKChecks();
    buildFKTables();
    attachSQLConsoleEvents();
    attachExerciseEvents();
    attachChallengeEvents();
});

// ====================================================
// 3. SECTION 2 — VISUALISATION INTERACTIVE
// ====================================================

/**
 * Construit le tableau interactif de la section "Visualisation"
 */
function buildVisuTable() {
    const table = document.getElementById("table-livres-visu");
    const columns = ["id", "titre", "id_auteur", "ann_publi", "note"];

    // En-tête
    let thead = "<thead><tr>";
    columns.forEach((col, idx) => {
        thead += `<th data-col-index="${idx}" data-col-name="${col}">${col}</th>`;
    });
    thead += "</tr></thead>";

    // Corps
    let tbody = "<tbody>";
    livres.forEach((livre, rowIdx) => {
        tbody += `<tr data-row-index="${rowIdx}">`;
        columns.forEach((col, colIdx) => {
            tbody += `<td data-col-index="${colIdx}">${livre[col]}</td>`;
        });
        tbody += "</tr>";
    });
    tbody += "</tbody>";

    table.innerHTML = thead + tbody;

    // Événements : clic sur en-tête
    table.querySelectorAll("th").forEach(th => {
        th.addEventListener("click", () => {
            clearHighlights(table);
            const colIdx = parseInt(th.dataset.colIndex);
            const colName = th.dataset.colName;

            // Surligner la colonne entière
            th.classList.add("highlight-header");
            table.querySelectorAll(`td[data-col-index="${colIdx}"]`).forEach(td => {
                td.classList.add("highlight-col");
            });

            showExplanation(getColumnExplanation(colName, colIdx));
        });
    });

    // Événements : clic sur ligne
    table.querySelectorAll("tbody tr").forEach(tr => {
        tr.addEventListener("click", (e) => {
            // Ne pas déclencher si on a cliqué sur un th
            if (e.target.tagName === "TH") return;
            clearHighlights(table);
            tr.classList.add("highlight-row");
            const rowIdx = parseInt(tr.dataset.rowIndex);
            const livre = livres[rowIdx];
            const auteur = auteurs.find(a => a.id === livre.id_auteur);
            showExplanation(getRowExplanation(livre, auteur));
        });
    });
}

/**
 * Supprime tous les surlignages du tableau
 */
function clearHighlights(table) {
    table.querySelectorAll(".highlight-row, .highlight-col, .highlight-header").forEach(el => {
        el.classList.remove("highlight-row", "highlight-col", "highlight-header");
    });
}

/**
 * Retourne l'explication d'une colonne
 */
function getColumnExplanation(colName, colIdx) {
    const explanations = {
        id: `<strong>Attribut « id »</strong> — C'est l'<em>identifiant unique</em> de chaque livre. Il joue le rôle de <strong>clé primaire</strong>. Domaine : INT (entier).`,
        titre: `<strong>Attribut « titre »</strong> — Le titre du livre. Chaque valeur est une chaîne de caractères. Domaine : TEXT.`,
        id_auteur: `<strong>Attribut « id_auteur »</strong> — C'est une <strong>clé étrangère</strong> qui fait référence à l'identifiant de l'auteur dans la table AUTEURS. Domaine : INT.`,
        ann_publi: `<strong>Attribut « ann_publi »</strong> — L'année de publication du livre. Domaine : INT (entier).`,
        note: `<strong>Attribut « note »</strong> — La note attribuée au livre (sur 10). Domaine : INT (entier positif).`
    };
    return explanations[colName] || "Attribut sélectionné.";
}

/**
 * Retourne l'explication d'une ligne
 */
function getRowExplanation(livre, auteur) {
    const auteurInfo = auteur ? `${auteur.prenom} ${auteur.nom}` : "Auteur inconnu";
    return `<strong>T-uplet sélectionné :</strong><br>
    📖 <em>${livre.titre}</em> (id: ${livre.id})<br>
    ✍️ Auteur : ${auteurInfo} (id_auteur: ${livre.id_auteur})<br>
    📅 Année de publication : ${livre.ann_publi}<br>
    ⭐ Note : ${livre.note}/10<br><br>
    <em>Ce t-uplet (ligne) représente un enregistrement complet pour ce livre.</em>`;
}

/**
 * Affiche la boîte d'explication
 */
function showExplanation(html) {
    const box = document.getElementById("explanation-box");
    const content = document.getElementById("explanation-content");
    content.innerHTML = html;
    box.classList.remove("hidden");
}

// Fermer la boîte d'explication
document.getElementById("close-explanation")?.addEventListener("click", () => {
    document.getElementById("explanation-box").classList.add("hidden");
    const table = document.getElementById("table-livres-visu");
    clearHighlights(table);
});

// ====================================================
// 4. SECTION 3 — CLÉ PRIMAIRE (DOUBLONS)
// ====================================================

/**
 * Construit le tableau avec doublons
 */
function buildDuplicateTable() {
    const table = document.getElementById("table-doublons");
    const data = [
        { id: 1, titre: "1984",      id_auteur: 1, ann_publi: 1949, note: 10 },
        { id: 2, titre: "Dune",      id_auteur: 2, ann_publi: 1965, note: 8 },
        { id: 2, titre: "Dune",      id_auteur: 2, ann_publi: 1965, note: 8 },  // doublon !
        { id: 3, titre: "Fondation", id_auteur: 3, ann_publi: 1951, note: 9 }
    ];
    const columns = ["id", "titre", "id_auteur", "ann_publi", "note"];

    let thead = "<thead><tr>";
    columns.forEach(col => { thead += `<th>${col}</th>`; });
    thead += "</tr></thead>";

    let tbody = "<tbody>";
    data.forEach((row, idx) => {
        const isDuplicate = (idx === 1 || idx === 2) ? 'class="duplicate-row"' : '';
        tbody += `<tr ${isDuplicate}>`;
        columns.forEach(col => {
            tbody += `<td>${row[col]}</td>`;
        });
        tbody += "</tr>";
    });
    tbody += "</tbody>";

    table.innerHTML = thead + tbody;

    // Bouton "Corriger les doublons"
    document.getElementById("btn-fix-duplicates").addEventListener("click", fixDuplicates);
}

/**
 * Corrige les doublons : supprime la ligne dupliquée et met en évidence la clé primaire
 */
function fixDuplicates() {
    const table = document.getElementById("table-doublons");
    const fixedData = [
        { id: 1, titre: "1984",      id_auteur: 1, ann_publi: 1949, note: 10 },
        { id: 2, titre: "Dune",      id_auteur: 2, ann_publi: 1965, note: 8 },
        { id: 3, titre: "Fondation", id_auteur: 3, ann_publi: 1951, note: 9 }
    ];
    const columns = ["id", "titre", "id_auteur", "ann_publi", "note"];

    let thead = "<thead><tr>";
    columns.forEach((col, idx) => {
        thead += `<th ${idx === 0 ? 'style="background:#f39c12"' : ''}>${col}${idx === 0 ? ' 🔑' : ''}</th>`;
    });
    thead += "</tr></thead>";

    let tbody = "<tbody>";
    fixedData.forEach(row => {
        tbody += "<tr>";
        columns.forEach((col, idx) => {
            tbody += `<td ${idx === 0 ? 'class="highlight-pk"' : ''}>${row[col]}</td>`;
        });
        tbody += "</tr>";
    });
    tbody += "</tbody>";

    table.innerHTML = thead + tbody;
    table.classList.remove("table-error");
    table.classList.add("table-fixed");

    // Masquer l'avertissement et afficher l'explication
    document.getElementById("duplicate-warning").classList.add("hidden-warning");
    document.getElementById("fix-explanation").classList.remove("hidden");
    document.getElementById("btn-fix-duplicates").classList.add("hidden");
}

/**
 * Construit les vérifications de clé primaire
 */
function buildPKChecks() {
    const container = document.getElementById("pk-checks");
    const checks = [
        { attr: "note",      ok: false, reason: "Non — On peut trouver 2 fois la même note (ex : plusieurs livres ont une note de 8)." },
        { attr: "ann_publi", ok: false, reason: "Non — On peut trouver 2 fois la même année (ex : 1950 apparaît 2 fois)." },
        { attr: "id_auteur", ok: false, reason: "Non — Un même auteur peut avoir écrit plusieurs livres (ex : Asimov a 3 livres)." },
        { attr: "titre",     ok: false, reason: "Pas fiable — Deux livres différents peuvent avoir le même titre." },
        { attr: "id",        ok: true,  reason: "✅ Oui ! Chaque id est unique et auto-incrémenté. C'est la clé primaire idéale." }
    ];

    checks.forEach(check => {
        const div = document.createElement("div");
        div.className = "pk-check-item";
        div.innerHTML = `
            <span class="pk-icon">${check.ok ? '✅' : '❌'}</span>
            <span class="pk-attr">${check.attr}</span>
            <span class="pk-reason">${check.reason}</span>
        `;
        container.appendChild(div);
    });
}

// ====================================================
// 5. SECTION 4 — CLÉ ÉTRANGÈRE ET RELATIONS
// ====================================================

/**
 * Construit les deux tables liées (LIVRES et AUTEURS) avec interaction
 */
function buildFKTables() {
    // Table LIVRES
    const tableLivres = document.getElementById("table-livres-fk");
    const colsLivres = ["id", "titre", "id_auteur", "ann_publi", "note"];
    buildRelTable(tableLivres, livres, colsLivres, "livres");

    // Table AUTEURS
    const tableAuteurs = document.getElementById("table-auteurs-fk");
    const colsAuteurs = ["id", "nom", "prenom", "ann_naissance", "langue_ecriture"];
    buildRelTable(tableAuteurs, auteurs, colsAuteurs, "auteurs");

    // Ajouter interaction : clic sur id_auteur
    tableLivres.querySelectorAll("tbody tr").forEach((tr, rowIdx) => {
        const idAuteurCell = tr.querySelectorAll("td")[2]; // index 2 = id_auteur
        if (idAuteurCell) {
            idAuteurCell.style.cursor = "pointer";
            idAuteurCell.title = "Cliquez pour voir le lien";
            idAuteurCell.addEventListener("click", () => {
                highlightFKRelation(rowIdx, livres[rowIdx].id_auteur);
            });
        }
    });
}

/**
 * Construit un tableau relationnel générique
 */
function buildRelTable(tableEl, data, columns, tableName) {
    let thead = "<thead><tr>";
    columns.forEach((col, idx) => {
        let extra = "";
        if (col === "id") extra = ' style="background:#f39c12" title="Clé primaire"';
        if (col === "id_auteur") extra = ' style="background:#e84393" title="Clé étrangère"';
        const label = col === "id" ? col + " 🔑" : (col === "id_auteur" ? col + " 🔗" : col);
        thead += `<th${extra}>${label}</th>`;
    });
    thead += "</tr></thead>";

    let tbody = "<tbody>";
    data.forEach((row, rowIdx) => {
        tbody += `<tr data-row="${rowIdx}" data-table="${tableName}">`;
        columns.forEach(col => {
            let cls = "";
            if (col === "id" && tableName === "auteurs") cls = `class="pk-cell" data-auteur-id="${row[col]}"`;
            if (col === "id_auteur") cls = `class="fk-cell" data-fk-value="${row[col]}"`;
            tbody += `<td ${cls}>${row[col]}</td>`;
        });
        tbody += "</tr>";
    });
    tbody += "</tbody>";

    tableEl.innerHTML = thead + tbody;
}

/**
 * Met en surbrillance la relation clé étrangère
 */
function highlightFKRelation(livreRowIdx, idAuteur) {
    // Réinitialiser les surlignages
    document.querySelectorAll(".highlight-fk-source, .highlight-fk-target").forEach(el => {
        el.classList.remove("highlight-fk-source", "highlight-fk-target");
    });
    document.querySelectorAll("#table-livres-fk tbody tr, #table-auteurs-fk tbody tr").forEach(tr => {
        tr.style.background = "";
    });

    // Surligner la cellule id_auteur dans LIVRES
    const livresTable = document.getElementById("table-livres-fk");
    const livreRow = livresTable.querySelectorAll("tbody tr")[livreRowIdx];
    if (livreRow) {
        livreRow.style.background = "#e3f2fd";
        const fkCell = livreRow.querySelector(".fk-cell");
        if (fkCell) fkCell.classList.add("highlight-fk-source");
    }

    // Surligner la ligne correspondante dans AUTEURS
    const auteursTable = document.getElementById("table-auteurs-fk");
    auteursTable.querySelectorAll("tbody tr").forEach(tr => {
        const pkCell = tr.querySelector(".pk-cell");
        if (pkCell && parseInt(pkCell.dataset.auteurId) === idAuteur) {
            tr.style.background = "#fce4ec";
            pkCell.classList.add("highlight-fk-target");
        }
    });

    // Afficher explication
    const livre = livres[livreRowIdx];
    const auteur = auteurs.find(a => a.id === idAuteur);
    const fkBox = document.getElementById("fk-explanation-box");
    const fkText = document.getElementById("fk-explanation-text");
    fkText.innerHTML = `🔗 Le livre « <strong>${livre.titre}</strong> » a <code>id_auteur = ${idAuteur}</code>, 
        ce qui correspond à l'auteur <strong>${auteur.prenom} ${auteur.nom}</strong> (id = ${auteur.id}) dans la table AUTEURS.`;
    fkBox.classList.remove("hidden");
}

// ====================================================
// 6. SECTION 5 — CONSOLE SQL
// ====================================================

/**
 * Attache les événements de la console SQL principale
 */
function attachSQLConsoleEvents() {
    document.getElementById("btn-run-sql").addEventListener("click", () => {
        const query = document.getElementById("sql-input").value.trim();
        const result = executeSQL(query);
        displayResult(result, "sql-result", "sql-result-area", "sql-error", "sql-result-title");
    });

    document.getElementById("btn-clear-sql").addEventListener("click", () => {
        document.getElementById("sql-input").value = "";
        document.getElementById("sql-result-area").classList.add("hidden");
        document.getElementById("sql-error").classList.add("hidden");
    });

    document.getElementById("btn-reset-db").addEventListener("click", () => {
        livres  = JSON.parse(JSON.stringify(livresOriginal));
        auteurs = JSON.parse(JSON.stringify(auteursOriginal));
        alert("✅ Base de données réinitialisée !");
    });

    // Chips (exemples rapides)
    document.querySelectorAll(".chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const query = chip.dataset.query;
            document.getElementById("sql-input").value = query;
            const result = executeSQL(query);
            displayResult(result, "sql-result", "sql-result-area", "sql-error", "sql-result-title");
            // Scroll vers le résultat
            document.getElementById("sql-result-area").scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    });

    // Exécuter avec Ctrl+Entrée
    document.getElementById("sql-input").addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "Enter") {
            document.getElementById("btn-run-sql").click();
        }
    });
}

// ====================================================
// 7. MOTEUR SQL SIMPLIFIÉ
// ====================================================

/**
 * Exécute une requête SQL simplifiée
 * @param {string} query — La requête SQL
 * @returns {object} — { success: bool, columns: [], rows: [], error: string }
 */
function executeSQL(query) {
    if (!query) return { success: false, error: "Veuillez entrer une requête SQL." };

    // Normaliser la requête
    let q = query.trim().replace(/;$/, "").replace(/\s+/g, " ");

    // Vérifier que c'est un SELECT
    if (!/^select\s/i.test(q)) {
        return { success: false, error: "Seules les requêtes SELECT sont supportées dans cette console." };
    }

    try {
        // Détecter un JOIN
        if (/\bjoin\b/i.test(q)) {
            return executeJoin(q);
        }

        // Requête simple : SELECT ... FROM ... [WHERE ...]
        return executeSimpleSelect(q);

    } catch (err) {
        return { success: false, error: "Erreur de syntaxe : " + err.message };
    }
}

/**
 * Exécute un SELECT simple (sans JOIN)
 */
function executeSimpleSelect(q) {
    // Extraire les parties
    const fromMatch = q.match(/from\s+(\w+)/i);
    if (!fromMatch) return { success: false, error: "Clause FROM manquante. Exemple : SELECT * FROM livres" };

    const tableName = fromMatch[1].toLowerCase();
    let data;

    if (tableName === "livres") data = livres;
    else if (tableName === "auteurs") data = auteurs;
    else return { success: false, error: `Table « ${tableName} » introuvable. Tables disponibles : livres, auteurs` };

    // Extraire les colonnes demandées
    const selectPart = q.match(/^select\s+(.+?)\s+from/i);
    if (!selectPart) return { success: false, error: "Syntaxe incorrecte. Exemple : SELECT * FROM livres" };

    let selectedColumns;
    const colStr = selectPart[1].trim();

    if (colStr === "*") {
        selectedColumns = Object.keys(data[0]);
    } else {
        selectedColumns = colStr.split(",").map(c => c.trim().toLowerCase());
        // Vérifier que les colonnes existent
        const validCols = Object.keys(data[0]);
        for (const col of selectedColumns) {
            if (!validCols.includes(col)) {
                return { success: false, error: `Colonne « ${col} » introuvable dans la table ${tableName}. Colonnes disponibles : ${validCols.join(", ")}` };
            }
        }
    }

    // Filtrage WHERE
    let filteredData = [...data];
    const whereMatch = q.match(/where\s+(.+)$/i);
    if (whereMatch) {
        filteredData = applyWhere(filteredData, whereMatch[1]);
        if (filteredData.error) return { success: false, error: filteredData.error };
    }

    // Projeter les colonnes
    const rows = filteredData.map(row => {
        const newRow = {};
        selectedColumns.forEach(col => { newRow[col] = row[col]; });
        return newRow;
    });

    return { success: true, columns: selectedColumns, rows: rows };
}

/**
 * Exécute une requête avec JOIN
 */
function executeJoin(q) {
    // Pattern : SELECT cols FROM table1 JOIN table2 ON condition
    const joinMatch = q.match(
        /^select\s+(.+?)\s+from\s+(\w+)\s+join\s+(\w+)\s+on\s+(.+)$/i
    );

    if (!joinMatch) {
        return { success: false, error: "Syntaxe JOIN incorrecte. Exemple : SELECT titre, nom FROM livres JOIN auteurs ON livres.id_auteur = auteurs.id" };
    }

    const colStr    = joinMatch[1].trim();
    const table1    = joinMatch[2].toLowerCase();
    const table2    = joinMatch[3].toLowerCase();
    const condition = joinMatch[4].trim();

    // Obtenir les données
    const tables = { livres, auteurs };
    if (!tables[table1]) return { success: false, error: `Table « ${table1} » introuvable.` };
    if (!tables[table2]) return { success: false, error: `Table « ${table2} » introuvable.` };

    const data1 = tables[table1];
    const data2 = tables[table2];

    // Parser la condition ON (table1.col = table2.col)
    const condMatch = condition.match(/(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/);
    if (!condMatch) {
        return { success: false, error: "Condition ON incorrecte. Exemple : livres.id_auteur = auteurs.id" };
    }

    const leftTable = condMatch[1].toLowerCase();
    const leftCol   = condMatch[2].toLowerCase();
    const rightTable = condMatch[3].toLowerCase();
    const rightCol   = condMatch[4].toLowerCase();

    // Déterminer quel côté correspond à quelle table
    let joinedRows = [];
    data1.forEach(row1 => {
        data2.forEach(row2 => {
            let leftVal, rightVal;

            if (leftTable === table1) {
                leftVal = row1[leftCol];
                rightVal = row2[rightCol];
            } else {
                leftVal = row2[leftCol];
                rightVal = row1[rightCol];
            }

            if (leftVal === rightVal) {
                // Fusionner les deux lignes
                const merged = {};
                // Ajouter les colonnes de table1 (avec préfixe si conflit)
                Object.keys(row1).forEach(k => {
                    merged[k] = row1[k];
                    merged[table1 + "." + k] = row1[k];
                });
                // Ajouter les colonnes de table2
                Object.keys(row2).forEach(k => {
                    if (merged[k] !== undefined && k !== leftCol && k !== rightCol) {
                        // Conflit de nom : on préfixe
                        merged[table2 + "." + k] = row2[k];
                    } else {
                        merged[k] = row2[k];
                    }
                    merged[table2 + "." + k] = row2[k];
                });
                joinedRows.push(merged);
            }
        });
    });

    // Sélectionner les colonnes
    let selectedColumns;
    if (colStr === "*") {
        // Toutes les colonnes uniques
        const allCols = new Set();
        Object.keys(data1[0]).forEach(k => allCols.add(k));
        Object.keys(data2[0]).forEach(k => {
            if (allCols.has(k)) {
                allCols.delete(k);
                allCols.add(table1 + "." + k);
                allCols.add(table2 + "." + k);
            } else {
                allCols.add(k);
            }
        });
        selectedColumns = [...allCols];
    } else {
        selectedColumns = colStr.split(",").map(c => c.trim().toLowerCase());
    }

    // Projeter
    const rows = joinedRows.map(row => {
        const newRow = {};
        selectedColumns.forEach(col => {
            // Essayer le nom direct, puis avec préfixes
            if (row[col] !== undefined) {
                newRow[col] = row[col];
            } else if (row[table1 + "." + col] !== undefined) {
                newRow[col] = row[table1 + "." + col];
            } else if (row[table2 + "." + col] !== undefined) {
                newRow[col] = row[table2 + "." + col];
            } else {
                newRow[col] = "NULL";
            }
        });
        return newRow;
    });

    return { success: true, columns: selectedColumns, rows: rows };
}

/**
 * Applique une clause WHERE simple
 * Supporte : =, !=, >, <, >=, <=, et les chaînes entre guillemets
 */
function applyWhere(data, whereStr) {
    whereStr = whereStr.trim();

    // Parser la condition
    const match = whereStr.match(/^(\w+)\s*(=|!=|<>|>=|<=|>|<)\s*(.+)$/);
    if (!match) {
        return { error: "Clause WHERE incorrecte. Exemple : WHERE note > 8" };
    }

    const col = match[1].toLowerCase();
    const op  = match[2];
    let val   = match[3].trim();

    // Vérifier que la colonne existe
    if (data.length > 0 && data[0][col] === undefined) {
        return { error: `Colonne « ${col} » introuvable dans la clause WHERE.` };
    }

    // Déterminer si c'est une chaîne ou un nombre
    let isString = false;
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
        val = val.slice(1, -1);
        isString = true;
    } else {
        val = parseFloat(val);
        if (isNaN(val)) {
            return { error: "Valeur invalide dans la clause WHERE. Les chaînes doivent être entre guillemets simples." };
        }
    }

    return data.filter(row => {
        const rowVal = row[col];
        switch (op) {
            case "=":  return isString ? String(rowVal).toLowerCase() === val.toLowerCase() : rowVal === val;
            case "!=":
            case "<>": return isString ? String(rowVal).toLowerCase() !== val.toLowerCase() : rowVal !== val;
            case ">":  return rowVal > val;
            case "<":  return rowVal < val;
            case ">=": return rowVal >= val;
            case "<=": return rowVal <= val;
            default:   return true;
        }
    });
}

/**
 * Affiche le résultat d'une requête dans la page
 */
function displayResult(result, resultDivId, resultAreaId, errorDivId, titleId) {
    const resultDiv  = document.getElementById(resultDivId);
    const resultArea = document.getElementById(resultAreaId);
    const errorDiv   = document.getElementById(errorDivId);

    if (!result.success) {
        resultArea.classList.add("hidden");
        errorDiv.textContent = "❌ " + result.error;
        errorDiv.classList.remove("hidden");
        return;
    }

    errorDiv.classList.add("hidden");

    if (result.rows.length === 0) {
        resultDiv.innerHTML = "<p style='color: #6c757d; font-style: italic;'>Aucun résultat trouvé.</p>";
        resultArea.classList.remove("hidden");
        return;
    }

    // Construire le tableau de résultats
    let html = "<table><thead><tr>";
    result.columns.forEach(col => { html += `<th>${col}</th>`; });
    html += "</tr></thead><tbody>";

    result.rows.forEach(row => {
        html += "<tr>";
        result.columns.forEach(col => { html += `<td>${row[col]}</td>`; });
        html += "</tr>";
    });
    html += "</tbody></table>";
    html += `<p class="result-count">📊 ${result.rows.length} résultat(s) trouvé(s)</p>`;

    resultDiv.innerHTML = html;
    resultArea.classList.remove("hidden");
}

// ====================================================
// 8. SECTION 6 — EXERCICES
// ====================================================

/**
 * Attache les événements des exercices
 */
function attachExerciseEvents() {
    // Boutons "Voir la solution"
    document.querySelectorAll(".btn-solution").forEach(btn => {
        btn.addEventListener("click", () => {
            const exNum = btn.dataset.exercise;
            const solDiv = document.getElementById(`solution-${exNum}`);
            solDiv.classList.toggle("hidden");
            btn.textContent = solDiv.classList.contains("hidden") ? "👁️ Voir la solution" : "🙈 Masquer la solution";
        });
    });

    // Boutons "Exécuter la solution"
    document.querySelectorAll(".btn-run-exercise").forEach(btn => {
        btn.addEventListener("click", () => {
            const exNum = btn.dataset.exercise;
            const query = solutions[exNum];
            const result = executeSQL(query);

            // Afficher la solution si masquée
            document.getElementById(`solution-${exNum}`).classList.remove("hidden");

            // Afficher le résultat
            const resultDiv = document.getElementById(`result-ex-${exNum}`);
            resultDiv.classList.remove("hidden");

            if (result.success) {
                let html = "<table><thead><tr>";
                result.columns.forEach(col => { html += `<th>${col}</th>`; });
                html += "</tr></thead><tbody>";
                result.rows.forEach(row => {
                    html += "<tr>";
                    result.columns.forEach(col => { html += `<td>${row[col]}</td>`; });
                    html += "</tr>";
                });
                html += "</tbody></table>";
                html += `<p class="result-count">📊 ${result.rows.length} résultat(s)</p>`;
                resultDiv.innerHTML = html;
            } else {
                resultDiv.innerHTML = `<p style="color:red;">❌ ${result.error}</p>`;
            }
        });
    });
}

// ====================================================
// 9. MODE DÉFI
// ====================================================

/**
 * Attache les événements du mode défi
 */
function attachChallengeEvents() {
    document.getElementById("btn-run-challenge").addEventListener("click", () => {
        const query = document.getElementById("challenge-input").value.trim();
        const result = executeSQL(query);
        displayResult(result, "challenge-result", "challenge-result-area", "challenge-error");
    });

    document.getElementById("btn-clear-challenge").addEventListener("click", () => {
        document.getElementById("challenge-input").value = "";
        document.getElementById("challenge-result-area").classList.add("hidden");
        document.getElementById("challenge-error").classList.add("hidden");
    });

    // Ctrl+Entrée
    document.getElementById("challenge-input").addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "Enter") {
            document.getElementById("btn-run-challenge").click();
        }
    });
}