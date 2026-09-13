import prisma from "../lib/prisma.js";

async function listarModalidades(req, res) {
    try {
        const modalidades = await prisma.modalidade.findMany();

        res.json(modalidades);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar as modalidades."
        });
    }
}

async function criarModalidade(req, res) {
    try {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({
                mensagem: "O nome da modalidade é obrigatório."
            });
        }

        const modalidade = await prisma.modalidade.create({
            data: {
                nome
            }
        });

        res.status(201).json(modalidade);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2002") {
            return res.status(409).json({
                mensagem: "Essa modalidade já está cadastrada."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao cadastrar a modalidade."
        });
    }
}

async function atualizarModalidade(req, res) {
    try {
        const id = Number(req.params.id);

        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({
                mensagem: "Informe o nome da modalidade."
            });
        }

        const modalidade = await prisma.modalidade.update({
            where: {
                id: id
            },
            data: {
                nome
            }
        });

        res.json(modalidade);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Modalidade não encontrada."
            });
        }

        if (erro.code === "P2002") {
            return res.status(409).json({
                mensagem: "Essa modalidade já está cadastrada."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao atualizar a modalidade."
        });
    }
}

async function excluirModalidade(req, res) {
    try {
        const id = Number(req.params.id);

        await prisma.modalidade.delete({
            where: {
                id: id
            }
        });

        res.status(204).send();

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Modalidade não encontrada."
            });
        }

        if (erro.code === "P2003") {
            return res.status(409).json({
                mensagem: "Não é possível excluir esta modalidade, pois ela está vinculada a eventos."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao excluir a modalidade."
        });
    }
}

export {listarModalidades, criarModalidade, atualizarModalidade, excluirModalidade};