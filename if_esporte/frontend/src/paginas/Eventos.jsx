import { useEffect, useState } from "react";

function Eventos() {
    const [eventos, setEventos] = useState([]);
    const [campi, setCampi] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(null);

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [local, setLocal] = useState("");
    const [campusId, setCampusId] = useState("");
    const [status, setStatus] = useState("PLANEJADO");

    const [mensagemFormulario, setMensagemFormulario] = useState("");
    const [salvando, setSalvando] = useState(false);

    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");

    const token = localStorage.getItem("token");

    let usuario = null;

    try {
        usuario = JSON.parse(
            localStorage.getItem("usuario") || "null"
        );
    } catch {
        usuario = null;
    }

    const role = usuario?.role;

    useEffect(() => {
        carregarEventos();
        carregarCampi();
    }, []);

    // =========================
    // CARREGAR EVENTOS
    // =========================

    async function carregarEventos() {
        try {
            setErro("");

            const resposta = await fetch(
                "http://localhost:3000/eventos"
            );

            if (!resposta.ok) {
                throw new Error("Erro ao buscar eventos.");
            }

            const dados = await resposta.json();

            setEventos(Array.isArray(dados) ? dados : []);
        } catch (erro) {
            console.error(erro);
            setErro(
                "Não foi possível carregar os eventos. Verifique se o backend está funcionando."
            );
        } finally {
            setCarregando(false);
        }
    }

    // =========================
    // CARREGAR CAMPI
    // =========================

    async function carregarCampi() {
        try {
            const resposta = await fetch(
                "http://localhost:3000/campus"
            );

            if (!resposta.ok) {
                throw new Error("Erro ao carregar os campi.");
            }

            const dados = await resposta.json();

            setCampi(Array.isArray(dados) ? dados : []);
        } catch (erro) {
            console.error(erro);
        }
    }

    // =========================
    // PERMISSÕES
    // =========================

    function podeCriarEvento() {
        return (
            role === "ADMIN" ||
            role === "ORGANIZADOR"
        );
    }

    function podeEditarEvento(evento) {
        if (!usuario) {
            return false;
        }

        // ADMIN pode editar qualquer evento
        if (role === "ADMIN") {
            return true;
        }

        // ORGANIZADOR pode editar seus próprios eventos
        if (role === "ORGANIZADOR") {
            const organizadorId =
                evento.organizadorId ??
                evento.usuarioId ??
                evento.criadoPorId;

            return (
                Number(organizadorId) ===
                Number(usuario.id)
            );
        }

        // VISITANTE não pode editar
        return false;
    }

    function podeExcluirEvento(evento) {
        if (!usuario) {
            return false;
        }

        // ADMIN pode excluir qualquer evento
        if (role === "ADMIN") {
            return true;
        }

        // ORGANIZADOR pode excluir seus próprios eventos
        if (role === "ORGANIZADOR") {
            const organizadorId =
                evento.organizadorId ??
                evento.usuarioId ??
                evento.criadoPorId;

            return (
                Number(organizadorId) ===
                Number(usuario.id)
            );
        }

        // VISITANTE não pode excluir
        return false;
    }

    // =========================
    // FORMULÁRIO
    // =========================

    function limparFormulario() {
        setTitulo("");
        setDescricao("");
        setDataInicio("");
        setDataFim("");
        setLocal("");
        setCampusId("");
        setStatus("PLANEJADO");
        setMensagemFormulario("");
        setEditando(null);
    }

    function abrirCadastro() {
        if (!podeCriarEvento()) {
            return;
        }

        limparFormulario();
        setMostrarFormulario(true);
    }

    function fecharFormulario() {
        limparFormulario();
        setMostrarFormulario(false);
    }

    // =========================
    // FORMATAR DATA
    // =========================

    function formatarDataParaInput(data) {
        if (!data) {
            return "";
        }

        const dataObj = new Date(data);

        if (Number.isNaN(dataObj.getTime())) {
            return "";
        }

        const ano = dataObj.getFullYear();
        const mes = String(
            dataObj.getMonth() + 1
        ).padStart(2, "0");

        const dia = String(
            dataObj.getDate()
        ).padStart(2, "0");

        const horas = String(
            dataObj.getHours()
        ).padStart(2, "0");

        const minutos = String(
            dataObj.getMinutes()
        ).padStart(2, "0");

        return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
    }

    // =========================
    // EDITAR EVENTO
    // =========================

    function editarEvento(evento) {
        if (!podeEditarEvento(evento)) {
            return;
        }

        setEditando(evento);

        setTitulo(evento.titulo || "");
        setDescricao(evento.descricao || "");

        setDataInicio(
            formatarDataParaInput(
                evento.dataInicio
            )
        );

        setDataFim(
            formatarDataParaInput(
                evento.dataFim
            )
        );

        setLocal(evento.local || "");

        setCampusId(
            evento.campusId
                ? String(evento.campusId)
                : ""
        );

        setStatus(
            evento.status || "PLANEJADO"
        );

        setMensagemFormulario("");
        setMostrarFormulario(true);
    }

    // =========================
    // SELECIONAR CAMPUS
    // =========================

    function selecionarCampus(valor) {
        setCampusId(valor);

        const campusSelecionado = campi.find(
            (campus) =>
                String(campus.id) ===
                String(valor)
        );

        if (campusSelecionado) {
            setLocal(
                campusSelecionado.cidade ||
                campusSelecionado.nome ||
                ""
            );
        }
    }

    // =========================
    // SALVAR EVENTO
    // =========================

    async function salvarEvento(event) {
        event.preventDefault();

        setMensagemFormulario("");

        if (!podeCriarEvento()) {
            setMensagemFormulario(
                "Você não possui permissão para realizar esta ação."
            );
            return;
        }

        if (
            !titulo.trim() ||
            !descricao.trim() ||
            !dataInicio ||
            !dataFim ||
            !local.trim() ||
            !campusId ||
            !status
        ) {
            setMensagemFormulario(
                "Todos os campos são obrigatórios."
            );
            return;
        }

        if (!token) {
            setMensagemFormulario(
                "Você precisa estar logado para realizar esta ação."
            );
            return;
        }

        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);

        if (fim < inicio) {
            setMensagemFormulario(
                "A data de término não pode ser anterior à data de início."
            );
            return;
        }

        if (
            editando &&
            !podeEditarEvento(editando)
        ) {
            setMensagemFormulario(
                "Você não possui permissão para editar este evento."
            );
            return;
        }

        setSalvando(true);

        try {
            const dadosEvento = {
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                dataInicio,
                dataFim,
                local: local.trim(),
                campusId: Number(campusId),
                status,
            };

            let resposta;

            // =========================
            // EDITAR
            // =========================

            if (editando) {
                resposta = await fetch(
                    `http://localhost:3000/eventos/${editando.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`,
                        },
                        body: JSON.stringify(
                            dadosEvento
                        ),
                    }
                );
            }

            // =========================
            // CRIAR
            // =========================

            else {
                resposta = await fetch(
                    "http://localhost:3000/eventos",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`,
                        },
                        body: JSON.stringify(
                            dadosEvento
                        ),
                    }
                );
            }

            const textoResposta =
                await resposta.text();

            let dados = {};

            try {
                dados = textoResposta
                    ? JSON.parse(textoResposta)
                    : {};
            } catch {
                dados = {};
            }

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem ||
                    dados.message ||
                    "Erro ao salvar evento."
                );
            }

            await carregarEventos();

            fecharFormulario();
        } catch (erro) {
            console.error(erro);

            setMensagemFormulario(
                erro.message ||
                "Não foi possível salvar o evento."
            );
        } finally {
            setSalvando(false);
        }
    }

    // =========================
    // EXCLUIR EVENTO
    // =========================

    async function excluirEvento(evento) {
        if (!podeExcluirEvento(evento)) {
            alert(
                "Você não possui permissão para excluir este evento."
            );
            return;
        }

        if (!token) {
            alert(
                "Você precisa estar logado para excluir um evento."
            );
            return;
        }

        const confirmar = window.confirm(
            `Deseja realmente excluir o evento "${evento.titulo}"?`
        );

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch(
                `http://localhost:3000/eventos/${evento.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const textoResposta =
                await resposta.text();

            let dados = {};

            try {
                dados = textoResposta
                    ? JSON.parse(textoResposta)
                    : {};
            } catch {
                dados = {};
            }

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem ||
                    dados.message ||
                    "Erro ao excluir evento."
                );
            }

            setEventos(
                (eventosAtuais) =>
                    eventosAtuais.filter(
                        (item) =>
                            item.id !== evento.id
                    )
            );
        } catch (erro) {
            console.error(erro);

            alert(
                erro.message ||
                "Não foi possível excluir o evento."
            );
        }
    }

    // =========================
    // FILTROS
    // =========================

    const eventosFiltrados = eventos.filter(
        (evento) => {
            const textoBusca =
                busca.trim().toLowerCase();

            const correspondeBusca =
                !textoBusca ||
                evento.titulo
                    ?.toLowerCase()
                    .includes(textoBusca) ||
                evento.descricao
                    ?.toLowerCase()
                    .includes(textoBusca) ||
                evento.campus?.nome
                    ?.toLowerCase()
                    .includes(textoBusca);

            const correspondeStatus =
                !filtroStatus ||
                evento.status === filtroStatus;

            return (
                correspondeBusca &&
                correspondeStatus
            );
        }
    );

    // =========================
    // CARREGAMENTO
    // =========================

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

                <button
                    className="btn btn-primary"
                    onClick={carregarEventos}
                >
                    Tentar novamente
                </button>
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
                    <h2>Eventos esportivos</h2>

                    <p>
                        Confira os eventos,
                        competições e atividades
                        esportivas do IF Baiano.
                    </p>
                </div>

                {podeCriarEvento() && (
                    <button
                        className="btn btn-primary"
                        onClick={abrirCadastro}
                    >
                        + Novo evento
                    </button>
                )}
            </div>

            {/* FILTROS */}

            <div className="eventos-filtros">

                <input
                    type="text"
                    placeholder="Buscar evento..."
                    value={busca}
                    onChange={(event) =>
                        setBusca(
                            event.target.value
                        )
                    }
                />

                <select
                    value={filtroStatus}
                    onChange={(event) =>
                        setFiltroStatus(
                            event.target.value
                        )
                    }
                >
                    <option value="">
                        Todos os status
                    </option>

                    <option value="ABERTO">
                        Abertos
                    </option>

                    <option value="PLANEJADO">
                        Planejados
                    </option>

                    <option value="ENCERRADO">
                        Encerrados
                    </option>

                    <option value="CANCELADO">
                        Cancelados
                    </option>
                </select>
            </div>

            {/* EVENTOS */}

            {eventosFiltrados.length === 0 ? (
                <div className="sem-eventos">

                    <h3>
                        Nenhum evento encontrado
                    </h3>

                    <p>
                        {eventos.length === 0
                            ? "Os eventos cadastrados aparecerão aqui."
                            : "Tente alterar os filtros da busca."
                        }
                    </p>

                </div>
            ) : (

                <div className="eventos-grid">

                    {eventosFiltrados.map(
                        (evento) => (

                            <article
                                className="evento-card"
                                key={evento.id}
                            >

                                {/* IMAGEM */}

                                <div className="evento-imagem">

                                    <img
                                        src={
                                            evento.imagem ||
                                            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
                                        }
                                        alt={
                                            evento.titulo
                                        }
                                    />

                                    <span
                                        className={
                                            `status status-${evento.status?.toLowerCase()}`
                                        }
                                    >
                                        {evento.status}
                                    </span>

                                </div>

                                {/* CONTEÚDO */}

                                <div className="evento-card-conteudo">

                                    <h3>
                                        {evento.titulo}
                                    </h3>

                                    <p className="evento-descricao">
                                        {evento.descricao}
                                    </p>

                                    <div className="evento-info">

                                        <span>
                                            📍{" "}
                                            {
                                                evento.campus?.nome ||
                                                "Campus não informado"
                                            }
                                        </span>

                                        <span>
                                            📅{" "}
                                            {evento.dataInicio
                                                ? new Date(
                                                    evento.dataInicio
                                                ).toLocaleDateString(
                                                    "pt-BR"
                                                )
                                                : "Data não informada"
                                            }
                                        </span>

                                    </div>

                                    {/* BOTÕES */}

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            marginTop: "15px",
                                            flexWrap: "wrap",
                                        }}
                                    >

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                alert(
                                                    `Evento: ${evento.titulo}\n\n${evento.descricao || "Sem descrição."}`
                                                )
                                            }
                                        >
                                            Ver detalhes
                                        </button>

                                        {/* EDITAR */}

                                        {podeEditarEvento(
                                            evento
                                        ) && (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() =>
                                                    editarEvento(
                                                        evento
                                                    )
                                                }
                                            >
                                                Editar
                                            </button>
                                        )}

                                        {/* EXCLUIR */}

                                        {podeExcluirEvento(
                                            evento
                                        ) && (
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    excluirEvento(
                                                        evento
                                                    )
                                                }
                                            >
                                                Excluir
                                            </button>
                                        )}

                                    </div>

                                </div>

                            </article>

                        )
                    )}

                </div>
            )}

            {/* =========================
                MODAL
            ========================= */}

            {mostrarFormulario && (
                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <h2>
                                {editando
                                    ? "Editar evento"
                                    : "Novo evento"
                                }
                            </h2>

                            <button
                                type="button"
                                onClick={
                                    fecharFormulario
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <form
                            onSubmit={
                                salvarEvento
                            }
                        >

                            {/* TÍTULO */}

                            <div className="login-campo">

                                <label>
                                    Título
                                </label>

                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(
                                        event
                                    ) =>
                                        setTitulo(
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* DESCRIÇÃO */}

                            <div className="login-campo">

                                <label>
                                    Descrição
                                </label>

                                <textarea
                                    value={descricao}
                                    onChange={(
                                        event
                                    ) =>
                                        setDescricao(
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* DATAS */}

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: "15px",
                                }}
                            >

                                <div className="login-campo">

                                    <label>
                                        Data de início
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={
                                            dataInicio
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setDataInicio(
                                                event.target
                                                    .value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <div className="login-campo">

                                    <label>
                                        Data de término
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={
                                            dataFim
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setDataFim(
                                                event.target
                                                    .value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>

                            {/* CAMPUS */}

                            <div className="login-campo">

                                <label>
                                    Campus
                                </label>

                                <select
                                    value={campusId}
                                    onChange={(
                                        event
                                    ) =>
                                        selecionarCampus(
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Selecione o campus
                                    </option>

                                    {campi.map(
                                        (campus) => (
                                            <option
                                                key={
                                                    campus.id
                                                }
                                                value={
                                                    campus.id
                                                }
                                            >
                                                {
                                                    campus.nome
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* LOCAL */}

                            <div className="login-campo">

                                <label>
                                    Local
                                </label>

                                <input
                                    type="text"
                                    value={local}
                                    onChange={(
                                        event
                                    ) =>
                                        setLocal(
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* STATUS */}

                            <div className="login-campo">

                                <label>
                                    Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(
                                        event
                                    ) =>
                                        setStatus(
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                >

                                    <option value="PLANEJADO">
                                        Planejado
                                    </option>

                                    <option value="ABERTO">
                                        Aberto
                                    </option>

                                    <option value="ENCERRADO">
                                        Encerrado
                                    </option>

                                    <option value="CANCELADO">
                                        Cancelado
                                    </option>

                                </select>

                            </div>

                            {/* ERRO */}

                            {mensagemFormulario && (
                                <div className="login-erro">
                                    {
                                        mensagemFormulario
                                    }
                                </div>
                            )}

                            {/* BOTÕES */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: "10px",
                                    marginTop: "20px",
                                }}
                            >

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={
                                        fecharFormulario
                                    }
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={
                                        salvando
                                    }
                                >
                                    {salvando
                                        ? "Salvando..."
                                        : editando
                                            ? "Salvar alterações"
                                            : "Cadastrar evento"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Eventos;