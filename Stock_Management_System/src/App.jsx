// src/App.jsx

import { useState, useEffect } from 'react';
import DB from './DB';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // แก้ไขชื่อตาราง 'product' เป็นตัวพิมพ์เล็ก
        const { data, error } = await DB
          .from('product')
          .select('*')
          // แก้ไขชื่อคอลัมน์ 'productid' เป็นตัวพิมพ์เล็ก
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

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="pos-container">
      <header className="header">
        <h1>ระบบจัดการสินค้า (POS)</h1>
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
                <th>จำนวนเริ่มต้น</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productid}>
                  {/* แก้ไขชื่อคอลัมน์เป็นตัวพิมพ์เล็ก */}
                  <td>{product.productid}</td>
                  <td>{product.productname}</td>
                  <td>{product.sku}</td>
                  <td>{product.price} บาท</td>
                  <td>{product.initialquantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;