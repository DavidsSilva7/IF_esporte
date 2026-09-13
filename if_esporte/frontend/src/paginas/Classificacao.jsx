import { useEffect, useState } from "react";

function Classificacao() {
  const [classificacoes, setClassificacoes] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarClassificacao();
  }, []);

  async function carregarClassificacao() {
    try {
      const resposta = await fetch(
        "http://localhost:3000/classificacoes"
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar classificação.");
      }

      const dados = await resposta.json();
      setClassificacoes(dados);
    } catch (erro) {
      console.error(erro);
      setErro("Não foi possível carregar a classificação.");
    }
  }

  return (
    <div>
      <h2>Classificação</h2>

      {erro && <p>{erro}</p>}

      {classificacoes.length === 0 ? (
        <p>Nenhuma classificação cadastrada.</p>
      ) : (
        classificacoes.map((classificacao, indice) => (
          <div key={classificacao.id}>
            <h3>
              {indice + 1}º lugar —{" "}
              {classificacao.campus?.nome || classificacao.campusId}
            </h3>

            <p>
              Pontos: {classificacao.pontos}
            </p>

            <p>
              Jogos: {classificacao.jogos}
            </p>

            <p>
              Vitórias: {classificacao.vitorias}
            </p>

            <p>
              Empates: {classificacao.empates}
            </p>

            <p>
              Derrotas: {classificacao.derrotas}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Classificacao;