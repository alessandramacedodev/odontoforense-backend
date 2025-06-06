const express = require('express')
const EvidenciaController = require('../controllers/evidencia.controller')
const { authenticate, authorize } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: evidencia
 *   description: API para gerenciamento de evidencia
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     evidencia:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID da evidencia (gerado automaticamente)
 *         nomeDaEvidencia:
 *           type: string
 *           description: Nome da evidencia
 *         categoria:
 *           type: string
 *           description: "Categoria da evidencia (ex: imagem, vídeo, documento)"
 *         dataDaColeta:
 *           type: string
 *           format: date
 *           description: Data da coleta da evidencia
 *         descricao:
 *           type: string
 *           description: Descrição da evidencia
 *         localDaRetirada:
 *           type: string
 *           description: Local onde a evidencia foi coletada
 *         fileUrl:
 *           type: string
 *           description: URL do arquivo da evidencia
 */

/**
 * @swagger
 * /api/evidencia:
 *   post:
 *     summary: Cria uma nova evidencia
 *     tags: [evidencia]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nomeDaEvidencia:
 *                 type: string
 *               categoria:
 *                 type: string
 *               dataDaColeta:
 *                 type: string
 *                 format: date
 *               descricao:
 *                 type: string
 *               localDaRetirada:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *               fileUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: evidencia adicionada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 evidence:
 *                   $ref: '#/components/schemas/evidencia'
 *       400:
 *         description: Dados inválidos ou ausentes
 *       500:
 *         description: Erro ao adicionar evidencia
 */
router.post('/', authenticate, authorize(['admin', 'perito', 'assistente']), upload.single('file'), EvidenciaController.createEvidencia)

/**
 * @swagger
 * /api/evidencia:
 *   get:
 *     summary: Lista todas as evidencias
 *     tags: [evidencia]
 *     responses:
 *       200:
 *         description: Lista de evidencias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/evidencia'
 *       500:
 *         description: Erro ao listar as evidencias
 */
router.get('/', authenticate, authorize(['admin', 'perito', 'assistente']), EvidenciaController.getEvidencia)

/**
 * @swagger
 * /api/evidencia/{id}:
 *   get:
 *     summary: Retorna uma evidencia pelo ID
 *     tags: [evidencia]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidencia
 *     responses:
 *       200:
 *         description: evidencia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/evidencia'
 *       404:
 *         description: evidencia não encontrada
 *       500:
 *         description: Erro ao buscar evidencia
 */
router.get('/:id', authenticate, authorize(['admin', 'perito', 'assistente']), EvidenciaController.getEvidenciaById)

/**
 * @swagger
 * /api/evidencia/{id}:
 *   put:
 *     summary: Atualiza uma evidencia existente
 *     tags: [evidencia]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidencia a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/evidencia'
 *     responses:
 *       200:
 *         description: evidencia atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedEvidence:
 *                   $ref: '#/components/schemas/evidencia'
 *       400:
 *         description: ID inválido ou evidencia não encontrada
 *       500:
 *         description: Erro ao atualizar evidencia
 */
router.put('/:id', authenticate, authorize(['admin', 'perito', 'assistente']), EvidenciaController.updateEvidencia)

/**
 * @swagger
 * /api/evidencia/{id}:
 *   delete:
 *     summary: Deleta uma evidencia pelo ID
 *     tags: [evidencia]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidencia a ser deletada
 *     responses:
 *       200:
 *         description: evidencia deletada com sucesso
 *       404:
 *         description: evidencia não encontrada
 *       500:
 *         description: Erro ao deletar evidencia
 */
router.delete('/:id', authenticate, authorize(['admin']), EvidenciaController.deleteEvidenciaById)

/**
 * @swagger
 * /api/evidencia:
 *   delete:
 *     summary: Deleta todas as evidencias
 *     tags: [evidencia]
 *     responses:
 *       200:
 *         description: Todas as evidencias foram deletadas com sucesso
 *       500:
 *         description: Erro ao deletar todas as evidencias
 */
router.delete('/', authenticate, authorize(['admin']), EvidenciaController.deleteEvidencia)

module.exports = router

