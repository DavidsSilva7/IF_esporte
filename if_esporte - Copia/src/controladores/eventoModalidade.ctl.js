import prisma from "../lib/prisma.js";

async function ltMdlEvento(req, res) {
    try {
        const eventoId = Number(req.params.eventoId);

        const modalidades = await prisma.eventoModalidade.findMany({
            where: { eventoId: eventoId },
            include: { modalidade: true }
        });

        res.json(modalidades);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao buscar as modalidades do evento." });
    }
}

async function adcMdlEvento(req, res) {
    try {
        const eventoId = Number(req.params.eventoId);
        const { modalidadeId } = req.body;

        if (modalidadeId === undefined) {
            return res.status(400).json({ mensagem: "O modalidadeId é obrigatório."});
        }

        const eventoModalidade = await prisma.eventoModalidade.create({
            data: {
                eventoId: eventoId,
                modalidadeId: Number(modalidadeId)
            }
        });

        res.status(201).json(eventoModalidade);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2002") {
            return res.status(409).json({
                mensagem: "Essa modalidade já está vinculada ao evento."
            });
        }

        if (erro.code === "P2003") {
            return res.status(404).json({
                mensagem: "Evento ou modalidade não encontrado."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao adicionar a modalidade ao evento."
        });
    }
}

async function rmvMdlEvento(req, res) {
    try {
        const eventoId = Number(req.params.eventoId);
        const modalidadeId = Number(req.params.modalidadeId);

        await prisma.eventoModalidade.delete({
            where: {
                eventoId_modalidadeId: {
                    eventoId: eventoId,
                    modalidadeId: modalidadeId
                }
            }
        });
        res.status(204).send();

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Essa modalidade não está vinculada ao evento."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao remover a modalidade do evento."
        });
    }
}

export {ltMdlEvento,adcMdlEvento,rmvMdlEvento};