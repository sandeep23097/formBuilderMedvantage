import React from 'react';

function SelectedCoulmnsComponent({ database, idChecked, valueChecked, handleCheckboxChange }) {
  return (
    <div>
         <label>
         <span>{database}</span>
         </label>
      <label>
     
        <input
          type="checkbox"
          checked={idChecked}
          onChange={() => handleCheckboxChange(database, 'id')}
        />
        ID
      </label>
      <label>
        <input
          type="checkbox"
          checked={valueChecked}
          onChange={() => handleCheckboxChange(database, 'value')}
        />
        Value
      </label>
    </div>
  );
}

export default SelectedCoulmnsComponent;
