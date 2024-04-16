import fastify from "fastify";
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, ZodTypeProvider } from 'fastify-type-provider-zod'
import { generateSlug } from "./utils/generate-slug";

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const prisma = new PrismaClient({
    log: ['query']
})

// Criação da rota
// Request resquisições / reply 
app.withTypeProvider<ZodTypeProvider>()
    .post('/events', {
        schema:{
            body: z.object({
                title: z.string().min(4),
                details: z.string().nullable(),
                maximumAttendees: z.number().int().positive().nullable(),
            }),
            response: {
                201: z.object({
                    eventid: z.string().uuid(),
                })
            }
    
        },
    }, async (request, reply) => {

        const {
            title,
            details,
            maximumAttendees,
        } = request.body

        const slug = generateSlug(title)

        const eventWithSameSlug = await prisma.event.findUnique({
            where: {
                slug,
            }
        })

        if (eventWithSameSlug !== null) {
            throw new Error('Another event with same title already exists')
        }

        const event = await prisma.event.create({
            data: {
                title,
                details,
                maximumAttendees,
                slug,
            },
        })

        return reply.status(201).send({ eventid: event.id })
})


app.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running!')
})