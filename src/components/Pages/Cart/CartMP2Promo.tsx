import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeProductFromCart, resetCart, updateProductQuantity } from "../../../redux/slices/cartSlice";
import "./Cart.css";
import { useAppSelector } from "../../../hooks/redux";
import IArticulo from "../../../types/IArticulo";
import { PedidoService } from "../../../services/PedidoService";
import { PedidoPost } from "../../../types/PedidoPost/PedidoPost";
import { DetallePedidoPost } from "../../../types/PedidoPost/DetallePedidoPost";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";
import { Button } from "react-bootstrap";
import DeleteIcon from '@mui/icons-material/Delete';
const API_URL = import.meta.env.VITE_API_URL;

type CartProps = {
  setShowDomicilio: (value: any) => void;
};

const CartMPPromocion: React.FC<CartProps> = ({ setShowDomicilio }) => {
  const dispatch = useDispatch();
  const { productsList, productQuantities } = useAppSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState(""); 
  const [shippingType, setShippingType] = useState(""); 
  const [selectedDomicilio, setSelectedDomicilio] = useState<number | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0); // Estado para el descuento
  const [totalWithDiscount, setTotalWithDiscount] = useState(0); // Estado para el total con descuento

  const cliente = useAppSelector((state) => state.user.cliente);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  const pedidoService = new PedidoService(`${API_URL}/pedido`);

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
    dispatch(updateProductQuantity({ id, quantity: Math.max(productQuantities[id] - 1, 1) }));
  };

  const calculateTotal = () => {
    let subtotal = 0;
    productsList.forEach((product) => {
      const quantity = productQuantities[product.id] || 0;
      const price = product.precioPromocional ?? product.precioVenta;
      subtotal += price * quantity;
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

  useEffect(() => {
    getDomicilios();
  }, []);

  useEffect(() => {
    if (shippingType === "TAKE_AWAY") {
      const total = calculateTotal();
      const discount = total * 0.1;
      setDiscount(discount);
      setTotalWithDiscount(total - discount);
    } else {
      setDiscount(0);
      setTotalWithDiscount(calculateTotal());
    }
  }, [shippingType, productsList, productQuantities]);

  const handleSaveCart = async () => {
    if (!isLoggedIn) {
      toast.warn("Debe registrarse o iniciar sesión para continuar con el pago.");
      return;
    }
  
    try {
      let totalPedido = 0;
  
      const pedido: PedidoPost = {
        total: 0,
        tipoEnvio: shippingType,
        formaPago: paymentMethod,
        clienteID: cliente?.id,
        domicilioID: shippingType === "TAKE_AWAY" ? 1 : selectedDomicilio || null,
        detallePedidos: [],
      };
  
      const detalles: DetallePedidoPost[] = [];
  
      productsList.forEach((product) => {
        const cantidad = productQuantities[product.id] || 1;
        const subTotal = (product.precioPromocional ?? product.precioVenta) * cantidad;
        totalPedido += subTotal;
  
        if (product.tipoPromocion && product.detalles) {
          product.detalles.forEach((detallePromocion: any) => {
            const idArticulo = detallePromocion.manufacturado?.id || detallePromocion.insumo?.id;
            const precioVenta = detallePromocion.manufacturado?.precioVenta || detallePromocion.insumo?.precioVenta || 0;
            
            const detalle: DetallePedidoPost = {
              cantidad: detallePromocion.cantidad * cantidad,
              subTotal: precioVenta * (detallePromocion.cantidad * cantidad),
              idArticulo: idArticulo,
            };
            detalles.push(detalle);
          });
        } else {
          const detalle: DetallePedidoPost = {
            cantidad,
            subTotal,
            idArticulo: product.id,
          };
          detalles.push(detalle);
        }
      });
      
      pedido.detallePedidos = detalles; 

      pedido.total = shippingType === "TAKE_AWAY" ? totalWithDiscount : totalPedido;

      await pedidoService.post(`${API_URL}/pedido`, pedido);

      

      if (paymentMethod === "MERCADO_PAGO") {
        const preferenceResponse = await axios.post(
          `${API_URL}/pagoMercadoPago`,
          { ...pedido, total: totalPedido }
        );
        setPreferenceId(preferenceResponse.data.id);
      } else {
        setPreferenceId(null); 
      }
  
      dispatch(resetCart());
      toast.success("El pedido se guardó correctamente.");
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      toast.error("Hubo un error al guardar el pedido.");
    }
  };

  const handleAddDomicilioClick = () => {
    if (!isLoggedIn) {
      toast.warn("Debe registrarse o iniciar sesión para agregar un domicilio.");
      return;
    }
    setShowDomicilio(true);
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
        {productsList.map((item: IArticulo | any) => {
          const quantity = productQuantities[item.id] || 0;
          const total = (item.precioPromocional ?? item.precioVenta) * quantity;
          return (
            <div key={item.id}>
              <div className="cart-items-title cart-items-items">
                <img src={item.image} alt="" />
                <p>{item.denominacion}</p>
                <p>${item.precioPromocional ?? item.precioVenta}</p>
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
                  <DeleteIcon /> 
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
            {shippingType === "TAKE_AWAY" && (
              <>
                <div className="cart-total-details">
                  <p>Descuento (10%)</p>
                  <p>-${discount.toFixed(2)}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <b>Total</b>
              <b>${shippingType === "TAKE_AWAY" ? totalWithDiscount.toFixed(2) : calculateTotal()}</b>
            </div>
          </div>
          {shippingType === "TAKE_AWAY" && (
            <div className="discount-message">
              <p>¡Tienes un 10% de descuento por retirar en el local!</p>
            </div>
          )}
          <div className="payment-options">
            <label htmlFor="tipoEnvio">Tipo de Envío:</label>
            <select
              id="tipoEnvio"
              value={shippingType}
              onChange={(e) => {
                setShippingType(e.target.value);
                setSelectedDomicilio(null);
                setPaymentMethod(""); 
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
                <Button onClick={handleAddDomicilioClick}>Añadir un Domicilio</Button>
              </div>
            )}
            <label htmlFor="formaPago">Forma de Pago:</label>
            <select
              id="formaPago"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Seleccione Forma de Pago</option>
              {shippingType === "TAKE_AWAY" && <option value="EFECTIVO">Efectivo</option>}
              <option value="MERCADO_PAGO">Mercado Pago</option>
            </select>
          </div>
        </div>
        <div className="save-cart">
          <button className="custom-btn" onClick={handleSaveCart}>
            Comprar
          </button>
        </div>
        {preferenceId && paymentMethod === "MERCADO_PAGO" && (
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

export default CartMPPromocion;
