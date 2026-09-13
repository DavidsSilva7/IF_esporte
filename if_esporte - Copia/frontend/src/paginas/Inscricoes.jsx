import { useState } from "react";

function Inscricoes() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todas");

  const inscricoes = [
    {
      id: 1,
      nome: "Jogos Intercampi 2026",
      campus: "Campus Senhor do Bonfim",
      periodo: "10/10/2026 a 15/10/2026",
      prazo: "30/09/2026",
      modalidades: "Futebol, Vôlei e Basquete",
      status: "Aberta",
      vagas: "120 vagas",
      cor: "verde",
    },
    {
      id: 2,
      nome: "Campeonato de Vôlei",
      campus: "Campus Guanambi",
      periodo: "22/09/2026 a 24/09/2026",
      prazo: "18/09/2026",
      modalidades: "Vôlei",
      status: "Aberta",
      vagas: "60 vagas",
      cor: "verde",
    },
    {
      id: 3,
      nome: "Torneio de Basquete",
      campus: "Campus Catu",
      periodo: "24/09/2026 a 26/09/2026",
      prazo: "20/09/2026",
      modalidades: "Basquete",
      status: "Aberta",
      vagas: "48 vagas",
      cor: "verde",
    },
    {
      id: 4,
      nome: "Corrida do IF",
      campus: "Campus Senhor do Bonfim",
      periodo: "01/08/2026",
      prazo: "25/07/2026",
      modalidades: "Atletismo",
      status: "Encerrada",
      vagas: "80 vagas",
      cor: "cinza",
    },
  ];

  const inscricoesFiltradas = inscricoes.filter((item) => {
    const correspondeBusca =
      item.nome.toLowerCase().includes(busca.toLowerCase()) ||
      item.campus.toLowerCase().includes(busca.toLowerCase()) ||
      item.modalidades.toLowerCase().includes(busca.toLowerCase());

    const correspondeFiltro =
      filtro === "Todas" || item.status === filtro;

    return correspondeBusca && correspondeFiltro;
  });

  return (
    <div className="page">

      {/* CABEÇALHO */}

      <div className="page-header inscricoes-header">
        <div>
          <h2>Inscrições</h2>

          <p>
            Consulte e participe dos eventos esportivos
            do IF Baiano.
          </p>
        </div>

        <div className="inscricoes-resumo">
          <strong>
            {inscricoes.filter(
              (item) => item.status === "Aberta"
            ).length}
          </strong>

          <span>inscrições abertas</span>
        </div>
      </div>


      {/* FILTROS */}

      <div className="inscricoes-filtros">

        <div className="inscricoes-busca">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar evento, campus ou modalidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <select
          className="inscricoes-select"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="Todas">Todas</option>
          <option value="Aberta">Abertas</option>
          <option value="Encerrada">Encerradas</option>
        </select>

      </div>


      {/* LISTAGEM */}

      <div className="inscricoes-lista">

        {inscricoesFiltradas.map((item) => (

          <div
            className="inscricao-card"
            key={item.id}
          >

            <div className="inscricao-card-top">

              <div className="inscricao-icone">
                🏆
              </div>

              <div className="inscricao-titulo">

                <div className="inscricao-status-row">

                  <span
                    className={`inscricao-status ${item.cor}`}
                  >
                    {item.status}
                  </span>

                </div>

                <h3>{item.nome}</h3>

                <p>{item.campus}</p>

              </div>

            </div>


            <div className="inscricao-detalhes">

              <div>
                <span className="detalhe-label">
                  Período
                </span>

                <strong>
                  📅 {item.periodo}
                </strong>
              </div>

              <div>
                <span className="detalhe-label">
                  Modalidades
                </span>

                <strong>
                  ⚽ {item.modalidades}
                </strong>
              </div>

              <div>
                <span className="detalhe-label">
                  Prazo para inscrição
                </span>

                <strong>
                  ⏱ {item.prazo}
                </strong>
              </div>

              <div>
                <span className="detalhe-label">
                  Vagas
                </span>

                <strong>
                  👥 {item.vagas}
                </strong>
              </div>

            </div>


            <div className="inscricao-card-bottom">

              <span className="inscricao-info">
                {item.status === "Aberta"
                  ? "Inscrições disponíveis"
                  : "Período de inscrição encerrado"}
              </span>

              <button
                className={
                  item.status === "Aberta"
                    ? "btn-inscricao"
                    : "btn-inscricao disabled"
                }
                disabled={item.status !== "Aberta"}
              >
                {item.status === "Aberta"
                  ? "Inscrever-se →"
                  : "Encerrada"}
              </button>

            </div>

          </div>

        ))}

      </div>


      {inscricoesFiltradas.length === 0 && (

        <div className="inscricoes-vazio">

          <div>🔎</div>

          <h3>Nenhuma inscrição encontrada</h3>

          <p>
            Tente buscar por outro evento,
            campus ou modalidade.
          </p>

        </div>

      )}

    </div>
  );
}

export default Inscricoes;