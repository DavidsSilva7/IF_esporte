import { useEffect, useState } from "react";

function Preparacoes() {
  const [preparacoes, setPreparacoes] = useState([]);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarPreparacoes();
  }, []);

  async function carregarPreparacoes() {
    try {
      const resposta = await fetch(
        "http://localhost:3000/preparacoes"
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar preparações.");
      }

      const dados = await resposta.json();

      setPreparacoes(dados);
    } catch (erro) {
      console.error(erro);

      setErro(
        "Não foi possível carregar as preparações."
      );
    }
  }

  const preparacoesFiltradas = preparacoes.filter(
    (preparacao) => {
      const evento =
        preparacao.evento?.titulo ||
        preparacao.eventoId ||
        "";

      const campus =
        preparacao.campus?.nome ||
        preparacao.campusId ||
        "";

      return `${evento} ${campus}`
        .toLowerCase()
        .includes(busca.toLowerCase());
    }
  );

  return (
    <div className="page">

      {/* CABEÇALHO */}

      <div className="page-header">

        <div>
          <h2>Treinos e preparações</h2>

          <p>
            Acompanhe os treinamentos e a preparação
            dos campi para as competições.
          </p>
        </div>

      </div>


      {/* BUSCA */}

      <div className="preparacoes-filtros">

        <div className="preparacoes-busca">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar evento ou campus..."
            value={busca}
            onChange={(e) =>
              setBusca(e.target.value)
            }
          />

        </div>

      </div>


      {/* ERRO */}

      {erro && (
        <div className="mensagem-erro">
          {erro}
        </div>
      )}


      {/* CARREGANDO / VAZIO */}

      {!erro && preparacoes.length === 0 && (
        <div className="preparacoes-vazio">

          <div className="preparacoes-vazio-icone">
            🏋️
          </div>

          <h3>
            Nenhuma preparação cadastrada
          </h3>

          <p>
            Quando uma preparação for cadastrada,
            ela aparecerá aqui.
          </p>

        </div>
      )}


      {/* RESULTADOS */}

      {preparacoesFiltradas.length > 0 && (

        <div className="preparacoes-grid">

          {preparacoesFiltradas.map(
            (preparacao) => {

              const evento =
                preparacao.evento?.titulo ||
                preparacao.eventoId;

              const campus =
                preparacao.campus?.nome ||
                preparacao.campusId;

              return (
                <div
                  className="treino-card"
                  key={preparacao.id}
                >

                  {/* TOPO */}

                  <div className="treino-topo">

                    <div className="treino-icone">
                      🏋️
                    </div>

                    <span className="treino-status">
                      Preparação
                    </span>

                  </div>


                  {/* TÍTULO */}

                  <h3>
                    {evento}
                  </h3>

                  <p className="treino-campus">
                    🏢 {campus}
                  </p>


                  {/* INFORMAÇÕES */}

                  <div className="treino-info">

                    <div>
                      <span>
                        Evento
                      </span>

                      <strong>
                        {evento}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Campus
                      </span>

                      <strong>
                        {campus}
                      </strong>
                    </div>

                  </div>


                  {/* ID */}

                  <div className="treino-responsavel">

                    <span>
                      Identificação
                    </span>

                    <strong>
                      #{preparacao.id}
                    </strong>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}


      {/* BUSCA SEM RESULTADO */}

      {preparacoes.length > 0 &&
        preparacoesFiltradas.length === 0 && (

          <div className="preparacoes-vazio">

            <div className="preparacoes-vazio-icone">
              🔎
            </div>

            <h3>
              Nenhuma preparação encontrada
            </h3>

            <p>
              Tente buscar por outro evento ou campus.
            </p>

          </div>
        )}

    </div>
  );
}

export default Preparacoes;