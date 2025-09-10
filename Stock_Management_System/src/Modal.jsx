import React, { useState } from 'react';

const Modal = ({ isVisible, product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(0);

  if (!isVisible) return null;

  const handleSave = () => {
    if (quantity === 0) {
      alert("กรุณากรอกจำนวนที่ต้องการเพิ่ม/ลด");
      return;
    }
    onSave(product.productid, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>แก้ไขจำนวนสินค้า: {product?.productname}</h3>
        <p>จำนวนปัจจุบัน: {product?.initialquantity}</p>
        
        <div className="modal-input-group">
          <label htmlFor="quantity-input">จำนวนที่ต้องการเพิ่ม/ลด:</label>
          <input
            type="number"
            id="quantity-input"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-save" onClick={handleSave}>บันทึก</button>
          <button className="btn btn-cancel" onClick={onClose}>ยกเลิก</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;