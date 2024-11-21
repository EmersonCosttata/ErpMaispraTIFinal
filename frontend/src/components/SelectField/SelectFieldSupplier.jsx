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
  const [selectedOption, setSelectedOption] = useState(null); 

  const filteredOptions = (arrayOptions || []).filter((option) =>
    option.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
useEffect(()=>{
  if(value.suppliersFullName){
    setSearchTerm(value.suppliersFullName.fullName)
  }else{
    return
  }
},[value])
  useEffect(() => {
    if (selectedOption) {
      onChangeValue(selectedOption); 
    }
  }, [selectedOption, onChangeValue]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);

  
    const matchedOption = arrayOptions.find(
      (option) => option.fullName.toLowerCase() === e.target.value.toLowerCase()
    );
    if (matchedOption) {
      setSelectedOption(matchedOption);
    } else {
      setSelectedOption(null); 
    }
  };
  return (
    <div className={classNameDiv}>
      <label htmlFor={id} className="inputLabel">
        <span className="inputDescription">{label}</span>
        <input
          list="products"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          name={name}
          id={id}
          required={required}
          className={classNameSelect}
        />
        <datalist id="products">
          {filteredOptions.map((option) => (
             <option
             key={option.id}
             value={option.fullName} 
             label={`${option.status.toUpperCase()} | Nota: ${option.notes}`}
           />
          ))}
        </datalist>
      </label>
    </div>
  );
}

export default SelectFieldProduct;
