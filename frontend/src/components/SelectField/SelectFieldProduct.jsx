import { useState, useEffect } from "react";

function SelectFieldProduct({
  label,
  name,
  id,
  value,
  onInvalid,
  onChange,
  onChangeValue,
  arrayOptions,
  required = true,
  placeholder = "Selecione...",
  classNameSelect = "",
  classNameDiv = "",
}) {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedProduct, setSelectedProduct] = useState(null); 

 
  const filteredOptions = (arrayOptions || []).filter((option) =>
    option.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    if (selectedProduct) {
      onChangeValue([selectedProduct]);
    }
  }, [selectedProduct]);

  const handleSelect = (e) => {
    const selectedName = e.target.value; 
    setSearchTerm(selectedName);
    const matchedProduct = arrayOptions.find(
      (option) => option.name === selectedName
    );
    if (matchedProduct) {
      setSelectedProduct(matchedProduct); 
    } else {
      setSelectedProduct(null);
    }
  };

  return (
    <div className={classNameDiv}>
      <label htmlFor={id} className="inputLabel">
        <span className="inputDescription">{label}</span>

        <input
          list="products"
          placeholder={placeholder}
          onChange={(e) => setSearchTerm(e.target.value)} 
          onInput={handleSelect}
          value={searchTerm}
          required={required}
        />

        <datalist id="products">
          {filteredOptions.map((option) => (
            <option
              key={option.id}
              value={option.name} 
              label={`Disponível: ${option.availableForSale} - Reservado: ${option.reservedStock} - R$ ${option.productPrice.toFixed(2)}`}
            />
          ))}
        </datalist>
      </label>
    </div>
  );
}

export default SelectFieldProduct;
