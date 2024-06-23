import { Base } from "../Base";
import { DetallePedidoPost } from "./DetallePedidoPost";

export interface PedidoPost {
    total: number,
    tipoEnvio: string,
    formaPago: string,
    clienteID?: number,
    domicilioID?: number | null,
    detallePedidos: DetallePedidoPost[]
}