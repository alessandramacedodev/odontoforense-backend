require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const connectDB = require('./src/db/conexao.js');
const { swaggerUi, swaggerSpec } = require('./src/docs/swagger.js');

const usuarioRouter = require('./src/routes/user.route.js');
const casoRouter = require('./src/routes/caso.route.js');
const evidenciaRouter = require('./src/routes/evidencia.route.js');
const laudoRouter = require('./src/routes/laudo.route.js');
const bancoodontoRouter = require('./src/routes/bancoodonto.route.js');

const Evidencia = require('./src/models/evidencia.js'); // modelo Mongoose da evidência

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas padrão
app.use('/api/user', usuarioRouter);
app.use('/api/caso', casoRouter);
app.use('/api/evidencia', evidenciaRouter);
app.use('/api/laudo', laudoRouter);
app.use('/api/bancoodonto', bancoodontoRouter);

// ROTA EXTRA: GERAÇÃO DE LAUDO VIA IA
app.post('/api/gerar-laudo', async (req, res) => {
  const { case_id } = req.body;

  if (!case_id) {
    return res.status(400).json({ error: "O campo 'case_id' é obrigatório." });
  }

  try {
    const evidencia = await evidencia.find({ case_id });

    if (!evidencia || evidencia.length === 0) {
      return res.status(404).json({ error: `Nenhuma evidência encontrada para o caso '${case_id}'.` });
    }

    // Construção do prompt
    let prompt = `Gere um laudo técnico e objetivo com base nas evidências a seguir, relacionadas ao caso '${case_id}'.\n\n`;

    evidencia.forEach((ev, index) => {
      prompt += `${index + 1}) Nome da Evidência: ${ev.nome_evidencia}\n`;
      prompt += `   Categoria: ${ev.categoria}\n`;
      prompt += `   Data de Coleta: ${new Date(ev.data_coleta).toLocaleString('pt-BR')}\n`;
      prompt += `   Descrição: ${ev.descricao}\n`;
      prompt += `   Local de Retirada: ${ev.local_retirada}\n`;
      prompt += `   Arquivo: ${ev.fileUrl}\n\n`;
    });

    prompt += `Com base nas evidências acima, elabore um laudo técnico com análise clara e objetiva.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.AIzaSyAC-IG18TViXjRxrDu3VxWKygMNbkvRDpE}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const textoGerado = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textoGerado) {
      return res.status(500).json({ error: 'Erro ao processar resposta da IA.' });
    }

    res.json({ case_id, laudo_gerado: textoGerado });

  } catch (err) {
    console.error('Erro ao gerar laudo:', err);
    res.status(500).json({ error: 'Erro ao gerar laudo com a IA.' });
  }
});

// Início do servidor
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Erro ao iniciar o servidor:`, error);
    process.exit(1);
  }
}

startServer();
