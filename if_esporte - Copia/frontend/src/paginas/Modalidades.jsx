import { useEffect, useState } from "react";

function Modalidades() {
  const [modalidades, setModalidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/modalidades")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar modalidades");
        }

        return res.json();
      })
      .then((dados) => {
        setModalidades(dados);
        setCarregando(false);
      })
      .catch((error) => {
        console.error(error);
        setErro("Não foi possível carregar as modalidades.");
        setCarregando(false);
      });
  }, []);

  return (
    <section className="pagina">

      <div className="pagina-header">
        <div>
          <h1>Modalidades</h1>
          <p>
            Confira as modalidades esportivas disponíveis nos eventos do
            IF Baiano.
          </p>
        </div>
      </div>

      {carregando && (
        <p className="mensagem">Carregando modalidades...</p>
      )}

      {erro && (
        <p className="mensagem erro">{erro}</p>
      )}

      {!carregando && !erro && (
        <div className="cards-modalidades">

          {modalidades.map((modalidade) => (
            <article
              className="card-modalidade"
              key={modalidade.id}
            >

              <div className="modalidade-icone">
                🏆
              </div>

              <div className="modalidade-conteudo">
                <h2>{modalidade.nome}</h2>

                {modalidade.descricao && (
                  <p>{modalidade.descricao}</p>
                )}

                <button className="btn btn-secondary">
                  Ver detalhes
                </button>
              </div>

            </article>
          ))}

        </div>
      )}

      {!carregando && !erro && modalidades.length === 0 && (
        <div className="estado-vazio">
          <h2>Nenhuma modalidade cadastrada</h2>

          <p>
            As modalidades cadastradas pela API aparecerão aqui.
          </p>
        </div>
      )}

    </section>
  );
}

export default Modalidades;