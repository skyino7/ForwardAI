import React, { useState } from 'react';

function UploadCsv() {
    const [file, setFile] = useState(null);
    const [columns, setColumns] = useState([]);
    const [uploaded, setUploaded] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);

        // Extract column headers from CSV file
        const reader = new FileReader();
        reader.onload = (event) => {
            const csvData = event.target.result;
            const lines = csvData.split('\n');
            if (lines.length > 0) {
                const headers = lines[0].split(',');
                setColumns(headers);
            }
        };
        reader.readAsText(e.target.files[0]);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('csvFile', file);

        fetch('http://localhost:5000/upload-csv', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            // setUploaded(true);
            setMessage(data);
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            setMessage('Error uploading file');
        });
    };

    return (
        <div className='card my-5'>
            <div class="card-header">
                  <h1>Upload CSV Script</h1>
                </div>
            <div className="card-body">
            <input type="file" onChange={handleFileChange} />
            <button className='btn btn-primary' onClick={handleUpload}>Upload</button>
            {columns.length > 0 && (
                <div>
                    <h3>Column Headers</h3>
                    <ul>
                        {columns.map((column, index) => (
                            <li key={index}>{column}</li>
                        ))}
                    </ul>
                </div>
            )}
            {message && (
                <p className='mt-3 p-3 mb-2 bg-info text-white'>{message}</p>
            )}
            </div>
        </div>
    );
}

export default UploadCsv;
