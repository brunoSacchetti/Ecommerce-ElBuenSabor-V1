import React, { useEffect, useState } from 'react';

import { useAppSelector } from '../../../hooks/redux';
import { TextField } from '@mui/material';
import { assets } from '../../../assets/assets';
import IPais from '../../../types/Pais';
import IProvincia from '../../../types/Provincia';
import ILocalidad from '../../../types/Localidad';
import { CFormSelect } from '@coreui/react';
const API_URL = import.meta.env.VITE_API_URL;

type DomicilioProps = {
  setShowDomicilio: (value: any) => void;
};

export const DomicilioPopup: React.FC<DomicilioProps> = ({ setShowDomicilio }) => {
  const [formData, setFormData] = useState({
    calle: '',
    numero: 0,
    cp: 0,
    piso: 0,
    nroDpto: 0,
    idLocalidad: 0,
  });
  const cliente = useAppSelector((state) => state.user.cliente);
  const [errorMessage, setErrorMessage] = useState('');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let url = `http://localhost:8080/clientes/añadirDomicilioCliente/${cliente?.id}`;
      let method = 'PUT';

      await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setShowDomicilio(false);
    } catch (error: any) {
      console.error('Error:', error);
      setErrorMessage('Domicilio Incorrecto');
    }
  };

  // Estado para almacenar las listas de países, provincias y localidades
  const [paises, setPaises] = useState<IPais[]>([]);
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);

  // Cargar la lista de países al cargar el componente
  useEffect(() => {
    fetch(API_URL + `/pais`)
      .then((response) => response.json())
      .then((data) => setPaises(data));
  }, []);

  // Función para cargar las provincias según el país seleccionado
  const handlePaisChange = (paisId: string) => {
    fetch(API_URL + `/provincia/findByPais/${paisId}`)
      .then((response) => response.json())
      .then((data) => {
        setProvincias(data);
        setLocalidades([]);
        setFormData((prev) => ({ ...prev, idLocalidad: 0 })); // Reiniciar idLocalidad al cambiar de país
      });
  };

  // Función para cargar las localidades según la provincia seleccionada
  const handleProvinciaChange = (provinciaId: string) => {
    fetch(API_URL + `/localidad/findByProvincia/${provinciaId}`)
      .then((response) => response.json())
      .then((data) => {
        setLocalidades(data);
        setFormData((prev) => ({ ...prev, idLocalidad: 0 })); // Reiniciar idLocalidad al cambiar de provincia
      });
  };

  // Función para actualizar idLocalidad en formData cuando se selecciona una localidad
  const handleLocalidadChange = (localidadId: string) => {
    setFormData((prev) => ({ ...prev, idLocalidad: Number(localidadId) }));
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>Añadir Domicilio</h2>
          <img onClick={() => setShowDomicilio(false)} src={assets.cross_icon} alt="Cerrar" />
        </div>
        <div className="login-popup-inputs">
          <TextField
            type="text"
            name="calle"
            label="Calle"
            variant="outlined"
            value={formData.calle}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            type="number"
            name="cp"
            label="Código Postal"
            variant="outlined"
            value={formData.cp}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            type="number"
            name="nroDpto"
            label="Número de Departamento"
            variant="outlined"
            value={formData.nroDpto}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            type="number"
            name="numero"
            label="Número"
            variant="outlined"
            value={formData.numero}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            type="number"
            name="piso"
            label="Piso"
            variant="outlined"
            value={formData.piso}
            onChange={handleChange}
            fullWidth
          />

          <div>
            <label htmlFor="pais">País</label>
            <CFormSelect
              aria-label="País select example"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const paisId = e.target.value;
                handlePaisChange(paisId);
              }}
            >
              <option value="">Seleccione un país</option>
              {paises.map((pais) => (
                <option key={pais.id} value={pais.id}>
                  {pais.nombre}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div>
            <label htmlFor="provincia">Provincia</label>
            <CFormSelect
              aria-label="Provincia select example"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const provinciaId = e.target.value;
                handleProvinciaChange(provinciaId);
              }}
            >
              <option value="">Seleccione una provincia</option>
              {provincias.map((provincia) => (
                <option key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div>
            <label htmlFor="localidad">Localidad</label>
            <CFormSelect
              aria-label="Localidad select example"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const localidadId = e.target.value;
                handleLocalidadChange(localidadId);
              }}
            >
              <option value="">Seleccione una localidad</option>
              {localidades.map((localidad) => (
                <option key={localidad.id} value={localidad.id}>
                  {localidad.nombre}
                </option>
              ))}
            </CFormSelect>
          </div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Añadir</button>
      </form>
    </div>
  );
};
