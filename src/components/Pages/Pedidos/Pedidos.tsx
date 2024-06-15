import React, { useEffect, useState } from 'react';

import IPedido from '../../../types/Pedido';


import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Typography
} from '@mui/material';
import { useAppSelector } from '../../../hooks/redux';

const API_URL = import.meta.env.VITE_API_URL;

export const Pedidos: React.FC = () => {

  const [pedidos, setPedidos] = useState<IPedido[]>([]);

  const { cliente } = useAppSelector((state) => state.user);

  

  const getPedidosByClient = async () => {
    try {
      const response = await fetch(`${API_URL}/clientes/pedidos/${cliente?.id}`);
      if (!response.ok) {
        throw new Error('Error fetching pedidos');
      }
      const data: IPedido[] = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
    }
  };

  useEffect(() => {
    getPedidosByClient();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" component="div" gutterBottom>
        Pedidos
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha Pedido</TableCell>
            <TableCell>Hora Estimada Finalización</TableCell>
          </TableRow>
          <TableRow></TableRow>
        </TableHead>
        <TableBody>
          {pedidos.map(pedido => (
            <TableRow key={pedido.id}>
              <TableCell>{pedido.cliente.nombre} {pedido.cliente.apellido}</TableCell>
              <TableCell>{pedido.total}</TableCell>
              <TableCell>{pedido.estado}</TableCell>
              <TableCell>{pedido.fechaPedido}</TableCell>
              <TableCell>{pedido.horaEstimadaFinalizacion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};