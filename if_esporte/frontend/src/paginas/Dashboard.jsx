import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
    const [eventos, setEventos] = useState([]);
    const [campi, setCampi] = useState([]);
    const [carregandoEventos, setCarregandoEventos] = useState(true);
    const [carregandoCampi, setCarregandoCampi] = useState(true);
    const [erroEventos, setErroEventos] = useState("");
    const [erroCampi, setErroCampi] = useState("");

    useEffect(() => {
        carregarEventos();
        carregarCampi();
    }, []);

    async function carregarEventos() {
        setCarregandoEventos(true);
        setErroEventos("");

        try {
            const resposta = await fetch(
                "http://localhost:3000/eventos"
            );

            if (!resposta.ok) {
                throw new Error("Erro ao carregar eventos.");
            }

            const dados = await resposta.json();

            const lista = Array.isArray(dados)
                ? dados
                : Array.isArray(dados.eventos)
                ? dados.eventos
                : [];

            const eventosOrdenados = [...lista].sort(
                (a, b) => {
                    const dataA = new Date(a.dataInicio).getTime();
                    const dataB = new Date(b.dataInicio).getTime();

                    return dataA - dataB;
                }
            );

            setEventos(eventosOrdenados.slice(0, 3));
        } catch (erro) {
            console.error("Erro ao carregar eventos:", erro);
            setErroEventos(
                "Não foi possível carregar os eventos."
            );
            setEventos([]);
        } finally {
            setCarregandoEventos(false);
        }
    }

    async function carregarCampi() {
        setCarregandoCampi(true);
        setErroCampi("");

        try {
            const resposta = await fetch(
                "http://localhost:3000/campus"
            );

            if (!resposta.ok) {
                throw new Error("Erro ao carregar campus.");
            }

            const dados = await resposta.json();

            const lista = Array.isArray(dados)
                ? dados
                : Array.isArray(dados.campi)
                ? dados.campi
                : [];

            setCampi(lista.slice(0, 4));
        } catch (erro) {
            console.error("Erro ao carregar campus:", erro);
            setErroCampi(
                "Não foi possível carregar os campi."
            );
            setCampi([]);
        } finally {
            setCarregandoCampi(false);
        }
    }

    function formatarData(data) {
        if (!data) {
            return "Data não informada";
        }

        const dataObj = new Date(data);

        if (Number.isNaN(dataObj.getTime())) {
            return "Data não informada";
        }

        return dataObj.toLocaleDateString("pt-BR");
    }

    function obterStatus(status) {
        const statusFormatado = {
            PLANEJADO: "Planejado",
            ABERTO: "Aberto",
            ENCERRADO: "Encerrado",
            CANCELADO: "Cancelado",
        };

        return (
            statusFormatado[status] ||
            status ||
            "Não informado"
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h2>IF Esporte</h2>

                <p>
                    Acompanhe eventos, competições e atividades
                    esportivas do IF Baiano.
                </p>
            </header>

            {/* DESTAQUE + CALENDÁRIO */}
            <section className="dashboard-grid">
                <div className="destaque">
                    <img
                        src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
                        alt="Evento esportivo"
                    />

                    <div className="destaque-conteudo">
                        <h2>IF Esporte</h2>

                        <p>
                            Plataforma para acompanhar eventos e
                            atividades esportivas do IF Baiano.
                        </p>

                        <Link
                            to="/eventos"
                            className="btn btn-primary"
                        >
                            Ver eventos
                        </Link>
                    </div>
                </div>

                {/* CALENDÁRIO */}
                <div className="calendario">
                    <div className="calendario-cabecalho">
                        <button
                            type="button"
                            aria-label="Mês anterior"
                        >
                            ‹
                        </button>

                        <h2>Setembro 2026</h2>

                        <button
                            type="button"
                            aria-label="Próximo mês"
                        >
                            ›
                        </button>
                    </div>

                    <div className="dias-semana">
                        <span>DOM</span>
                        <span>SEG</span>
                        <span>TER</span>
                        <span>QUA</span>
                        <span>QUI</span>
                        <span>SEX</span>
                        <span>SÁB</span>
                    </div>

                    <div className="grade-calendario">
                        {Array.from(
                            { length: 30 },
                            (_, index) => (
                                <div
                                    className="dia"
                                    key={index}
                                >
                                    <strong>
                                        {index + 1}
                                    </strong>

                                    {index === 15 && (
                                        <div className="evento-calendario">
                                            JAIF
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>

                    <Link
                        to="/calendario"
                        className="btn btn-secondary"
                    >
                        Ver calendário completo
                    </Link>
                </div>
            </section>

            {/* PRÓXIMOS EVENTOS */}
            <section className="secao">
                <div className="secao-header">
                    <h2>Próximos eventos</h2>

                    <Link to="/eventos">
                        Ver todos
                    </Link>
                </div>

                {carregandoEventos ? (
                    <div className="cards">
                        <p>Carregando eventos...</p>
                    </div>
                ) : erroEventos ? (
                    <div className="cards">
                        <p>{erroEventos}</p>
                    </div>
                ) : eventos.length === 0 ? (
                    <div className="cards">
                        <p>Nenhum evento cadastrado.</p>
                    </div>
                ) : (
                    <div className="cards">
                        {eventos.map((evento) => (
                            <div
                                className="card"
                                key={evento.id}
                            >
                                <img
                                    src={
                                        evento.imagem ||
                                        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
                                    }
                                    alt={
                                        evento.titulo ||
                                        "Evento esportivo"
                                    }
                                />

                                <div className="card-conteudo">
                                    <h3>
                                        {evento.titulo ||
                                            "Evento sem título"}
                                    </h3>

                                    <p>
                                        {evento.descricao ||
                                            "Sem descrição disponível."}
                                    </p>

                                    <p>
                                        📅{" "}
                                        {formatarData(
                                            evento.dataInicio
                                        )}
                                    </p>

                                    {evento.campus && (
                                        <p>
                                            📍{" "}
                                            {evento.campus
                                                .nome ||
                                                "Campus não informado"}
                                        </p>
                                    )}

                                    {evento.status && (
                                        <p>
                                            📌{" "}
                                            {obterStatus(
                                                evento.status
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CAMPI */}
            <section className="secao">
                <div className="secao-header">
                    <h2>Campi</h2>

                    <Link to="/campi">
                        Ver todos
                    </Link>
                </div>

                {carregandoCampi ? (
                    <div className="cards-campi">
                        <p>Carregando campi...</p>
                    </div>
                ) : erroCampi ? (
                    <div className="cards-campi">
                        <p>{erroCampi}</p>
                    </div>
                ) : campi.length === 0 ? (
                    <div className="cards-campi">
                        <p>Nenhum campus cadastrado.</p>
                    </div>
                ) : (
                    <div className="cards-campi">
                        {campi.map((campus) => (
                            <div
                                className="card-campus"
                                key={campus.id}
                            >
                                <img
                                    src={
                                        campus.imagem ||
                                        "https://images.unsplash.com/photo-1562774053-701939374585"
                                    }
                                    alt={
                                        campus.nome ||
                                        "Campus do IF Baiano"
                                    }
                                />

                                <div className="card-campus-conteudo">
                                    <h3>
                                        {campus.nome ||
                                            "Campus"}
                                    </h3>

                                    <p>
                                        {campus.cidade
                                            ? `${campus.cidade} - BA`
                                            : "Localização não informada"}
                                    </p>

                                    {campus.sigla && (
                                        <small>
                                            {campus.sigla}
                                        </small>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* MODALIDADES */}
            <section className="secao">
                <div className="secao-header">
                    <h2>Modalidades</h2>

                    <Link to="/modalidades">
                        Ver todas
                    </Link>
                </div>

                <div className="cards-modalidades">
                    <div className="card-modalidade">
                        <div>⚽</div>
                        <h3>Futebol</h3>
                    </div>

                    <div className="card-modalidade">
                        <div>🏀</div>
                        <h3>Basquete</h3>
                    </div>

                    <div className="card-modalidade">
                        <div>🏐</div>
                        <h3>Vôlei</h3>
                    </div>

                    <div className="card-modalidade">
                        <div>🏓</div>
                        <h3>Tênis de Mesa</h3>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;