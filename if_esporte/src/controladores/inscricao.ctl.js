import prisma from "../lib/prisma.js";

async function listarInscricoes(req, res) {
    try {
        const inscricoes = await prisma.inscricao.findMany({
            include: {
                usuario: true,
                evento: true
            }
        });

        res.json(inscricoes);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar as inscrições."
        });
    }
}


async function criarInscricao(req, res) {
    try {
        const { usuarioId, eventoId } = req.body;

        if (usuarioId === undefined || eventoId === undefined) {
            return res.status(400).json({
                mensagem: "Usuário e evento são obrigatórios."
            });
        }

        const inscricao = await prisma.inscricao.create({
            data: {
                usuarioId: Number(usuarioId),
                eventoId: Number(eventoId)
            }
        });

        res.status(201).json(inscricao);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2002") {
            return res.status(409).json({
                mensagem: "O usuário já está inscrito neste evento."
            });
        }

        if (erro.code === "P2003") {
            return res.status(404).json({
                mensagem: "Usuário ou evento não encontrado."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao realizar a inscrição."
        });
    }
}


async function atualizarInscricao(req, res) {
    try {
        const id = Number(req.params.id);

        const { status } = req.body;

        if (status === undefined) {
            return res.status(400).json({
                mensagem: "Informe o status da inscrição."
            });
        }

        const inscricao = await prisma.inscricao.update({
            where: {
                id: id
            },
            data: {
                status
            }
        });

        res.json(inscricao);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Inscrição não encontrada."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao atualizar a inscrição."
        });
    }
}


async function excluirInscricao(req, res) {
    try {
        const id = Number(req.params.id);

        await prisma.inscricao.delete({
            where: {
                id: id
            }
        });

        res.status(204).send();

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Inscrição não encontrada."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao cancelar a inscrição."
        });
    }
}


export {
    listarInscricoes,
    criarInscricao,
    atualizarInscricao,
    excluirInscricao
};