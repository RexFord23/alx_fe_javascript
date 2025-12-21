/* ===================== GLOBAL DATA ===================== */

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
  { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

let quoteDisplay;
let categoryFilter;

/* ===================== INIT ===================== */

document.addEventListener("DOMContentLoaded", () => {
  quoteDisplay = document.getElementById("quoteDisplay");
  categoryFilter = document.getElementById("categoryFilter");

  document.getElementById("newQuote").addEventListener("click", () => {
    filterQuotes();
  });

  createAddQuoteForm();
  populateCategories();
  restoreLastFilter();
  filterQuotes();
});

/* ===================== TASK 0: RANDOM QUOTE ===================== */

function showRandomQuote(list = quotes) {
  if (list.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * list.length);
  const quote = list[randomIndex];

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

/* ===================== ADD QUOTE FORM ===================== */

function createAddQuoteForm() {
  const form = document.createElement("form");

  const quoteInput = document.createElement("input");
  quoteInput.placeholder = "Enter quote text";
  quoteInput.required = true;

  const categoryInput = document.createElement("input");
  categoryInput.placeholder = "Enter category";
  categoryInput.required = true;

  const button = document.createElement("button");
  button.textContent = "Add Quote";

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(button);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    quotes.push({
      text: quoteInput.value,
      category: categoryInput.value
    });

    saveQuotes();
    populateCategories();

    quoteInput.value = "";
    categoryInput.value = "";

    filterQuotes();
  });

  document.body.appendChild(form);
}

/* ===================== TASK 1: STORAGE ===================== */

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* ===================== JSON EXPORT ===================== */

function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

/* ===================== JSON IMPORT ===================== */

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  reader.readAsText(event.target.files[0]);
}

/* ===================== TASK 2: CATEGORY FILTER ===================== */

function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    showRandomQuote(quotes);
  } else {
    const filtered = quotes.filter(q => q.category === selectedCategory);
    showRandomQuote(filtered);
  }
}

function restoreLastFilter() {
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

/* ===================== TASK 3: SERVER SYNC ===================== */

const syncStatus = document.getElementById("syncStatus");

async function syncWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    quotes = serverQuotes; // SERVER WINS
    saveQuotes();
    populateCategories();
    filterQuotes();

    syncStatus.textContent = "Quotes synced from server.";
  } catch {
    syncStatus.textContent = "Server sync failed.";
  }
}

setInterval(syncWithServer, 30000);
