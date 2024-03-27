import React, { useState } from 'react'
import Topbar from './Topbar'
import UploadCsv from './UploadCsv'

const Main = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('sqlFile', selectedFile);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      setMessage(data);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      setMessage('SQL script executed successfully');
    });
  };

  return (
    <div className="container-fluid">
        <div className="row flex-nowrap">
            <Topbar/>
            <div className="col py-3 pt-5">
              <div className="container">
              <h3 className='py-3'>Welcome, Seth!</h3>
                <div className="row">
              <div className="col-md-6">
                <div className='card mr-5'>
                <div class="card-header">
                  <h1>Upload SQL Script</h1>
                </div>
                <div class="card-body">
                  <div className="input-group">
                    <input type="file" class="form-control" id="inputGroupFile01" onChange={handleFileChange} />
                    <button className="input-group-text btn btn-primary" for="inputGroupFile01" onClick={handleUpload}>Upload</button>
                    {/* <input type="file" onChange={handleFileChange} />
                    <button className="btn btn-primary" onClick={handleUpload}>Upload</button> */}
                  </div>
                  {message && <p className="mt-3 p-3 mb-2 bg-info text-white">{message}</p>}
                </div>
              </div>
              </div>
                <UploadCsv />
              </div>
            </div>
            </div>
        </div>
    </div>

  )
}

export default Main