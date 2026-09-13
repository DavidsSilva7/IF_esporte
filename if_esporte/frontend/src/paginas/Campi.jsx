import { useEffect, useState } from "react";

function Campi() {
  const [campi, setCampi] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/campus")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar os campi");
        }

        return res.json();
      })
      .then((dados) => {
        setCampi(dados);
        setCarregando(false);
      })
      .catch((error) => {
        console.error(error);
        setErro("Não foi possível carregar os campi.");
        setCarregando(false);
      });
  }, []);

  return (
    <section className="pagina">
      <div className="pagina-header">
        <div>
          <h1>Campi</h1>
          <p>
            Conheça os campi participantes das atividades esportivas do IF
            Baiano.
          </p>
        </div>
      </div>

      {carregando && <p className="mensagem">Carregando campi...</p>}

      {erro && <p className="mensagem erro">{erro}</p>}

      {!carregando && !erro && (
        <div className="cards-campi">
          {campi.map((campus) => (
            <article className="card-campus" key={campus.id}>
              <div className="card-campus-imagem">
                <img
                  src={
                    campus.imagem ||
                    "https://images.unsplash.com/photo-1562774053-701939374585"
                  }
                  alt={`Campus ${campus.nome}`}
                />
              </div>

              <div className="card-campus-conteudo">
                <h2>{campus.nome}</h2>
                <p>
                  <strong>Localização:</strong>{" "}
                  {campus.cidade || "Não informada"}
                </p>
                {campus.descricao && <p>{campus.descricao}</p>}
                <button className="btn btn-secondary">
                  Ver detalhes
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {!carregando && !erro && campi.length === 0 && (
        <div className="estado-vazio">
          <h2>Nenhum campus cadastrado</h2>
          <p>
            Os campi cadastrados pela API aparecerão aqui.
          </p>
        </div>
      )}
    </section>
  );
}

export default Campi;