const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Casos Periciais',
            version: '1.0.0',
            description: 'Documentação da API para gerenciamento de casos odontolegais',
        },
        servers: [
            {
                url: 'https://odontoforense-backend-2.onrender.com/api-docs/#/'
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = {
    swaggerUi,
    swaggerSpec
}
