import dotenv from 'dotenv';
dotenv.config()

interface Config{
    db_host: string;
    db_user: string;
    db_pass: string;
    db_name: string;
    db_port: string;
    port: string;
}

const config: Config = {
    db_host : process.env.DB_HOST|| '',
    db_user : process.env.DB_USERNAME|| '',
    db_pass : process.env.DB_PASSWORD|| '',
    db_name : process.env.DB_DATABASE|| '',
    db_port : process.env.DB_PORT|| '',
    port    : process.env.APP_PORT|| '',
};

export default config;