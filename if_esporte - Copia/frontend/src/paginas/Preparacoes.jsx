import { useEffect, useState } from "react";

function Preparacoes() {
  const [preparacoes, setPreparacoes] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarPreparacoes();
  }, []);

  async function carregarPreparacoes() {
    try {
      const resposta = await fetch("http://localhost:3000/preparacoes");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar preparações.");
      }

      const dados = await resposta.json();
      setPreparacoes(dados);
    } catch (erro) {
      console.error(erro);
      setErro("Não foi possível carregar as preparações.");
    }
  }

  return (
    <div>
      <h2>Preparações</h2>

      {erro && <p>{erro}</p>}

      {preparacoes.length === 0 ? (
        <p>Nenhuma preparação cadastrada.</p>
      ) : (
        preparacoes.map((preparacao) => (
          <div key={preparacao.id}>
            <h3>Preparação #{preparacao.id}</h3>

            <p>
              Evento:{" "}
              {preparacao.evento?.titulo || preparacao.eventoId}
            </p>

            <p>
              Campus:{" "}
              {preparacao.campus?.nome || preparacao.campusId}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Preparacoes;