import { Base } from "./Base";
import IDomicilio from "./Domicilio";
import Localidad from "./Localidad"
import IPedido from "./Pedido";

export interface Cliente extends Base<Cliente> {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    userName: string;
    fechaNacimiento: string;
    imagenCliente: string;
    domicilios: IDomicilio[];
    pedido: IPedido[];
}


