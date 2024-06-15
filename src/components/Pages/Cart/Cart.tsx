import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeProductFromCart, updateProductQuantity } from "../../../redux/slices/cartSlice";
import "./Cart.css";
import { useAppSelector } from "../../../hooks/redux";
import IArticulo from "../../../types/IArticulo";

const Cart = () => {
  const dispatch = useDispatch();
  const { productsList, productQuantities } = useAppSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState(""); // Estado para método de pago
  const [shippingType, setShippingType] = useState(""); // Estado para tipo de envío

  const removeFromCart = (id: any) => {
    dispatch(removeProductFromCart(id));
  };

  const incrementQuantity = (id: any) => {
    dispatch(updateProductQuantity({ id, quantity: productQuantities[id] + 1 }));
  };

  const decrementQuantity = (id: any) => {
    dispatch(updateProductQuantity({ id, quantity: productQuantities[id] - 1 }));
  };

  const calculateTotal = () => {
    let subtotal = 0;
    productsList.forEach((product) => {
      const quantity = productQuantities[product.id] || 0;
      subtotal += product.precioVenta * quantity;
    });
    return subtotal;
  };

  const handleProceedToPay = () => {
    // Aquí puedes hacer lo que sea necesario al proceder al pago, como enviar los datos al backend, etc.
    console.log("Método de pago seleccionado:", paymentMethod);
    console.log("Tipo de envío seleccionado:", shippingType);
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
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>$2</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${calculateTotal() + 2}</b>
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
              onChange={(e) => setShippingType(e.target.value)}
            >
              <option value="">Seleccione Tipo de Envío</option>
              <option value="DELIVERY">Delivery</option>
              <option value="TAKE_AWAY">Take Away</option>
              {/* Agrega más opciones según sea necesario */}
            </select>
          </div>
          <button onClick={handleProceedToPay}>Proceder a pagar</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
