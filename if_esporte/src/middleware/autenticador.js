import jwt from "jsonwebtoken";

function autenticar(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                mensagem: "Token não informado."
            });
        }
        const partes = authHeader.split(" ");

        if (partes.length !== 2 || partes[0] !== "Bearer") {
            return res.status(401).json({
                mensagem: "Formato do token inválido."
            });
        }

        const token = partes[1];

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        req.usuario = usuario;
        next();

    } catch (erro) {
        console.error(erro);
        return res.status(401).json({
            mensagem: "Token inválido ou expirado."
        });
    }
}

export default autenticar;