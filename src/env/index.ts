import { config } from 'dotenv'
import 'dotenv/config'
import { z } from 'zod'

if(process.env.NODE_ENV === 'test'){
    console.log('🚨 Running in test environment')
    config({
        path: '.env.test'
    })
} else {
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
})


const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    console.error('🎈 Invalid environment variables!', _env.error.format())

    throw new Error('🎈 Invalid environment variables!')
}

export const env = _env.data