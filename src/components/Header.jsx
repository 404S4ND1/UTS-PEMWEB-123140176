import React from 'react';

function Header({ onThemeToggle }) {
  return (
    <header className="app-header">
      <h1>📚 Book Library- Sandi</h1>
      <nav>
        <a href="#search">Search</a>
        <a href="#reading-list">Reading List</a>
        
        <button className="theme-toggle-btn" onClick={onThemeToggle}>
          Ganti Tema
        </button>
      </nav>
    </header>
  );
}

export default Header;