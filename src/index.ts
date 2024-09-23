import { Elysia , t} from "elysia";
import { swagger } from '@elysiajs/swagger'
import { player } from "./router/players.router"

const app = new Elysia()
app.use(swagger())
app.use(player)
app.get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
