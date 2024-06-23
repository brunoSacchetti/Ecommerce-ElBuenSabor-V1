import { Base } from "../Base";
import { DetallePedidoPost } from "./DetallePedidoPost";

export interface PedidoPost  {
    tipoEnvio: string,
    formaPago: string,
    clienteID?: number,
    domicilioID?: number | null,
    detallePedidos: DetallePedidoPost[]
}