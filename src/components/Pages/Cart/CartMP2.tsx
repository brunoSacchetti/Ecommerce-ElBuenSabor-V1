import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeProductFromCart, resetCart, updateProductQuantity } from "../../../redux/slices/cartSlice";
import "./Cart.css";
import { useAppSelector } from "../../../hooks/redux";
import IArticulo from "../../../types/IArticulo";
import { PedidoService } from "../../../services/PedidoService";
import { PedidoPost } from "../../../types/PedidoPost/PedidoPost";
import { DetallePedidoPost } from "../../../types/PedidoPost/DetallePedidoPost";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";

const API_URL = import.meta.env.VITE_API_URL;

type CartProps = {
  setShowDomicilio: (value: any) => void;
};

const CartMP2: React.FC<CartProps> = ({ setShowDomicilio }) => {
  const dispatch = useDispatch();
  const { productsList, productQuantities } = useAppSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState(""); // Estado para método de pago
  const [shippingType, setShippingType] = useState(""); // Estado para tipo de envío
  const [selectedDomicilio, setSelectedDomicilio] = useState<number | null>(null);
  const pedidoService = new PedidoService(`${API_URL}/pedido`);

  const cliente = useAppSelector((state) => state.user.cliente);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  initMercadoPago("TEST-24e8018b-3fad-4e09-b960-b3f81919ec2c", {
    locale: "es-AR",
  });

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

  const [domicilios, setDomicilios] = useState<any[]>([]);
  const getDomicilios = async () => {
    try {
      const response = await fetch(`${API_URL}/clientes/listDomiciliosCliente/${cliente?.id}`);
      if (!response.ok) {
        throw new Error("Error al obtener domicilios");
      }
      const data = await response.json();
      setDomicilios(data);
    } catch (error) {
      console.error("Error al obtener domicilios:", error);
    }
  };

  // Cargar los domicilios al montar el componente
  useEffect(() => {
    getDomicilios();
  }, []);

  const handleSaveCart = async () => {
    if (!isLoggedIn) {
      toast.warn("Debe registrarse o iniciar sesión para continuar con el pago.");
      return;
    }

    try {
      let totalPedido = 0;

      const pedido: PedidoPost = {
        id: 0,
        eliminado: false,
        tipoEnvio: shippingType,
        formaPago: paymentMethod,
        clienteID: cliente?.id,
        domicilioID: selectedDomicilio || undefined,
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

      const preferenceResponse = await axios.post(
        `${API_URL}/pagoMercadoPago`,
        { ...pedido, total: totalPedido }
      );
      setPreferenceId(preferenceResponse.data.id);

      dispatch(resetCart());
      toast.success("El pedido se guardó correctamente.");
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      toast.error("Hubo un error al guardar el pedido.");
    }
  };

  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  return (
    <div className="cart">
      <ToastContainer />
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
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${calculateTotal()}</b>
            </div>
          </div>
          <div className="payment-options">
            <label htmlFor="tipoEnvio">Tipo de Envío:</label>
            <select
              id="tipoEnvio"
              value={shippingType}
              onChange={(e) => {
                setShippingType(e.target.value);
                setSelectedDomicilio(null); // Resetear domicilio seleccionado si cambia el tipo de envío
              }}
            >
              <option value="">Seleccione Tipo de Envío</option>
              <option value="TAKE_AWAY">Retiro en Local</option>
              <option value="DELIVERY">Envio a Domicilio</option>
            </select>
            {shippingType === "DELIVERY" && (
              <div>
                <label htmlFor="domicilio">Seleccione Domicilio:</label>
                <select
                  id="domicilio"
                  value={selectedDomicilio || ""}
                  onChange={(e) => setSelectedDomicilio(Number(e.target.value))}
                >
                  <option value="">Seleccione Domicilio</option>
                  {domicilios.map((domicilio) => (
                    <option key={domicilio.id} value={domicilio.id}>
                      {domicilio.calle} {domicilio.numero}, {domicilio.localidad.nombre},{" "}
                      {domicilio.localidad.provincia.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <label htmlFor="formaPago">Forma de Pago:</label>
            <select
              id="formaPago"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Seleccione Forma de Pago</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
            </select>
          </div>
        </div>
        <div className="save-cart">
          <button className="custom-btn" onClick={handleSaveCart}>
            Comprar
          </button>
        </div>
        {preferenceId && (
          <Wallet
            initialization={{
              preferenceId: preferenceId,
              redirectMode: "modal",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CartMP2;
