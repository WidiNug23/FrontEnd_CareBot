import React, { useState, useEffect } from 'react';
import axios from 'axios';

function IbuHamilCrud() {
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState({ nutrisi: '', sumber: '', jumlah: '', deskripsi: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editId, setEditId] = useState(null);
  const [payload, setPayload] = useState('');


  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/ibu_hamil');
      setData(response.data);
      setError(null); // Clear any previous error
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal memuat data. Silakan coba lagi.');
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Validate data input
  const validateInput = () => {
    if (!newData.nutrisi || !newData.sumber || !newData.jumlah || !newData.deskripsi) {
      setError('Semua bidang wajib diisi.');
      return false;
    }
    setError(null); // Clear error if validation passes
    return true;
  };

  // Create new data
  const handleCreate = async () => {
    if (!validateInput()) return;

    const formData = new FormData();
    formData.append('judul', newData.judul);
    formData.append('isi', newData.isi);
    formData.append('kategori', newData.kategori);
    if (newData.gambar) {
        formData.append('gambar', newData.gambar);
    }

    try {
        const response = await axios.post('http://localhost:8080/berita_remaja', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setData((prevData) => [...prevData, response.data]);
        clearForm();
        setSuccess('Data berhasil ditambahkan.');
    } catch (error) {
        console.error('Error creating data:', error.response ? error.response.data : error.message);
        setError('Gagal menambahkan data. Silakan coba lagi.');
    }
};

const handleEdit = (item) => {
    setEditId(item.id);
    setNewData({ judul: item.judul, isi: item.isi, kategori: item.kategori, gambar: null });
    setSuccess(null);
    setError(null);
};

const handleUpdate = async () => {
    if (!validateInput()) return;

    const formData = new FormData();
    formData.append('judul', newData.judul);
    formData.append('isi', newData.isi);
    formData.append('kategori', newData.kategori);
    if (newData.gambar) {
        formData.append('gambar', newData.gambar);
    }

    try {
        await axios.put(`http://localhost:8080/berita_remaja/${editId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        await fetchData();
        clearForm(); // Reset form after successful update
        setSuccess('Data berhasil diperbarui.'); // Success message
    } catch (error) {
        console.error('Error updating data:', error.response ? error.response.data : error.message);
        setError('Gagal memperbarui data. Silakan coba lagi.'); // Error message
    }
};

  // Delete data
  const handleDelete = async (id) => {
    if (!window.confirm('Anda yakin ingin menghapus data ini?')) return;

    try {
        const response = await axios.delete(`http://localhost:8080/ibu_hamil/delete/${id}`);
        console.log('Delete response:', response); // Log response
        if (response.status === 200 || response.status === 204) {
            setData(data.filter((item) => item.id !== id));
            setSuccess('Data berhasil dihapus.');
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        setError('Gagal menghapus data. Silakan coba lagi.');
    }
};


  // Clear form and messages
  const clearForm = () => {
    setNewData({ nutrisi: '', sumber: '', jumlah: '', deskripsi: '' });
    setEditId(null);
    setError(null);
    setSuccess(null);
  };

  // Generate payload from data
  const generatePayload = () => {
    const payloadData = {
      richContent: [
        [
          {
            subtitle: "Berikut adalah informasi nutrisi yang dibutuhkan",
            type: "list",
            title: "Informasi Nutrisi"
          },
          { type: "divider" },
          ...data.map(item => ({
            subtitle: `${item.sumber} - ${item.jumlah}`,
            type: "list",
            title: item.nutrisi
          })),
        ]
      ]
    };
    setPayload(JSON.stringify(payloadData, null, 2));
  };

  // Copy payload to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(payload).then(() => {
      alert('Payload tersalin!');
    }, (err) => {
      console.error('Error copying payload:', err);
    });
  };

  return (
    <div className="crud-container">
      <h2>Kelola Data Nutrisi Ibu Hamil</h2>
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      {success && <p className="success" style={{ color: 'green' }}>{success}</p>}
      
      <div className="crud-form">
        <input
          type="text"
          name="nutrisi"
          placeholder="Nutrisi"
          value={newData.nutrisi}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="sumber"
          placeholder="Sumber"
          value={newData.sumber}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="jumlah"
          placeholder="Jumlah"
          value={newData.jumlah}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="deskripsi"
          placeholder="Deskripsi"
          value={newData.deskripsi}
          onChange={handleInputChange}
        />
        {editId ? (
          <>
            <button onClick={handleUpdate}>Perbarui Data</button>
            <button onClick={clearForm}>Batal</button>
          </>
        ) : (
          <button onClick={handleCreate}>Tambah Data</button>
        )}
      </div>

      <button onClick={generatePayload}>Generate Payload</button>
      <button onClick={copyToClipboard} disabled={!payload}>Salin Payload</button>
      
      {payload && (
        <pre style={{ background: '#f4f4f4', padding: '10px', marginTop: '10px' }}>
          {payload}
        </pre>
      )}
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nutrisi</th>
            <th>Sumber</th>
            <th>Jumlah</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nutrisi}</td>
              <td>{item.sumber}</td>
              <td>{item.jumlah}</td>
              <td>{item.deskripsi}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IbuHamilCrud;
