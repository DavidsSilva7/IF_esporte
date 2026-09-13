import prisma from "../lib/prisma.js";


async function listarPartidas(req, res) {

    try {

        const partidas = await prisma.partida.findMany({

            include: {
                evento: true,
                modalidade: true,
                campusA: true,
                campusB: true
            },

            orderBy: {
                dataHora: "asc"
            }

        });

        res.json(partidas);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar as partidas."
        });

    }

}


async function criarPartida(req, res) {

    try {

        const {
            eventoId,
            modalidadeId,
            campusAId,
            campusBId,
            dataHora,
            local,
            placarA,
            placarB,
            status
        } = req.body;


        if (
            eventoId === undefined ||
            modalidadeId === undefined ||
            campusAId === undefined ||
            campusBId === undefined ||
            !dataHora ||
            !local
        ) {

            return res.status(400).json({
                mensagem: "Todos os campos obrigatórios devem ser informados."
            });

        }
        if (
            (placarA !== undefined && Number(placarA) < 0) ||
            (placarB !== undefined && Number(placarB) < 0)
        ) {
            return res.status(400).json({
                mensagem: "O placar não pode ser negativo."
            });
        }
        if (Number(campusAId) === Number(campusBId)) {

            return res.status(400).json({
                mensagem: "Os dois campi da partida devem ser diferentes."
            });

        }


        const partida = await prisma.partida.create({

            data: {
                eventoId: Number(eventoId),
                modalidadeId: Number(modalidadeId),
                campusAId: Number(campusAId),
                campusBId: Number(campusBId),
                dataHora: new Date(dataHora),
                local,
                placarA: placarA !== undefined ? Number(placarA) : 0,
                placarB: placarB !== undefined ? Number(placarB) : 0,
                status: status || "AGENDADA"
            }

        });


        res.status(201).json(partida);


    } catch (erro) {

        console.error(erro);


        if (erro.code === "P2003") {

            return res.status(400).json({
                mensagem: "Evento, modalidade ou campus informado não existe."
            });

        }


        res.status(500).json({
            mensagem: "Erro ao cadastrar a partida."
        });

    }

}


async function atualizarPartida(req, res) {

    try {

        const id = Number(req.params.id);

        const {
            eventoId,
            modalidadeId,
            campusAId,
            campusBId,
            dataHora,
            local,
            placarA,
            placarB,
            status
        } = req.body;


        const dados = {};


        if (eventoId !== undefined) {
            dados.eventoId = Number(eventoId);
        }

        if (modalidadeId !== undefined) {
            dados.modalidadeId = Number(modalidadeId);
        }

        if (campusAId !== undefined) {
            dados.campusAId = Number(campusAId);
        }

        if (campusBId !== undefined) {
            dados.campusBId = Number(campusBId);
        }

        if (dataHora !== undefined) {
            dados.dataHora = new Date(dataHora);
        }

        if (local !== undefined) {
            dados.local = local;
        }

        if (placarA !== undefined) {
            dados.placarA = Number(placarA);
        }

        if (placarB !== undefined) {
            dados.placarB = Number(placarB);
        }

        if (status !== undefined) {
            dados.status = status;
        }
        if (
            (placarA !== undefined && Number(placarA) < 0) ||
            (placarB !== undefined && Number(placarB) < 0)
        ) {
            return res.status(400).json({
                mensagem: "O placar não pode ser negativo."
            });
        }

        if (
            dados.campusAId !== undefined &&
            dados.campusBId !== undefined &&
            dados.campusAId === dados.campusBId
        ) {

            return res.status(400).json({
                mensagem: "Os dois campi da partida devem ser diferentes."
            });

        }

        if (Object.keys(dados).length === 0) {
            return res.status(400).json({
                mensagem: "Informe pelo menos um campo para atualizar."
            });
        }
        const partida = await prisma.partida.update({
            where: {  id: id},
            data: dados
        });
        res.json(partida);
    } catch (erro) {
        console.error(erro);
        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Partida não encontrada."
            });
        }
        if (erro.code === "P2003") {
            return res.status(400).json({
                mensagem: "Evento, modalidade ou campus informado não existe."
            });
        }
        res.status(500).json({
            mensagem: "Erro ao atualizar a partida."
        });

    }

}


async function excluirPartida(req, res) {

    try {
        const id = Number(req.params.id);
        await prisma.partida.delete({
            where: { id: id }
        });
        res.status(204).send();
    } catch (erro) {

        console.error(erro);
        if (erro.code === "P2025") {

            return res.status(404).json({
                mensagem: "Partida não encontrada."
            });

        }


        res.status(500).json({
            mensagem: "Erro ao excluir a partida."
        });

    }

}


export {
    listarPartidas,
    criarPartida,
    atualizarPartida,
    excluirPartida
};