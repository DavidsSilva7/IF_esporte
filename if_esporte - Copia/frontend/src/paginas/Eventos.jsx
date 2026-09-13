import { useEffect, useState } from "react";

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/eventos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar eventos");
        }

        return res.json();
      })
      .then((dados) => {
        setEventos(dados);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error(erro);
        setErro("Não foi possível carregar os eventos.");
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return (
      <div className="page">
        <h2>Eventos</h2>
        <p>Carregando eventos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="page">
        <h2>Eventos</h2>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h2>Eventos esportivos</h2>
          <p>
            Confira os eventos, competições e atividades esportivas do IF Baiano.
          </p>
        </div>

        <button className="btn btn-primary">
          + Novo evento
        </button>
      </div>

      <div className="eventos-filtros">
        <input
          type="text"
          placeholder="Buscar evento..."
        />

        <select defaultValue="">
          <option value="">Todos os status</option>
          <option value="ABERTO">Abertos</option>
          <option value="PLANEJADO">Planejados</option>
          <option value="ENCERRADO">Encerrados</option>
          <option value="CANCELADO">Cancelados</option>
        </select>
      </div>

      {eventos.length === 0 ? (
        <div className="sem-eventos">
          <h3>Nenhum evento encontrado</h3>
          <p>Os eventos cadastrados aparecerão aqui.</p>
        </div>
      ) : (
        <div className="eventos-grid">

          {eventos.map((evento) => (
            <article className="evento-card" key={evento.id}>

              <div className="evento-imagem">
                <img
                  src={
                    evento.imagem ||
                    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
                  }
                  alt={evento.nome}
                />

                <span
                  className={`status status-${evento.situacao?.toLowerCase()}`}
                >
                  {evento.situacao || "PLANEJADO"}
                </span>
              </div>

              <div className="evento-card-conteudo">

                <h3>{evento.nome}</h3>

                <p className="evento-descricao">
                  {evento.descricao}
                </p>

                <div className="evento-info">
                  <span>📍 {evento.campus?.nome || "Campus não informado"}</span>

                  <span>
                    📅{" "}
                    {evento.periodo
                      ? evento.periodo
                      : "Período não informado"}
                  </span>
                </div>

                <button className="btn btn-secondary">
                  Ver detalhes
                </button>

              </div>

            </article>
          ))}

        </div>
      )}

    </div>
  );
}

export default Eventos;