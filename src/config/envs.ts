import 'dotenv/config';
import * as joi from 'joi';

interface IEnvironments {
    PORT: number;
    DATABASE_URL: string;

    // PRODUCT_MS_HOST: string;
    // PRODUCT_MS_PORT: number;

    NATS_SERVERS: string[];
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    // PRODUCT_MS_HOST: joi.string().required(),
    // PRODUCT_MS_PORT: joi.number().required(),

    NATS_SERVERS: joi.array().items( joi.string() ).required(),
})
.unknown( true );

const { error, value } = envSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});

if( error ) {
    throw new Error(`Config validation falied: ${ error.message }`);
}

const envVars: IEnvironments = value;

export const envs = {
    port             : envVars.PORT,
    databaseUrl      : envVars.DATABASE_URL,
    // productMsHost    : envVars.PRODUCT_MS_HOST,
    // productMsPort    : envVars.PRODUCT_MS_PORT,

    nats_servers: envVars.NATS_SERVERS,
};

