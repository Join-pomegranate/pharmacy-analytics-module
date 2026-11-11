import React from 'react';
import { createRoot } from 'react-dom/client';
import { Controller } from './lib/Controller.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<Controller role="Administrator" />);
