import fastify from "fastify";

const app = fastify()

// Rotas
app.get('/', () => {
    return 'Hello meu guri!'
})

// Rotas
app.get('/test', () => {
    return 'Teste meu guri!'
})


app.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running!')
})