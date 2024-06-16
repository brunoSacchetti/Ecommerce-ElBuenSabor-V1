import { useEffect, useState } from "react";
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
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const API_URL = import.meta.env.VITE_API_URL;

type CartProps = {
  setShowDomicilio: (value: any) => void;
};

const Cart: React.FC<CartProps> = ({ setShowDomicilio }) => {
  const dispatch = useDispatch();
  const { productsList, productQuantities } = useAppSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingType, setShippingType] = useState(""); 
  const [selectedDomicilio, setSelectedDomicilio] = useState<number | null>(null);
  const pedidoService = new PedidoService(`${API_URL}/pedido`);

  const cliente = useAppSelector((state) => state.user.cliente);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  // Inicialización de Mercado Pago
  useEffect(() => {
    initMercadoPago('TEST-24e8018b-3fad-4e09-b960-b3f81919ec2c', {
      locale: 'es-AR'
    });
  }, []);

  // Función para remover producto del carrito
  const removeFromCart = (id: any) => {
    dispatch(removeProductFromCart(id));
  };

  // Función para incrementar cantidad de producto
  const incrementQuantity = (id: any) => {
    dispatch(updateProductQuantity({ id, quantity: productQuantities[id] + 1 }));
  };

  // Función para decrementar cantidad de producto
  const decrementQuantity = (id: any) => {
    dispatch(updateProductQuantity({ id, quantity: Math.max(productQuantities[id] - 1, 1) }));
  };

  // Función para calcular el total del carrito
  const calculateTotal = () => {
    let subtotal = 0;
    productsList.forEach((product) => {
      const quantity = productQuantities[product.id] || 0;
      subtotal += product.precioVenta * quantity;
    });
    return subtotal;
  };

  // Estado y función para manejar los domicilios del cliente
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

  // Función para manejar el proceso de guardar el carrito y realizar el pago
  const handleSaveCart = async () => {
    if (!isLoggedIn) {
      toast.warn("Debe registrarse o iniciar sesión para continuar con el pago.");
      return;
    }
  
    try {
      let totalPedido = 0;
  
      // Construcción del objeto pedido
      const pedido: PedidoPost = {
        id: 0,
        eliminado: false,
        tipoEnvio: shippingType,
        formaPago: paymentMethod,
        clienteID: cliente?.id,
        domicilioID: selectedDomicilio || undefined,
        detallePedidos: [],
      };
  
      // Construcción de los detalles del pedido
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
  
      // Guardar el pedido en la base de datos si el pago es efectivo
      if (paymentMethod !== "MERCADO_PAGO") {
        const pedidoResponse = await pedidoService.post(`${API_URL}/pedido`, pedido);
        dispatch(resetCart());
        toast.success("El pedido se guardó correctamente.");
        return;
      }
  
      // Si el pago es con Mercado Pago
      const pedidoResponse = await pedidoService.post(`${API_URL}/pedido`, pedido);
  
      // Llamar al backend para obtener la preferencia de Mercado Pago
      const response = await fetch(`${API_URL}/pagoMercadoPago`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoResponse)
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener la preferencia de pago");
      }
  
      const data = await response.json();
      const mpPreference = data; // Suponiendo que el backend devuelve la preferencia de Mercado Pago
  
      // Redirigir al usuario a la página de pago de Mercado Pago
      window.location.href = mpPreference.init_point;
  
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      toast.error("Hubo un error al guardar el pedido.");
    }
  };
  

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
                      {domicilio.calle} {domicilio.numero}, {domicilio.localidad.nombre}, {domicilio.localidad.provincia.nombre}
                    </option>
                  ))}
                </select>
                <Button onClick={() => setShowDomicilio(true)}>Añadir un Domicilio</Button>
              </div>
            )}
            <label htmlFor="paymentMethod">Método de Pago:</label>
            <select
              id="metodoPago"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Seleccione Método de Pago</option>
              {shippingType === "DELIVERY" ? (
                <option value="MERCADO_PAGO">Mercado Pago</option>
              ) : (
                <>
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="MERCADO_PAGO">Mercado Pago</option>
                </>
              )}
            </select>
          </div>
          <button className="pay" onClick={handleSaveCart}>Proceder a pagar</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

