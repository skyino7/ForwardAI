import React from 'react'

const Main = () => {
  return (
    <main style={{ marginTop: '58px' }}>
      <div className="container-fluid main">
        <h2 className='text-black'>Dashboard</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Nihil cum asperiores iusto. Eveniet veniam aliquam, quibusdam voluptate
            autem ab, voluptatibus nulla harum atque id est tempora soluta
            mollitia dolore asperiores.</p>

            <div class="row">
                <div class="col-lg-4">
                    <h2 className='text-black'>Column 1</h2>
                    <div className="card">
                        <div class="card-header">
                            Column 1
                        </div>
                        <div className="card-body">
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                            Nihil cum asperiores iusto. Eveniet veniam aliquam, quibusdam voluptate
                            autem ab, voluptatibus nulla harum atque id est tempora soluta
                            mollitia dolore asperiores.
                            </p>
                            <button className='btn btn-primary'>Save</button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <h2 className='text-black'>Column 2</h2>
                    <div className="card">
                        <div class="card-header">
                            Column 2
                        </div>
                        <div className="card-body">
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                            Nihil cum asperiores iusto. Eveniet veniam aliquam, quibusdam voluptate
                            autem ab, voluptatibus nulla harum atque id est tempora soluta
                            mollitia dolore asperiores.
                            </p>
                            <button className='btn btn-primary'>Save</button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <h2 className='text-black'>Column 3</h2>
                    <div className="card">
                        <div class="card-header">
                            Column 3
                        </div>
                        <div className="card-body">
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                            Nihil cum asperiores iusto. Eveniet veniam aliquam, quibusdam voluptate
                            autem ab, voluptatibus nulla harum atque id est tempora soluta
                            mollitia dolore asperiores.
                            </p>
                            <button className='btn btn-primary'>Save</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div class="row">
                <div class="column">Column 1</div>
                <div class="column">Column 2</div>
                <div class="column">Column 3</div>
            </div> */}

            {/* <div class="main-panel">
                <div class="content-wrapper">
                <div class="row">
                    <div class="col-lg-6 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                        <h4 class="card-title">Line chart</h4>
                        <canvas id="lineChart"></canvas>
                        </div>
                    </div>
                    </div>
                    <div class="col-lg-6 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                        <h4 class="card-title">Bar chart</h4>
                        <canvas id="barChart"></canvas>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                        <h4 class="card-title">Area chart</h4>
                        <canvas id="areaChart"></canvas>
                        </div>
                    </div>
                    </div>
                    <div class="col-lg-6 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                        <h4 class="card-title">Doughnut chart</h4>
                        <canvas id="doughnutChart"></canvas>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 grid-margin grid-margin-lg-0 stretch-card">
                    <div class="card">
                        <div class="card-body">
                        <h4 class="card-title">Pie chart</h4>
                        <canvas id="pieChart"></canvas>
                        </div>
                    </div>
                    </div>
                    <div class="col-lg-6 grid-margin grid-margin-lg-0 stretch-card">
                    <div class="card">
                        <div class="card-body">
                        <h4 class="card-title">Scatter chart</h4>
                        <canvas id="scatterChart"></canvas>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div> */}

      </div>
    </main>
  )
}

export default Main