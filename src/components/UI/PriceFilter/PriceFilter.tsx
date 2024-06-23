
import React from 'react';
import "./PriceFilter.css"

interface PriceFilterProps {
  filterOption: string;
  setFilterOption: (option: string) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ filterOption, setFilterOption }) => {
  return (
    <div className="price-filter-container">
      <label>Ordenar por precio:</label>
      <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
        <option value="default">Seleccionar</option>
        <option value="priceAsc">Menor a mayor</option>
        <option value="priceDesc">Mayor a menor</option>
      </select>
    </div>
  );
};

export default PriceFilter;
