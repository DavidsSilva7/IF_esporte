import { useEffect, useState } from "react";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function carregarUsuarios() {
        setCarregando(true);
        setErro("");

        try {
            const token = localStorage.getItem("token");

            const resposta = await fetch("http://localhost:3000/usuarios", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem || "Erro ao carregar usuários."
                );
            }

            setUsuarios(dados);
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível carregar os usuários.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    async function alterarRole(id, novaRole) {
        setErro("");
        setMensagem("");

        try {
            const token = localStorage.getItem("token");

            const resposta = await fetch(
                `http://localhost:3000/usuarios/${id}/role`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        role: novaRole,
                    }),
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem ||
                        dados.Mensagem ||
                        "Erro ao alterar a função."
                );
            }

            setUsuarios((usuariosAtuais) =>
                usuariosAtuais.map((usuario) =>
                    usuario.id === id
                        ? { ...usuario, role: novaRole }
                        : usuario
                )
            );

            setMensagem("Função do usuário alterada com sucesso.");
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível alterar a função.");
        }
    }

    async function excluirUsuario(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este usuário?"
        );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {
            const token = localStorage.getItem("token");

            const resposta = await fetch(
                `http://localhost:3000/usuarios/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!resposta.ok) {
                const dados = await resposta.json();

                throw new Error(
                    dados.mensagem ||
                        dados.Mensagem ||
                        "Erro ao excluir usuário."
                );
            }

            setUsuarios((usuariosAtuais) =>
                usuariosAtuais.filter((usuario) => usuario.id !== id)
            );

            setMensagem("Usuário excluído com sucesso.");
        } catch (error) {
            console.error(error);
            setErro(error.message || "Não foi possível excluir o usuário.");
        }
    }

    function nomeRole(role) {
        switch (role) {
            case "ADMIN":
                return "Administrador";

            case "ORGANIZADOR":
                return "Organizador";

            case "REPRESENTANTE":
                return "Representante";

            default:
                return role;
        }
    }

    return (
        <div className="page">
            <div className="secao-header">
                <div>
                    <h2>Usuários</h2>
                    <p>
                        Gerencie os usuários e as funções de acesso ao sistema.
                    </p>
                </div>
            </div>

            {erro && (
                <div className="auth-error">
                    {erro}
                </div>
            )}

            {mensagem && (
                <div className="mensagem-sucesso">
                    {mensagem}
                </div>
            )}

            {carregando ? (
                <p>Carregando usuários...</p>
            ) : usuarios.length === 0 ? (
                <p>Nenhum usuário cadastrado.</p>
            ) : (
                <div className="tabela-container">
                    <table className="tabela-usuarios">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Função</th>
                                <th>Campus</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>

                                    <td>{usuario.nome}</td>

                                    <td>{usuario.email}</td>

                                    <td>
                                        <select
                                            value={usuario.role}
                                            onChange={(event) =>
                                                alterarRole(
                                                    usuario.id,
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <option value="ADMIN">
                                                Administrador
                                            </option>

                                            <option value="ORGANIZADOR">
                                                Organizador
                                            </option>

                                            <option value="REPRESENTANTE">
                                                Representante
                                            </option>
                                        </select>
                                    </td>

                                    <td>
                                        {usuario.campus?.nome || "Não informado"}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                excluirUsuario(usuario.id)
                                            }
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Usuarios;