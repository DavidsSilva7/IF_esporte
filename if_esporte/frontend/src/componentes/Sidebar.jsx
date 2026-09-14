import { NavLink } from "react-router-dom";

function Sidebar() {
    const usuario = JSON.parse(
        localStorage.getItem("usuario") || "null"
    );

    const visitante =
        localStorage.getItem("visitante") === "true";

    const role = visitante
        ? "VISITANTE"
        : usuario?.role || "VISITANTE";

    const podeGerenciar =
        role === "ADMIN" ||
        role === "ORGANIZADOR";

    const isAdmin = role === "ADMIN";

    return (
        <aside className="sidebar">
            <h1>IF ESPORTE</h1>

            <nav>
                {/* INÍCIO */}
                <NavLink to="/" end>
                    🏠 Início
                </NavLink>

                {/* PÁGINAS PÚBLICAS */}
                <NavLink to="/calendario">
                    📅 Calendário
                </NavLink>

                <NavLink to="/eventos">
                    🏆 Eventos
                </NavLink>

                <NavLink to="/campi">
                    🏫 Campi
                </NavLink>

                <NavLink to="/modalidades">
                    ⚽ Modalidades
                </NavLink>

                {/* INSCRIÇÕES
                    Visitante não pode acessar
                */}
                {role !== "VISITANTE" && (
                    <NavLink to="/inscricoes">
                        📝 Inscrições
                    </NavLink>
                )}

                {/* GERENCIAMENTO */}
                {podeGerenciar && (
                    <>
                        <NavLink to="/preparacoes">
                            🏋️ Preparações
                        </NavLink>

                        <NavLink to="/partidas">
                            🏟️ Partidas
                        </NavLink>

                        <NavLink to="/classificacao">
                            🥇 Classificação
                        </NavLink>
                    </>
                )}

                {/* ADMINISTRADOR */}
                {isAdmin && (
                    <NavLink to="/usuarios">
                        👥 Usuários
                    </NavLink>
                )}
            </nav>
        </aside>
    );
}

export default Sidebar;