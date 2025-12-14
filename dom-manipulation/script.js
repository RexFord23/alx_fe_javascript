document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');

    const quotes = [
        {text: "The best way to predict the future is to create it.", category: "Motivation"},
        {text: "Success is not final, failure is not fatal.", category: "Success"},
        {text: "Do what you can, with what you have, where you are.", category: "Inspiration"}
    ];

    function showRandomQuote() {
        quoteDisplay.innerHTML = "";

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];

        const quoteText = document.createElement("p");
        quoteText.textContent = `"${quote.text}"`;

        const quoteCategory = document.createElement("small");
        quoteCategory.textContent = `Category: ${quote.category}`;

        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
    }

    function createAddQuoteForm() {
        const form = document.createElement("form");

        const quoteInput = document.createElement("input");
        quoteInput.type = "text";
        quoteInput.placeholder = "Enter quote text";
        quoteInput.required = true;

        const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.textContent = "Add Quote";

        const categoryInput = document.createElement("input");
categoryInput.type = "text";
categoryInput.placeholder = "Enter category";
categoryInput.required = true;

        form.appendChild(quoteInput);
        form.appendChild(categoryInput);
        form.appendChild(submitBtn);

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const newQuote = {
                text: quoteInput.value,
                category: categoryInput.value
            };

            quotes.push(newQuote);

            quoteInput.value = "";
            categoryInput.value = "";
            showRandomQuote();
        });

        document.body.appendChild(form);
    }

    newQuoteBtn.addEventListener("click", showRandomQuote);

    createAddQuoteForm();
    showRandomQuote();
});


function addQuote() {
  
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  
  quotes.push({
    text: quoteText,
    category: quoteCategory
  });

  
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  
  showRandomQuote();
}
