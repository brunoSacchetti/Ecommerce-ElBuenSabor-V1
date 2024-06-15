import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeProductFromCart, resetCart, updateProductQuantity } from "../../../redux/slices/cartSlice";
import "./Cart.css";
import { useAppSelector } from "../../../hooks/redux";
import IArticulo from "../../../types/IArticulo";
import { PedidoService } from "../../../services/PedidoService";
import { PedidoPost } from "../../../types/PedidoPost/PedidoPost";
import { DetallePedidoPost } from "../../../types/PedidoPost/DetallePedidoPost";

const API_URL = import.meta.env.VITE_API_URL;

export const Cart = () => {
  const dispatch = useDispatch();
  const { productsList, productQuantities } = useAppSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState(""); // Estado para método de pago
  const [shippingType, setShippingType] = useState(""); // Estado para tipo de envío
  const pedidoService = new PedidoService(`${API_URL}/pedido`);

  const cliente = useAppSelector((state) => state.user.cliente);

  const removeFromCart = (id: any) => {
    dispatch(removeProductFromCart(id));
  };

  const incrementQuantity = (id: any) => {
    dispatch(updateProductQuantity({ id, quantity: productQuantities[id] + 1 }));
  };

  const decrementQuantity = (id: any) => {
    dispatch(updateProductQuantity({ id, quantity: Math.max(productQuantities[id] - 1, 1) })); // Evita cantidad 0
  };

  const calculateTotal = () => {
    let subtotal = 0;
    productsList.forEach((product) => {
      const quantity = productQuantities[product.id] || 0;
      subtotal += product.precioVenta * quantity;
    });
    return subtotal;
  };

  const totalConDescuento = () => {
    const subtotal = calculateTotal();
    if (shippingType === "TAKE_AWAY") {
      return subtotal * 0.9;
    }
    return subtotal;
  };

  const handleChangeShippingType = (e : any) => {
    setShippingType(e.target.value);
  };

  const handleSaveCart = async () => {
    try {
      let totalPedido = 0;

      const pedido: PedidoPost = {
        id: 0,
        eliminado: false,
        tipoEnvio: shippingType,
        formaPago: paymentMethod,
        clienteID: cliente?.id,
        domicilioID: cliente?.domicilios[0]?.id,
        detallePedidos: [],
      };

      const detalles: DetallePedidoPost[] = [];

      productsList.forEach((product) => {
        const cantidad = productQuantities[product.id] || 1;
        const subTotal = product.precioVenta * cantidad;
        totalPedido += subTotal;

        const detalle: DetallePedidoPost = {
          cantidad,
          subTotal,
          idArticulo: product.id,
        };

        detalles.push(detalle);
      });

      pedido.detallePedidos = detalles;

      console.log(pedido);

      const pedidoResponse = await pedidoService.post(`${API_URL}/pedido`, pedido);

      console.log(pedidoResponse);

      dispatch(resetCart());
      alert('El pedido se guardó correctamente');
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      alert('No hay stock de algun producto seleccionado.');
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Nombre</p>
          <p>Precio</p>
          <p>Cantidad</p>
          <p>Total</p>
          <p>Quitar</p>
        </div>
        <br />
        <hr />
        {productsList.map((item: IArticulo) => {
          const quantity = productQuantities[item.id] || 0;
          const total = item.precioVenta * quantity;
          return (
            <div key={item.id}>
              <div className="cart-items-title cart-items-items">
                <img src={item.image} alt="" />
                <p>{item.denominacion}</p>
                <p>${item.precioVenta}</p>
                <div className="quantity-control">
                  <button className="custom-btn" onClick={() => decrementQuantity(item.id)}>
                    -
                  </button>
                  <p className="quantity">{quantity}</p>
                  <button className="custom-btn" onClick={() => incrementQuantity(item.id)}>
                    +
                  </button>
                </div>
                <p>${total}</p>
                <p onClick={() => removeFromCart(item.id)} className="cross">
                  x
                </p>
              </div>
              <hr />
            </div>
          );
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${calculateTotal()}</p>
            </div>
            <hr />
            {/* <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>$2</p>
            </div> */}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${totalConDescuento()}</b>
            </div>
          </div>
          <div className="payment-options">
            <label htmlFor="paymentMethod">Método de Pago:</label>
            <select
              id="metodoPago"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Seleccione Método de Pago</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="MERCADO_PAGO">Mercado Pago</option>
              {/* Agrega más opciones según sea necesario */}
            </select>
            <label htmlFor="tipoEnvio">Tipo de Envío:</label>
            <select
              id="tipoEnvio"
              value={shippingType}
              onChange={handleChangeShippingType}
            >
              <option value="">Seleccione Tipo de Envío</option>
              <option value="DELIVERY">Delivery</option>
              <option value="TAKE_AWAY">Take Away</option>
              {/* Agrega más opciones según sea necesario */}
            </select>
          </div>
          <button onClick={handleSaveCart}>Proceder a pagar</button>
        </div>
      </div>
    </div>
  );
};

