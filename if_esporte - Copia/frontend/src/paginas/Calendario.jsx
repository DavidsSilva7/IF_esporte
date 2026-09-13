import { useEffect, useState } from "react";

function Calendario() {
  const [eventos, setEventos] = useState([]);
  const [mes, setMes] = useState(new Date());

  useEffect(() => {
    carregarEventos();
  }, []);

  async function carregarEventos() {
    try {
      const resposta = await fetch("http://localhost:3000/eventos");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar eventos.");
      }

      const dados = await resposta.json();
      setEventos(dados);
    } catch (erro) {
      console.error(erro);
    }
  }

  const ano = mes.getFullYear();
  const numeroMes = mes.getMonth();

  const primeiroDia = new Date(ano, numeroMes, 1).getDay();
  const quantidadeDias = new Date(
    ano,
    numeroMes + 1,
    0
  ).getDate();

  const dias = [];

  for (let i = 0; i < primeiroDia; i++) {
    dias.push(null);
  }

  for (let dia = 1; dia <= quantidadeDias; dia++) {
    dias.push(dia);
  }

  function voltarMes() {
    setMes(new Date(ano, numeroMes - 1, 1));
  }

  function avancarMes() {
    setMes(new Date(ano, numeroMes + 1, 1));
  }

  function eventosDoDia(dia) {
    return eventos.filter((evento) => {
      if (!evento.dataInicio) return false;

      const data = new Date(evento.dataInicio);

      return (
        data.getDate() === dia &&
        data.getMonth() === numeroMes &&
        data.getFullYear() === ano
      );
    });
  }

  const nomeMes = mes.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="calendario">
      <div className="calendario-cabecalho">
        <button onClick={voltarMes}>←</button>

        <h2>
          {nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}
        </h2>

        <button onClick={avancarMes}>→</button>
      </div>

      <div className="dias-semana">
        <span>Dom</span>
        <span>Seg</span>
        <span>Ter</span>
        <span>Qua</span>
        <span>Qui</span>
        <span>Sex</span>
        <span>Sáb</span>
      </div>

      <div className="grade-calendario">
        {dias.map((dia, index) => (
          <div className="dia" key={index}>
            {dia && (
              <>
                <strong>{dia}</strong>

                {eventosDoDia(dia).map((evento) => (
                  <div className="evento-calendario" key={evento.id}>
                    {evento.titulo}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendario;