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
        <div className='col-md-6'>
            <div className="card">
            <div class="card-header">
                  <h1>Upload CSV File</h1>
                </div>
            <div className="card-body">
                <div className="input-group">
                    <input type="file" class="form-control" id="inputGroupFile01" onChange={handleFileChange} />
                    <button className="input-group-text btn btn-primary" for="inputGroupFile01" onClick={handleUpload}>Upload</button>
                    {/* <input type="file" onChange={handleFileChange} />
                    <button className='btn btn-primary' onClick={handleUpload}>Upload</button> */}
                </div>
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
        </div>
    );
}

export default UploadCsv;
