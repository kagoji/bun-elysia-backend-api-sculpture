import {Elysia, t} from "elysia"

class Player{
    constructor(
        public data = [
            {
                id: '1',
                name: 'Messi',
                age: 35
            },
            {
                id: '2',
                name: 'Kaka',
                age: 45
            },
            {
                id: '3',
                name: 'Neimar',
                age: 25
            }

        ]
    ){}
}

export const player = new Elysia({prefix: '/player'})
   .decorate('player', new Player())
   .get("/", ({player}) => player.data)
   .get("/:id", ({player, params:{id} ,error})=>{
    for(const s_player of  player.data){
        if(s_player.id === id){
            return s_player
        }
   }

   return error(404, "Player not found")

})