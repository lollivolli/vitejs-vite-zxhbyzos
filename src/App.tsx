import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

// ตาราง Target ตามรูปที่คุณส่งมา
const targetPresets = [
  { name: 'ศูนย์ยา', target: 450000 },
  { name: 'XXL', target: 300000 },
  { name: 'XL', target: 150000 },
  { name: 'L', target: 90000 },
  { name: 'M', target: 60000 },
  { name: 'S', target: 30000 },
];

export default function App() {
  const [branchName, setBranchName] = useState('ระบุชื่อสาขา/หัวข้อสรุป');
  const [selectedPreset, setSelectedPreset] = useState(targetPresets[3]); // เริ่มที่ L (90,000)
  
  // ล้างค่า Actual เป็น 0 ทั้งหมดเพื่อให้คุณกรอกเอง
 const [products, setProducts] = useState([
    { id: 'p1', name: '339618 Hof pro hmb', actual: 0 },
    { id: 'p2', name: '332647 Effer zinc+vit c', actual: 0 },
    { id: 'p3', name: '338854 FN goodnight', actual: 0 },
    { id: 'p4', name: '344656 FN magnesium', actual: 0 },
    { id: 'p5', name: '344564 FN multi silver', actual: 0 },
    { id: 'p6', name: '311928 MW Penlol', actual: 0 },
  ]);

  const handleActualUpdate = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setProducts(products.map(p => p.id === id ? { ...p, actual: numValue } : p));
  };

  const handlePresetChange = (presetName: string) => {
    const preset = targetPresets.find(p => p.name === presetName);
    if (preset) setSelectedPreset(preset);
  };

  const totalActual = products.reduce((sum, p) => sum + p.actual, 0);
  const globalTarget = selectedPreset.target;
  const percentAchieved = ((totalActual / globalTarget) * 100).toFixed(1);
  const avgTargetPerItem = globalTarget / products.length;

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#fdfdfd', minHeight: '100vh', color: '#333' }}>
      
      {/* ส่วนหัว: ชื่อสาขา และ ตัวเลือก Target */}
      <div style={{ borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#1a1a1a' }}>📊 Product KPI Dashboard</h1>
          <input 
            style={{ border: 'none', borderBottom: '1px solid #ddd', fontSize: '18px', color: '#666', marginTop: '10px', outline: 'none', width: '80%', padding: '5px' }}
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="คลิกเพื่อพิมพ์ชื่อสาขา..."
          />
        </div>
        
        <div style={{ minWidth: '250px', background: '#fff', padding: '15px', borderRadius: '12px', border: '1.5px solid #ff4d4f', boxShadow: '0 4px 10px rgba(255, 77, 79, 0.1)' }}>
             <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#ff4d4f', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>SELECT TARGET SIZE</label>
             <select 
               style={{ width: '100%', padding: '10px', fontSize: '18px', fontWeight: 'bold', borderRadius: '6px', border: '1px solid #ddd', color: '#d4380d', cursor: 'pointer' }}
               value={selectedPreset.name} 
               onChange={(e) => handlePresetChange(e.target.value)}
             >
                {targetPresets.map(preset => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name} ({preset.target.toLocaleString()})
                  </option>
                ))}
             </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '40px' }}>
        
        {/* คอลัมน์ซ้าย: ช่องกรอกตัวเลข */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '20px', background: '#141414', borderRadius: '12px', color: '#fff', marginBottom: '25px' }}>
            <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '5px' }}>Total Actual (ยอดขายรวมทั้งหมด)</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalActual.toLocaleString()} บาท</div>
            <div style={{ fontSize: '14px', marginTop: '5px', color: '#52c41a' }}>Progress: {percentAchieved}%</div>
          </div>

          <h3 style={{ fontSize: '15px', color: '#64748b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ระบุยอดขายรายสินค้า</h3>
          {products.map(p => (
            <div key={p.id} style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', fontWeight: 'bold' }}>{p.name}</div>
              <input 
                style={{ width: '92%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', fontWeight: '600', color: '#1e293b', outlineColor: '#1890ff' }}
                type="number"
                placeholder="0"
                value={p.actual || ''} // แสดงเป็นช่องว่างถ้าค่าเป็น 0 เพื่อให้กรอกง่าย
                onChange={(e) => handleActualUpdate(p.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* คอลัมน์ขวา: กราฟและการแสดงผล */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: '500px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Actual Sales by Product</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '25px' }}>เปรียบเทียบยอดขายรายชิ้นกับเส้นเป้าหมายเฉลี่ย ({selectedPreset.name})</p>
            
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={products} margin={{ top: 10, right: 30, left: 20, bottom: 90 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={100} style={{ fontSize: '11px' }} />
                <YAxis style={{ fontSize: '11px' }} axisLine={false} tickLine={false} tickFormatter={(val) => val.toLocaleString()} />
                <Tooltip cursor={{fill: '#f8fafc'}} formatter={(val: number) => val.toLocaleString() + ' บาท'} />
                
                <Bar dataKey="actual" radius={[6, 6, 0, 0]} barSize={55}>
                  {products.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.actual > avgTargetPerItem ? '#52c41a' : '#3b82f6'} />
                  ))}
                </Bar>
                
                {/* เส้น Reference ขยับตาม Dropdown */}
                <ReferenceLine y={avgTargetPerItem} label={{ position: 'right', value: `Target`, fill: '#ff4d4f', fontSize: 10, fontWeight: 'bold' }} stroke="#ff4d4f" strokeDasharray="4 4" strokeWidth={2}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* แถบ Progress ด้านล่าง */}
          <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
             <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Overall Progress: {selectedPreset.name} Target ({globalTarget.toLocaleString()} บาท)</h3>
             <div style={{ width: '100%', height: '14px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(Number(percentAchieved), 100)}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #1890ff 0%, #52c41a 100%)', 
                  transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                }} />
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '13px', fontWeight: 'bold' }}>
                <span style={{color: '#94a3b8'}}>0%</span>
                <span style={{ color: '#1e293b' }}>{totalActual.toLocaleString()} / {globalTarget.toLocaleString()} บาท</span>
                <span style={{color: '#94a3b8'}}>100%</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
