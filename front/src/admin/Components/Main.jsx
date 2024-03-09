import React, { useState } from 'react'
import Topbar from './Topbar'

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
      setMessage('Error uploading file');
    });
  };

//   return (
//     <div className="container mt-5">
//       <h1>Upload SQL Script</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button className="btn btn-primary mt-3" onClick={handleUpload}>Upload</button>
//       {message && <p className="mt-3">{message}</p>}
//     </div>
//   );

  return (
    // <main style={{ marginTop: '58px' }}>
    //   <div className="container-fluid main">
    //     <h2 className='text-black'>Dashboard</h2>
    //     <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
    //         Nihil cum asperiores iusto. Eveniet veniam aliquam, quibusdam voluptate
    //         autem ab, voluptatibus nulla harum atque id est tempora soluta
    //         mollitia dolore asperiores.</p>

    //         <div class="row">
    //             <div class="col-lg-4">
    //                 <h2 className='text-black'>Column 1</h2>
    //                 <div className="card">
    //                     <div class="card-header">
    //                         Column 1
    //                     </div>
    //                     <div className="card-body">
    //                         <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
    //                         Nihil cum asperiores iusto. Eveniet veniam aliquam, quibusdam voluptate
    //                         autem ab, voluptatibus nulla harum atque id est tempora soluta
    //                         mollitia dolore asperiores.
    //                         </p>
    //                         <button className='btn btn-primary'>Save</button>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div class="col-lg-4">
    //                 <h2 className='text-black'>Column 2</h2>
    //                 <div className="card">
    //                     <div class="card-header">
    //                         Column 2
    //                     </div>
    //                     <div className="card-body">
    //                         <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
    //                         Nihil cum asperiores iusto. Eveniet veniam aliquam, quibusdam voluptate
    //                         autem ab, voluptatibus nulla harum atque id est tempora soluta
    //                         mollitia dolore asperiores.
    //                         </p>
    //                         <button className='btn btn-primary'>Save</button>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div class="col-lg-4">
    //                 <h2 className='text-black'>Column 3</h2>
    //                 <div className="card">
    //                     <div class="card-header">
    //                         Column 3
    //                     </div>
    //                     <div className="card-body">
    //                         <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
    //                         Nihil cum asperiores iusto. Eveniet veniam aliquam, quibusdam voluptate
    //                         autem ab, voluptatibus nulla harum atque id est tempora soluta
    //                         mollitia dolore asperiores.
    //                         </p>
    //                         <button className='btn btn-primary'>Save</button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>

    //         {/* <div class="row">
    //             <div class="column">Column 1</div>
    //             <div class="column">Column 2</div>
    //             <div class="column">Column 3</div>
    //         </div> */}

    //         {/* <div class="main-panel">
    //             <div class="content-wrapper">
    //             <div class="row">
    //                 <div class="col-lg-6 grid-margin stretch-card">
    //                 <div class="card">
    //                     <div class="card-body">
    //                     <h4 class="card-title">Line chart</h4>
    //                     <canvas id="lineChart"></canvas>
    //                     </div>
    //                 </div>
    //                 </div>
    //                 <div class="col-lg-6 grid-margin stretch-card">
    //                 <div class="card">
    //                     <div class="card-body">
    //                     <h4 class="card-title">Bar chart</h4>
    //                     <canvas id="barChart"></canvas>
    //                     </div>
    //                 </div>
    //                 </div>
    //             </div>
    //             <div class="row">
    //                 <div class="col-lg-6 grid-margin stretch-card">
    //                 <div class="card">
    //                     <div class="card-body">
    //                     <h4 class="card-title">Area chart</h4>
    //                     <canvas id="areaChart"></canvas>
    //                     </div>
    //                 </div>
    //                 </div>
    //                 <div class="col-lg-6 grid-margin stretch-card">
    //                 <div class="card">
    //                     <div class="card-body">
    //                     <h4 class="card-title">Doughnut chart</h4>
    //                     <canvas id="doughnutChart"></canvas>
    //                     </div>
    //                 </div>
    //                 </div>
    //             </div>
    //             <div class="row">
    //                 <div class="col-lg-6 grid-margin grid-margin-lg-0 stretch-card">
    //                 <div class="card">
    //                     <div class="card-body">
    //                     <h4 class="card-title">Pie chart</h4>
    //                     <canvas id="pieChart"></canvas>
    //                     </div>
    //                 </div>
    //                 </div>
    //                 <div class="col-lg-6 grid-margin grid-margin-lg-0 stretch-card">
    //                 <div class="card">
    //                     <div class="card-body">
    //                     <h4 class="card-title">Scatter chart</h4>
    //                     <canvas id="scatterChart"></canvas>
    //                     </div>
    //                 </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div> */}

    //   </div>
    // </main>

    <div className="container-fluid">
        <div className="row flex-nowrap">
            <Topbar/>
            <div class="col py-3 pt-5 p col-lg-4">
              <div className="card">
                <div class="card-header">
                  <h1>Upload SQL Script</h1>
                </div>
                <div class="card-body">
                  {/* <div className="card-title">
                    <h1>Upload SQL Script</h1>
                  </div> */}
                  <input type="file" onChange={handleFileChange} />
                  <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
                  {message && <p className="mt-3 p-3 mb-2 bg-danger text-white">{message}</p>}
                </div>
              </div>
            </div>
        </div>
    </div>

  )
}

export default Main