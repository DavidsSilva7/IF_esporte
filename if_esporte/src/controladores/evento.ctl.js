import prisma from "../lib/prisma.js";

async function listarEventos(req, res) {

    try {

        const { status, campusId, dataInicio, dataFim } = req.query;
        const filtros = {};

        if (status !== undefined) {
            filtros.status = status;
        }
        if (campusId !== undefined) {
            filtros.campusId = Number(campusId);
        }
        if (dataInicio !== undefined) { 
            filtros.dataInicio = { gte: new Date(dataInicio) }; 
        }
        if (dataFim !== undefined) {
            filtros.dataFim = { lte: new Date(dataFim) };
        }

        const eventos = await prisma.evento.findMany({
            where: filtros,
            include: {
                campus: true,
                organizador: true,
                modalidades: {include: { modalidade: true}}
            },
            orderBy: { dataInicio: "asc"}
        });
        res.json(eventos);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao buscar os eventos." });
    }

}

async function criarEvento(req, res) {
    try {
        const {
            titulo,
            descricao,
            dataInicio,
            dataFim,
            local,
            status,
            campusId
        } = req.body;

        if (
            !titulo ||
            !descricao ||
            !dataInicio ||
            !dataFim ||
            !local ||
            campusId === undefined ||
            status === undefined
        ) {
            return res.status(400).json({
                mensagem: "Todos os campos são obrigatórios."
            });
        }

        const statusPermitidos = [
            "PLANEJADO",
            "ABERTO",
            "ENCERRADO",
            "CANCELADO"
        ];

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                mensagem: "Status do evento inválido."
            });
        }

        const evento = await prisma.evento.create({
            data: {
                titulo,
                descricao,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                local,
                status,
                campusId: Number(campusId),
                organizadorId: req.usuario.id
            }
        });

        res.status(201).json(evento);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2003") {
            return res.status(400).json({
                mensagem: "Campus informado não existe."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao cadastrar o evento."
        });
    }
}

async function atualizarEvento(req, res) {
    try {
        const id = Number(req.params.id);

        const {
            titulo,
            descricao,
            dataInicio,
            dataFim,
            local,
            campusId,
            status
        } = req.body;

        // Busca o evento que será alterado
        const evento = await prisma.evento.findUnique({
            where: {
                id: id
            }
        });

        // Verifica se o evento existe
        if (!evento) {
            return res.status(404).json({
                mensagem: "Evento não encontrado."
            });
        }

        // ORGANIZADOR só pode editar seus próprios eventos
        if (
            req.usuario.role !== "ADMIN" &&
            evento.organizadorId !== req.usuario.id
        ) {
            return res.status(403).json({
                mensagem: "Você só pode editar eventos que criou."
            });
        }

        // Validação do status
        const statusPermitidos = [
            "PLANEJADO",
            "ABERTO",
            "ENCERRADO",
            "CANCELADO"
        ];

        if (
            status !== undefined &&
            !statusPermitidos.includes(status)
        ) {
            return res.status(400).json({
                mensagem: "Status do evento inválido."
            });
        }

        // Verifica se existe algum campo para atualizar
        if (
            titulo === undefined &&
            descricao === undefined &&
            dataInicio === undefined &&
            dataFim === undefined &&
            local === undefined &&
            campusId === undefined &&
            status === undefined
        ) {
            return res.status(400).json({
                mensagem: "Informe pelo menos um campo para atualizar."
            });
        }

        const dados = {};

        if (titulo !== undefined) {
            dados.titulo = titulo;
        }

        if (descricao !== undefined) {
            dados.descricao = descricao;
        }

        if (dataInicio !== undefined) {
            dados.dataInicio = new Date(dataInicio);
        }

        if (dataFim !== undefined) {
            dados.dataFim = new Date(dataFim);
        }

        if (local !== undefined) {
            dados.local = local;
        }

        if (campusId !== undefined) {
            dados.campusId = Number(campusId);
        }

        if (status !== undefined) {
            dados.status = status;
        }

        const eventoAtualizado = await prisma.evento.update({
            where: {
                id: id
            },
            data: dados
        });

        res.json(eventoAtualizado);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2003") {
            return res.status(400).json({
                mensagem: "Campus informado não existe."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao atualizar o evento."
        });
    }
}

async function excluirEvento(req, res) {
    try {
        const id = Number(req.params.id);

        // Busca o evento
        const evento = await prisma.evento.findUnique({
            where: {
                id: id
            }
        });

        // Verifica se existe
        if (!evento) {
            return res.status(404).json({
                mensagem: "Evento não encontrado."
            });
        }

        // ORGANIZADOR só pode excluir seus próprios eventos
        if (
            req.usuario.role !== "ADMIN" &&
            evento.organizadorId !== req.usuario.id
        ) {
            return res.status(403).json({
                mensagem: "Você só pode excluir eventos que criou."
            });
        }

        // Exclui o evento
        await prisma.evento.delete({
            where: {
                id: id
            }
        });

        res.status(204).send();

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2003") {
            return res.status(409).json({
                mensagem:
                    "Não é possível excluir este evento, pois existem registros vinculados a ele."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao excluir o evento."
        });
    }
}

export {listarEventos, criarEvento, atualizarEvento, excluirEvento};