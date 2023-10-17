import React, { Component } from 'react';
import { BrowserRouter ,Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';
import { AccountForm } from './components/AccountForm';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
        <Layout>
            <Routes>
                <Route path='/' element={<AccountForm />} />
                </Routes>
      </Layout>
    );
  }
}
