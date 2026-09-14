import { NavLink } from "react-router-dom";

function Sidebar() {
    let usuario = null;

    try {
        usuario = JSON.parse(
            localStorage.getItem("usuario") || "null"
        );
    } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
    }

    const role = usuario?.role || "VISITANTE";

    const isAdmin = role === "ADMIN";
    const isOrganizador = role === "ORGANIZADOR";
    const isRepresentante = role === "REPRESENTANTE";

    const podeGerenciar =
        isAdmin || isOrganizador;

    const podeAcessarInscricoes =
        isAdmin ||
        isOrganizador ||
        isRepresentante;

    return (
        <aside className="sidebar">

            {/* LOGO */}
            <div className="sidebar-logo">
                <h1>IF ESPORTE</h1>
                <span>Plataforma Esportiva</span>
            </div>

            {/* USUÁRIO */}
            <div className="sidebar-usuario">
                <div className="sidebar-avatar">
                    {usuario?.nome
                        ? usuario.nome.charAt(0).toUpperCase()
                        : "V"}
                </div>

                <div className="sidebar-usuario-info">
                    <strong>
                        {usuario?.nome || "Visitante"}
                    </strong>

                    <small>
                        {role === "ADMIN"
                            ? "Administrador"
                            : role === "ORGANIZADOR"
                            ? "Organizador"
                            : role === "REPRESENTANTE"
                            ? "Representante"
                            : "Visitante"}
                    </small>
                </div>
            </div>

            {/* MENU */}
            <nav className="sidebar-menu">

                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    🏠
                    <span>Início</span>
                </NavLink>

                <NavLink
                    to="/calendario"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    📅
                    <span>Calendário</span>
                </NavLink>

                <NavLink
                    to="/eventos"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    🏆
                    <span>Eventos</span>
                </NavLink>

                <NavLink
                    to="/campi"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    🏫
                    <span>Campi</span>
                </NavLink>

                <NavLink
                    to="/modalidades"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    ⚽
                    <span>Modalidades</span>
                </NavLink>

                {/* INSCRIÇÕES */}
                {podeAcessarInscricoes && (
                    <NavLink
                        to="/inscricoes"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        📝
                        <span>Inscrições</span>
                    </NavLink>
                )}

                {/* ÁREA DE GERENCIAMENTO */}
                {podeGerenciar && (
                    <>
                        <div className="sidebar-separador">
                            <span>GERENCIAMENTO</span>
                        </div>

                        <NavLink
                            to="/preparacoes"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            🏋️
                            <span>Preparações</span>
                        </NavLink>

                        <NavLink
                            to="/partidas"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            🏟️
                            <span>Partidas</span>
                        </NavLink>

                        <NavLink
                            to="/classificacao"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            🥇
                            <span>Classificação</span>
                        </NavLink>
                    </>
                )}

                {/* ADMINISTRAÇÃO */}
                {isAdmin && (
                    <>
                        <div className="sidebar-separador">
                            <span>ADMINISTRAÇÃO</span>
                        </div>

                        <NavLink
                            to="/usuarios"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            👥
                            <span>Usuários</span>
                        </NavLink>
                    </>
                )}

            </nav>

            {/* RODAPÉ */}
            <div className="sidebar-footer">
                <small>
                    IF Baiano
                </small>
            </div>

        </aside>
    );
}

export default Sidebar;