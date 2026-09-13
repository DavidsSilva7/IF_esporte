import { useEffect, useState } from "react";

function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarPartidas();
  }, []);

  async function carregarPartidas() {
    try {
      const resposta = await fetch("http://localhost:3000/partidas");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar partidas.");
      }

      const dados = await resposta.json();
      setPartidas(dados);
    } catch (erro) {
      console.error(erro);
      setErro("Não foi possível carregar as partidas.");
    }
  }

  return (
    <div>
      <h2>Partidas</h2>

      {erro && <p>{erro}</p>}

      {partidas.length === 0 ? (
        <p>Nenhuma partida cadastrada.</p>
      ) : (
        partidas.map((partida) => (
          <div key={partida.id}>
            <h3>Partida #{partida.id}</h3>

            <p>
              Evento:{" "}
              {partida.evento?.titulo || partida.eventoId}
            </p>

            <p>
              Modalidade:{" "}
              {partida.modalidade?.nome || partida.modalidadeId}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Partidas;