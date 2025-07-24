import React, { useEffect, useState } from 'react';
import api from '../api/axios';

interface Medication {
  id: number;
  name: string;
  dose_mg: number;
  brand_name: string;
  prescribed_on: string;
  taken_at: string;
}

const Medications: React.FC = () => {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [brand, setBrand] = useState('');
  const [prescribedOn, setPrescribedOn] = useState('');
  const [meds, setMeds] = useState<Medication[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchMeds();
  }, []);

  const fetchMeds = async () => {
    const response = await api.get('/medications/');
    setMeds(response.data);
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      dose_mg: parseFloat(dose),
      brand_name: brand,
      prescribed_on: prescribedOn,
      taken_at: new Date().toISOString(),
    };

    if (editId !== null) {
      const response = await api.put(`/medications/${editId}/`, payload);
      setMeds(meds.map((m) => (m.id === editId ? response.data : m)));
      setEditId(null);
    } else {
      const response = await api.post('/medications/', payload);
      setMeds([...meds, response.data]);
    }

    setName('');
    setDose('');
    setBrand('');
    setPrescribedOn('');
  };

  const handleEdit = (med: Medication) => {
    setName(med.name);
    setDose(med.dose_mg.toString());
    setBrand(med.brand_name);
    setPrescribedOn(med.prescribed_on);
    setEditId(med.id);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/medications/${id}/`);
    setMeds(meds.filter((m) => m.id !== id));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>💊 Medications</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={dose} onChange={(e) => setDose(e.target.value)} placeholder="Dose (mg)" />
      <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand" />
      <input type="date" value={prescribedOn} onChange={(e) => setPrescribedOn(e.target.value)} />
      <button onClick={handleSubmit}>{editId !== null ? 'Update' : 'Add'} Medication</button>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {meds.map((med) => (
          <li key={med.id}>
            {med.name} ({med.dose_mg}mg) - {med.brand_name}, prescribed on {med.prescribed_on}
            <button onClick={() => handleEdit(med)}>Edit</button>
            <button onClick={() => handleDelete(med.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Medications;
