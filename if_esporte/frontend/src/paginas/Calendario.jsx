import { useEffect, useMemo, useState } from "react";

function Calendario() {
    const [eventos, setEventos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [mesAtual, setMesAtual] = useState(new Date());
    const [eventoSelecionado, setEventoSelecionado] = useState(null);

    const token = localStorage.getItem("token");

    // =========================
    // CARREGAR EVENTOS
    // =========================

    useEffect(() => {
        carregarEventos();
    }, []);

    async function carregarEventos() {
        setCarregando(true);
        setErro("");

        try {
            const resposta = await fetch("http://localhost:3000/eventos");

            if (!resposta.ok) {
                throw new Error("Erro ao buscar eventos.");
            }

            const dados = await resposta.json();

            setEventos(Array.isArray(dados) ? dados : []);
        } catch (erro) {
            console.error(erro);
            setErro("Não foi possível carregar os eventos.");
        } finally {
            setCarregando(false);
        }
    }

    // =========================
    // FORMATAÇÃO
    // =========================

    function formatarData(data) {
        if (!data) return "";

        return new Date(data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    function formatarHora(data) {
        if (!data) return "";

        return new Date(data).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function obterDataInicio(evento) {
        return evento.dataInicio || evento.data_inicio;
    }

    function obterDataFim(evento) {
        return evento.dataFim || evento.data_fim;
    }

    function obterNomeCampus(evento) {
        return (
            evento.campus?.nome ||
            evento.campusNome ||
            "Campus não informado"
        );
    }

    function obterTitulo(evento) {
        return evento.titulo || evento.nome || "Evento sem título";
    }

    // =========================
    // MÊS / CALENDÁRIO
    // =========================

    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    const diasNoMes = ultimoDia.getDate();

    // Domingo = 0
    const primeiroDiaSemana = primeiroDia.getDay();

    const diasCalendario = useMemo(() => {
        const dias = [];

        for (let i = 0; i < primeiroDiaSemana; i++) {
            dias.push(null);
        }

        for (let dia = 1; dia <= diasNoMes; dia++) {
            dias.push(new Date(ano, mes, dia));
        }

        while (dias.length % 7 !== 0) {
            dias.push(null);
        }

        return dias;
    }, [ano, mes, diasNoMes, primeiroDiaSemana]);

    const nomeMes = mesAtual.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    });

    function mesAnterior() {
        setMesAtual(new Date(ano, mes - 1, 1));
    }

    function mesProximo() {
        setMesAtual(new Date(ano, mes + 1, 1));
    }

    function voltarParaHoje() {
        setMesAtual(new Date());
    }

    // =========================
    // EVENTOS DO DIA
    // =========================

    function eventosDoDia(data) {
        if (!data) return [];

        return eventos.filter((evento) => {
            const inicio = obterDataInicio(evento);
            const fim = obterDataFim(evento);

            if (!inicio) return false;

            const dataInicioEvento = new Date(inicio);
            const dataFimEvento = fim
                ? new Date(fim)
                : dataInicioEvento;

            const inicioDia = new Date(
                data.getFullYear(),
                data.getMonth(),
                data.getDate()
            );

            const fimDia = new Date(
                data.getFullYear(),
                data.getMonth(),
                data.getDate(),
                23,
                59,
                59
            );

            return (
                dataInicioEvento <= fimDia &&
                dataFimEvento >= inicioDia
            );
        });
    }

    function ehHoje(data) {
        if (!data) return false;

        const hoje = new Date();

        return (
            data.getDate() === hoje.getDate() &&
            data.getMonth() === hoje.getMonth() &&
            data.getFullYear() === hoje.getFullYear()
        );
    }

    // =========================
    // STATUS
    // =========================

    function textoStatus(status) {
        switch (status) {
            case "ABERTO":
                return "Aberto";

            case "PLANEJADO":
                return "Planejado";

            case "ENCERRADO":
                return "Encerrado";

            case "CANCELADO":
                return "Cancelado";

            default:
                return status || "Não informado";
        }
    }

    function classeStatus(status) {
        return `status status-${String(
            status || ""
        ).toLowerCase()}`;
    }

    // =========================
    // EVENTO SELECIONADO
    // =========================

    function abrirEvento(evento) {
        setEventoSelecionado(evento);
    }

    function fecharEvento() {
        setEventoSelecionado(null);
    }

    // =========================
    // CARREGANDO
    // =========================

    if (carregando) {
        return (
            <div className="page">
                <div className="page-header">
                    <div>
                        <h2>Calendário</h2>
                        <p>
                            Consulte as datas dos eventos esportivos do
                            IF Baiano.
                        </p>
                    </div>
                </div>

                <div className="sem-eventos">
                    <h3>Carregando calendário...</h3>
                    <p>Buscando os eventos cadastrados.</p>
                </div>
            </div>
        );
    }

    // =========================
    // ERRO
    // =========================

    if (erro) {
        return (
            <div className="page">
                <div className="page-header">
                    <div>
                        <h2>Calendário</h2>
                        <p>
                            Consulte as datas dos eventos esportivos do
                            IF Baiano.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={carregarEventos}
                    >
                        Tentar novamente
                    </button>
                </div>

                <div className="sem-eventos">
                    <h3>Não foi possível carregar o calendário</h3>
                    <p>{erro}</p>
                </div>
            </div>
        );
    }

    // =========================
    // INTERFACE
    // =========================

    return (
        <div className="page">
            {/* CABEÇALHO */}
            <div className="page-header">
                <div>
                    <h2>Calendário esportivo</h2>

                    <p>
                        Consulte as datas dos eventos, competições e
                        atividades esportivas do IF Baiano.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={carregarEventos}
                >
                    Atualizar
                </button>
            </div>

            {/* CONTROLES DO CALENDÁRIO */}
            <div
                className="calendario-controles"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "15px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={mesAnterior}
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={mesProximo}
                    >
                        →
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={voltarParaHoje}
                    >
                        Hoje
                    </button>
                </div>

                <h2
                    style={{
                        margin: 0,
                        textTransform: "capitalize",
                    }}
                >
                    {nomeMes}
                </h2>

                <div>
                    <span
                        style={{
                            fontSize: "14px",
                            color: "#666",
                        }}
                    >
                        {eventos.length}{" "}
                        {eventos.length === 1
                            ? "evento cadastrado"
                            : "eventos cadastrados"}
                    </span>
                </div>
            </div>

            {/* CALENDÁRIO */}
            <div
                className="calendario"
                style={{
                    background: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                }}
            >
                {/* DIAS DA SEMANA */}
                <div
                    className="calendario-semana"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(7, 1fr)",
                        background: "#f8fafc",
                        borderBottom:
                            "1px solid #e5e7eb",
                    }}
                >
                    {[
                        "Dom",
                        "Seg",
                        "Ter",
                        "Qua",
                        "Qui",
                        "Sex",
                        "Sáb",
                    ].map((dia) => (
                        <div
                            key={dia}
                            style={{
                                padding: "12px 8px",
                                textAlign: "center",
                                fontWeight: "600",
                                fontSize: "14px",
                                color: "#475569",
                            }}
                        >
                            {dia}
                        </div>
                    ))}
                </div>

                {/* DIAS */}
                <div
                    className="calendario-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(7, 1fr)",
                    }}
                >
                    {diasCalendario.map((data, index) => {
                        const eventosDia =
                            eventosDoDia(data);

                        return (
                            <div
                                key={`${data?.toISOString() || "vazio"}-${index}`}
                                className="calendario-dia"
                                style={{
                                    minHeight: "130px",
                                    padding: "8px",
                                    borderRight:
                                        "1px solid #e5e7eb",
                                    borderBottom:
                                        "1px solid #e5e7eb",
                                    background: data
                                        ? "#fff"
                                        : "#f8fafc",
                                }}
                            >
                                {data && (
                                    <>
                                        {/* NÚMERO DO DIA */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "flex-end",
                                                marginBottom:
                                                    "6px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    width:
                                                        "30px",
                                                    height:
                                                        "30px",
                                                    borderRadius:
                                                        "50%",
                                                    background:
                                                        ehHoje(
                                                            data
                                                        )
                                                            ? "#2563eb"
                                                            : "transparent",
                                                    color:
                                                        ehHoje(
                                                            data
                                                        )
                                                            ? "#fff"
                                                            : "#334155",
                                                    fontWeight:
                                                        ehHoje(
                                                            data
                                                        )
                                                            ? "700"
                                                            : "500",
                                                }}
                                            >
                                                {data.getDate()}
                                            </span>
                                        </div>

                                        {/* EVENTOS */}
                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
                                                gap: "5px",
                                            }}
                                        >
                                            {eventosDia
                                                .slice(
                                                    0,
                                                    3
                                                )
                                                .map(
                                                    (
                                                        evento
                                                    ) => (
                                                        <button
                                                            key={
                                                                evento.id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                abrirEvento(
                                                                    evento
                                                                )
                                                            }
                                                            style={{
                                                                width:
                                                                    "100%",
                                                                border:
                                                                    "none",
                                                                borderRadius:
                                                                    "6px",
                                                                padding:
                                                                    "6px 7px",
                                                                textAlign:
                                                                    "left",
                                                                cursor:
                                                                    "pointer",
                                                                background:
                                                                    "#eff6ff",
                                                                color:
                                                                    "#1e40af",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "600",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                            title={
                                                                obterTitulo(
                                                                    evento
                                                                )
                                                            }
                                                        >
                                                            {obterTitulo(
                                                                evento
                                                            )}
                                                        </button>
                                                    )
                                                )}

                                            {eventosDia.length >
                                                3 && (
                                                <span
                                                    style={{
                                                        fontSize:
                                                            "11px",
                                                        color:
                                                            "#64748b",
                                                        padding:
                                                            "2px 5px",
                                                    }}
                                                >
                                                    +
                                                    {eventosDia.length -
                                                        3}{" "}
                                                    evento
                                                    {eventosDia.length -
                                                        3 >
                                                    1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* LEGENDA */}
            <div
                style={{
                    display: "flex",
                    gap: "18px",
                    flexWrap: "wrap",
                    marginTop: "18px",
                    padding: "15px",
                    background: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                }}
            >
                <strong
                    style={{
                        fontSize: "14px",
                    }}
                >
                    Status:
                </strong>

                <span
                    style={{
                        fontSize: "14px",
                    }}
                >
                    🟢 Aberto
                </span>

                <span
                    style={{
                        fontSize: "14px",
                    }}
                >
                    🔵 Planejado
                </span>

                <span
                    style={{
                        fontSize: "14px",
                    }}
                >
                    ⚫ Encerrado
                </span>

                <span
                    style={{
                        fontSize: "14px",
                    }}
                >
                    🔴 Cancelado
                </span>
            </div>

            {/* MODAL DE DETALHES */}
            {eventoSelecionado && (
                <div
                    className="modal-overlay"
                    onClick={fecharEvento}
                >
                    <div
                        className="modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <h2>
                                {obterTitulo(
                                    eventoSelecionado
                                )}
                            </h2>

                            <button
                                type="button"
                                onClick={fecharEvento}
                            >
                                ✕
                            </button>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            <div>
                                <strong>
                                    Status
                                </strong>

                                <div
                                    style={{
                                        marginTop:
                                            "6px",
                                    }}
                                >
                                    <span
                                        className={classeStatus(
                                            eventoSelecionado.status
                                        )}
                                    >
                                        {textoStatus(
                                            eventoSelecionado.status
                                        )}
                                    </span>
                                </div>
                            </div>

                            {eventoSelecionado.descricao && (
                                <div>
                                    <strong>
                                        Descrição
                                    </strong>

                                    <p
                                        style={{
                                            marginTop:
                                                "6px",
                                            marginBottom:
                                                0,
                                        }}
                                    >
                                        {
                                            eventoSelecionado.descricao
                                        }
                                    </p>
                                </div>
                            )}

                            <div>
                                <strong>
                                    📅 Data
                                </strong>

                                <p
                                    style={{
                                        marginTop:
                                            "6px",
                                        marginBottom: 0,
                                    }}
                                >
                                    {formatarData(
                                        obterDataInicio(
                                            eventoSelecionado
                                        )
                                    )}

                                    {obterDataFim(
                                        eventoSelecionado
                                    ) && (
                                        <>
                                            {" "}
                                            até{" "}
                                            {formatarData(
                                                obterDataFim(
                                                    eventoSelecionado
                                                )
                                            )}
                                        </>
                                    )}
                                </p>
                            </div>

                            <div>
                                <strong>
                                    🕐 Horário
                                </strong>

                                <p
                                    style={{
                                        marginTop:
                                            "6px",
                                        marginBottom: 0,
                                    }}
                                >
                                    {formatarHora(
                                        obterDataInicio(
                                            eventoSelecionado
                                        )
                                    )}

                                    {obterDataFim(
                                        eventoSelecionado
                                    ) && (
                                        <>
                                            {" "}
                                            até{" "}
                                            {formatarHora(
                                                obterDataFim(
                                                    eventoSelecionado
                                                )
                                            )}
                                        </>
                                    )}
                                </p>
                            </div>

                            <div>
                                <strong>
                                    📍 Campus
                                </strong>

                                <p
                                    style={{
                                        marginTop:
                                            "6px",
                                        marginBottom: 0,
                                    }}
                                >
                                    {obterNomeCampus(
                                        eventoSelecionado
                                    )}
                                </p>
                            </div>

                            {eventoSelecionado.local && (
                                <div>
                                    <strong>
                                        Local
                                    </strong>

                                    <p
                                        style={{
                                            marginTop:
                                                "6px",
                                            marginBottom:
                                                0,
                                        }}
                                    >
                                        {
                                            eventoSelecionado.local
                                        }
                                    </p>
                                </div>
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    marginTop:
                                        "10px",
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={
                                        fecharEvento
                                    }
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calendario;