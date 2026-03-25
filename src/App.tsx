import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const targetPresets = [
  { name: 'ศูนย์ยา', target: 450000 },
  { name: 'XXL', target: 300000 },
  { name: 'XL', target: 150000 },
  { name: 'L', target: 90000 },
  { name: 'M', target: 60000 },
  { name: 'S', target: 30000 },
];

export default function App() {
  const [branchName, setBranchName] = useState('สรุปยอดขาย (กรอกมือไวสุด!)');
  const [selectedPreset, setSelectedPreset] = useState(targetPresets[3]);
  
  const [products, setProducts] = useState([
    { id: 'p1', name: '339618 hof pro hmb', actual: 0 },
    { id: 'p2', name: '332647 Effer zinc+vit c', actual: 0 },
    { id: 'p3', name: '338854 FN goodnight', actual: 0 },
    { id: 'p4', name: '344656 Fitaday mag', actual: 0 },
    { id: 'p5', name: '344564 FN multi silver', actual: 0 },
    { id: 'p6', name: '311928 Penlol', actual: 0 },
  ]);

  const handleActualUpdate = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setProducts(products.map(p => p.id === id ? { ...p, actual: numValue } : p));
  };

  const handleClearAll = () => {
    if(window.confirm('ต้องการล้างยอดขายทั้งหมดเป็น 0 ใช่หรือไม่?')) {
      setProducts(products.map(p => ({ ...p, actual: 0 })));
    }
  };

  const totalActual = products.reduce((sum, p) => sum + p.actual, 0);
  const globalTarget = selectedPreset.target;
  const percentAchieved = ((totalActual / globalTarget) * 100).toFixed(1);
  const avgTargetPerItem = globalTarget / products.length;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <input 
          style={{ fontSize: '24px', fontWeight: 'bold', border: 'none', background: 'transparent', borderBottom: '2px solid #cbd5e1', outline: 'none', width: '300px', color: '#0f172a' }}
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleClearAll}
            style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#64748b' }}
          >
            🗑️ ล้างข้อมูล
          </button>
          <select 
            style={{ padding: '8px 16px', borderRadius: '8px', border: '2px solid #ff4d4f', fontWeight: 'bold', color: '#ff4d4f', cursor: 'pointer' }}
            value={selectedPreset.name} 
            onChange={(e) => {
              const preset = targetPresets.find(p => p.name === e.target.value);
              if (preset) setSelectedPreset(preset);
            }}
          >
            {targetPresets.map(p => <option key={p.name} value={p.name}>{p.name} ({p.target.toLocaleString()})</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        
        {/* Summary Card */}
        <div style={{ background: '#0f172a', color: '#fff', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>Total Actual / Target</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{totalActual.toLocaleString()} <span style={{fontSize:'20px', color:'#64748b'}}>/ {globalTarget.toLocaleString()}</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#4ade80', fontSize: '28px', fontWeight: 'bold' }}>{percentAchieved}%</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Achieved</div>
          </div>
        </div>

        {/* Input Section (Data Entry Mode) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {products.map((p, index) => (
            <div key={p.id} style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
              <input 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #e2e8f0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a', boxSizing: 'border-box', outlineColor: '#3b82f6' }}
                type="number"
                value={p.actual === 0 ? '' : p.actual} 
                onFocus={(e) => e.target.select()} // ไฮไลท์ดำตอนคลิก พิมพ์ทับได้เลยไม่ต้องลบ!
                onChange={(e) => handleActualUpdate(p.id, e.target.value)}
                tabIndex={index + 1} // กดปุ่ม Tab บนคีย์บอร์ดเพื่อเลื่อนช่องถัดไปได้เลย
              />
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div style={{ height: '400px', background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={products} margin={{ bottom: 40, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={60} style={{ fontSize: '11px', fill: '#64748b' }} tickLine={false} axisLine={false} />
              <YAxis style={{ fontSize: '11px', fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} formatter={(value: any) => [value.toLocaleString() + ' ฿', 'Actual']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
              <Bar dataKey="actual" radius={[6, 6, 0, 0]}>
                {products.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.actual >= avgTargetPerItem ? '#4ade80' : '#3b82f6'} />
                ))}
              </Bar>
              <ReferenceLine y={avgTargetPerItem} stroke="#ff4d4f" strokeDasharray="4 4" label={{ value: 'Avg Target', position: 'insideTopRight', fill: '#ff4d4f', fontSize: 12, fontWeight: 'bold' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
