import { useEffect, useState } from 'react';
import api from '../api/axios';

interface MedicationLog {
  id: number;
  name: string;
  dose_mg: number;
  brand_name: string;
  prescribed_on: string;
  taken_at: string;
}

export default function Medications() {
  const [medications, setMedications] = useState<MedicationLog[]>([]);

  useEffect(() => {
    api.get('medicationlogs/')
      .then(res => setMedications(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>💊 Medication History</h2>
      {medications.map(med => (
        <div key={med.id}>
          {med.name} ({med.brand_name}) — {med.dose_mg} mg<br />
          Prescribed: {new Date(med.prescribed_on).toLocaleDateString()}<br/>
          Taken: {new Date(med.taken_at).toLocaleString()}
          <hr />
        </div>
      ))}
    </div>
  );
}
