import IPedido from "../types/Pedido";
import { PedidoPost } from "../types/PedidoPost/PedidoPost";
import { BackendClient } from "./BackendClient";

export class PedidoService extends BackendClient<IPedido | PedidoPost> {
}