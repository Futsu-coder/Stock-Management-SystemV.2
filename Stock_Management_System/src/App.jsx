// src/App.jsx

import { useState, useEffect } from 'react';
import DB from './DB';
import Modal from './Modal';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await DB
          .from('product')
          .select('*')
          .order('productid', { ascending: true });

        if (error) throw error;
        
        setProducts(data);
      } catch (e) {
        setError('ไม่สามารถโหลดข้อมูลสินค้าได้: ' + e.message);
        console.error('Error fetching products:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);  

  const handleUpdateQuantity = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  // สร้างฟังก์ชันสำหรับปิด Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
   // สร้างฟังก์ชันเพื่อจัดการการบันทึกจำนวนสินค้า
const handleSaveQuantity = async (productId, quantity) => {
  try {
    const productToUpdate = products.find(p => p.productid === productId);
    if (!productToUpdate) throw new Error("ไม่พบสินค้า");

    // คำนวณจำนวนใหม่
    // หาก quantity เป็นบวกจะเพิ่ม หากเป็นลบจะลด
    const newQuantity = productToUpdate.initialquantity + quantity;

    const { error } = await DB
      .from('product')
      .update({ initialquantity: newQuantity })
      .eq('productid', productId);
    
    if (error) throw error;

    setProducts(products.map(p => 
      p.productid === productId ? { ...p, initialquantity: newQuantity } : p
    ));

    console.log('อัปเดตจำนวนสินค้าสำเร็จ!');

  } catch (e) {
    setError('ไม่สามารถอัปเดตจำนวนสินค้าได้: ' + e.message);
    console.error('Error updating quantity:', e);
  }
};

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="error">{error}</div>;

  return (

    <div className="pos-container">
      <header className="header">
        <h1>คลังสินค้า</h1>
      </header>
      <main className="main-content">
        <h2>รายการสินค้า</h2>
        <div className="product-list-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ชื่อสินค้า</th>
                <th>SKU</th>
                <th>ราคา</th>
                <th>จำนวน</th>
                <th>เกณฑ์ขั้นต่ำ</th>
                <th>รายการเพิ่มเติม</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productid}>
                  <td>{product.productid}</td>
                  <td>{product.productname}</td>
                  <td>{product.sku}</td>
                  <td>{product.price} บาท</td>
                  <td>{product.initialquantity} ชิ้น</td>
                  <td>{product.minimumcriteria} ชิ้น</td>
                  <td><button onClick={() => handleUpdateQuantity(product)}>
                      เพิ่มลดจำนวนสินค้า
                    </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {}
      <Modal
        isVisible={isModalOpen}
        product={selectedProduct}
        onClose={closeModal}
        onSave={handleSaveQuantity}
      />
    </div>
  );
}
export default App;

