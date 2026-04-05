import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AdminDashboard = () => {
  const [bulkData, setBulkData] = useState(''); // Textarea input
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch existing authorized students
  const fetchStudents = async () => {
    const { data } = await supabase.from('authorized_students').select('*').order('created_at', { ascending: false });
    setStudents(data || []);
  };

  useEffect(() => { fetchStudents(); }, []);

  // 2. Handle Bulk Insert (Format: CNIC, RollNo per line)
  const handleBulkAdd = async () => {
    setLoading(true);
    const lines = bulkData.split('\n').filter(line => line.trim() !== '');
    
    const insertData = lines.map(line => {
      const [cnic, roll_number] = line.split(',').map(item => item.trim());
      return { cnic, roll_number };
    });

    const { error } = await supabase.from('authorized_students').insert(insertData);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Students added successfully!");
      setBulkData('');
      fetchStudents();
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin - Student Authorization</h1>
      
      {/* Bulk Add Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Bulk Add Students</h2>
        <p className="text-sm text-gray-500 mb-4">Format: <code className="bg-gray-100 p-1 text-red-500">CNIC, RollNumber</code> (One per line)</p>
        
        <textarea 
          className="w-full h-32 border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="42101-1234567-1, 1001&#10;42101-7654321-2, 1002"
          value={bulkData}
          onChange={(e) => setBulkData(e.target.value)}
        />
        
        <button 
          onClick={handleBulkAdd}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Adding...' : 'Add Students to List'}
        </button>
      </div>

      {/* Authorized Students List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">CNIC</th>
              <th className="p-4 font-semibold">Roll Number</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-4">{s.cnic}</td>
                <td className="p-4">{s.roll_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;