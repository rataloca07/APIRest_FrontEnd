import { Region } from './region.model';

export class Cliente {
    /*constructor(public id: number,
        public nombre: string,
        public apellido: string,
        public createAt: string,
        public email: string) {

    }*/
    id: number;
    nombre: string;
    apellido: string;
    createAt: string;
    email: string;
    foto:string;
    region:Region;


}