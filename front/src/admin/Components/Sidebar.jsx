import React from 'react'

const Sidebar = () => {
  return (
    <aside>
      <div class="container">
        <h2>Sidebar</h2>
        <nav className='sidebar'>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Analysis</a></li>
            <li><a href="#">Query</a></li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar