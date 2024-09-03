document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const resultadosBuscaSection = document.getElementById("resultadosBusca");

  let sumarios = {};

  // Carrega o arquivo JSON
  fetch("sumarios.json")
    .then((response) => response.json())
    .then((data) => {
      sumarios = data; // Armazena os sumários no objeto
      console.log("Sumários carregados:", sumarios);
    })
    .catch((error) => {
      console.error("Erro ao carregar sumarios.json:", error);
      searchResults.innerHTML =
        "<p>Erro ao carregar dados. Por favor, tente novamente mais tarde.</p>";
    });

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      performSearch(searchTerm);
    }
  });

  function performSearch(term) {
    searchResults.innerHTML = "<p>Buscando...</p>";
    resultadosBuscaSection.style.display = "block";

    if (Object.keys(sumarios).length === 0) {
      searchResults.innerHTML =
        "<p>Dados não disponíveis. Tente novamente mais tarde.</p>";
      return;
    }

    const results = searchSumarios(term);
    displayResults(results, term);
  }

  function searchSumarios(term) {
    const resultados = [];
    const lowerCaseTerm = term.toLowerCase();
    console.log(`Buscando pelo termo: "${lowerCaseTerm}"`);

    for (const aula in sumarios) {
      const { summary, index } = sumarios[aula];

      // Verificação no summary
      if (summary.toLowerCase().includes(lowerCaseTerm)) {
        console.log(`Termo encontrado no resumo da ${aula}`);
        resultados.push({ aula, titulo: "Resumo", tempo: "N/A" });
      }

      // Verificação nos títulos do índice e minutagens
      for (const titulo in index) {
        const tituloLower = titulo.toLowerCase();
        const indexLower = index[titulo].toLowerCase();

        if (
          tituloLower.includes(lowerCaseTerm) ||
          indexLower.includes(lowerCaseTerm)
        ) {
          console.log(`Termo encontrado no título: ${titulo} da ${aula}`);
          const tempo = index[titulo];
          resultados.push({ aula, titulo, tempo });
        }
      }
    }

    console.log("Resultados encontrados:", resultados);
    return resultados;
  }

  function displayResults(results, searchTerm) {
    if (results.length === 0) {
      searchResults.innerHTML = `<p>O termo "${searchTerm}" não foi encontrado nas aulas.</p>`;
    } else {
      const resultList = results
        .map((result) => {
          return `
            <li>
              Aula ${result.aula.replace("aula", "")} - ${result.titulo} (${
            result.tempo
          })
            </li>
          `;
        })
        .join("");
      searchResults.innerHTML = `
        <p>Resultados encontrados para "${searchTerm}":</p>
        <ul>${resultList}</ul>
      `;
    }
  }
});
