import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import ReadDonationCategory from "./pages/DonationCategories/ReadDonationCategory";
import CreateDonationCategory from "./pages/DonationCategories/CreateDonationCategory";
import EditDonationCategory from "./pages/DonationCategories/EditDonationCategory";
import ShowDonationCategory from "./pages/DonationCategories/ShowDonationCategory";

import ReadExpenseCategory from "./pages/ExpenseCategories/ReadExpenseCategory";
import CreateExpenseCategory from "./pages/ExpenseCategories/CreateExpenseCategory";
import EditExpenseCategory from "./pages/ExpenseCategories/EditExpenseCategory";
import ShowExpenseCategory from "./pages/ExpenseCategories/ShowExpenseCategory";

import ReadPaymentMethod from "./pages/Settings/PaymentMethods/ReadPaymentMethod";
import CreatePaymentMethod from "./pages/Settings/PaymentMethods/CreatePaymentMethod";
import EditPaymentMethod from "./pages/Settings/PaymentMethods/EditPaymentMethod";

import Layout from './Components/Layout';

import ReadCurrency from './pages/Settings/ManageCurrencies/ReadCurrency';
import CreateCurrency from './pages/Settings/ManageCurrencies/CreateCurrency';
import EditCurrency from './pages/Settings/ManageCurrencies/EditCurrency';
import ShowCurrency from './pages/Settings/ManageCurrencies/ShowCurrency';

import EditSetting from './pages/Settings/EmailSettings/EditSetting';

import EditGeneralSetting from './pages/Settings/GeneralSettings/EditGeneralSetting';

import ReadBankAccount from './pages/BankAccounts/ReadBankAccount';
import CreateBankAccount from './pages/BankAccounts/CreateBankAccount';
import EditBankAccount from './pages/BankAccounts/EditBankAccount';
import ShowBankAccount from './pages/BankAccounts/ShowBankAccount';

import ReadDonation from './pages/Donations/ReadDonation';
import CreateDonation from './pages/Donations/CreateDonation';
import EditDonation from './pages/Donations/EditDonation';
import ShowDonation from './pages/Donations/ShowDonation';

import ReadWireTransfer from './pages/WireTransfers/ReadWireTransfer';
import CreateWireTransfer from './pages/WireTransfers/CreateWireTransfer';
import EditWireTransfer from './pages/WireTransfers/EditWireTransfer';
import ShowWireTransfer from './pages/WireTransfers/ShowWireTransfer';

import ReadExpense from './pages/Expenses/ReadExpense';
import CreateExpense from './pages/Expenses/CreateExpense';
import EditExpense from './pages/Expenses/EditExpense';
import ShowExpense from './pages/Expenses/ShowExpense';

import ReadRole from './pages/roles/ReadRole';
import CreateRole from './pages/roles/CreateRole';
import EditRole from './pages/roles/EditRole';
import ShowRole from './pages/roles/ShowRole';

import ReadPermission from './pages/Permissions/ReadPermission';
import CreatePermission from './pages/Permissions/CreatePermission';
import EditPermission from './pages/Permissions/EditPermission';

import ReadUser from './pages/Users/ReadUser';
import CreateUser from './pages/Users/CreateUser';
import EditUser from './pages/Users/EditUser';
import ShowUser from './pages/Users/ShowUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={ <Layout> <Dashboard /> </Layout>} />

        {/* Donation Category routes */}
        <Route path="/donation-categories" element={ <Layout> <ReadDonationCategory /> </Layout> } />
        <Route path="/donation-categories/create" element={ <Layout> <CreateDonationCategory /> </Layout> } />
        <Route path="/donation-categories/edit/:id" element={ <Layout> <EditDonationCategory /> </Layout> } />
        <Route path="/donation-categories/show/:id" element={ <Layout> <ShowDonationCategory /> </Layout> } />

        {/* Expense Category routes */}
        <Route path="/expense-categories" element={ <Layout> <ReadExpenseCategory /> </Layout> } />
        <Route path="/expense-categories/create" element={ <Layout> <CreateExpenseCategory /> </Layout> } />
        <Route path="/expense-categories/edit/:id" element={ <Layout> <EditExpenseCategory /> </Layout> } />
        <Route path="/expense-categories/show/:id" element={ <Layout> <ShowExpenseCategory /> </Layout> } />

        {/* payment method routes */}
        <Route path="/payment-methods" element={ <Layout> <ReadPaymentMethod /> </Layout> } />
        <Route path="/payment-methods/create" element={ <Layout> <CreatePaymentMethod /> </Layout> } />
        <Route path="/payment-methods/edit/:id" element={ <Layout> <EditPaymentMethod /> </Layout> } />

        {/* Manage currency routes */}
        <Route path="/currencies" element={ <Layout> <ReadCurrency /> </Layout> } />
        <Route path="/currencies/create" element={ <Layout> <CreateCurrency /> </Layout> } />
        <Route path="/currencies/edit/:id" element={ <Layout> <EditCurrency /> </Layout> } />
        <Route path="/currencies/show/:id" element={ <Layout> <ShowCurrency /> </Layout> } />

        {/* Email settings */}
        <Route path="/email-settings/:id" element={ <Layout> <EditSetting /> </Layout> } />

        {/* General settings */}
        <Route path="/general-settings/:id" element={ <Layout> <EditGeneralSetting /> </Layout> } />

        {/* Bank Account routes */}
        <Route path="/bank-accounts" element={ <Layout> <ReadBankAccount /> </Layout> } />
        <Route path="/bank-accounts/create" element={ <Layout> <CreateBankAccount /> </Layout> } />
        <Route path="/bank-accounts/edit/:id" element={ <Layout> <EditBankAccount /> </Layout> } />
        <Route path="/bank-accounts/show/:id" element={ <Layout> <ShowBankAccount /> </Layout> } />

        {/* Donation routes */}
        <Route path="/donations" element={ <Layout> <ReadDonation /> </Layout> } />
        <Route path="/donations/create" element={ <Layout> <CreateDonation /> </Layout> } />
        <Route path="/donations/edit/:id" element={ <Layout> <EditDonation /> </Layout> } />
        <Route path="/donations/show/:id" element={ <Layout> <ShowDonation /> </Layout> } />

        {/* Wire Transfer routes */}
        <Route path="/wire-transfers" element={ <Layout> <ReadWireTransfer /> </Layout> } />
        <Route path="/wire-transfers/create" element={ <Layout> <CreateWireTransfer /> </Layout> } />
        <Route path="/wire-transfers/edit/:id" element={ <Layout> <EditWireTransfer /> </Layout> } />
        <Route path="/wire-transfers/show/:id" element={ <Layout> <ShowWireTransfer /> </Layout> } />

        {/* Expense routes */}
        <Route path="/expenses" element={ <Layout> <ReadExpense /> </Layout> } />
        <Route path="/expenses/create" element={ <Layout> <CreateExpense /> </Layout> } />
        <Route path="/expenses/edit/:id" element={ <Layout> <EditExpense /> </Layout> } />
        <Route path="/expenses/show/:id" element={ <Layout> <ShowExpense /> </Layout> } />

        {/* Role routes */}
        <Route path="/roles" element={ <Layout> <ReadRole /> </Layout> } />
        <Route path="/roles/create" element={ <Layout> <CreateRole /> </Layout> } />
        <Route path="/roles/edit/:id" element={ <Layout> <EditRole /> </Layout> } />
        <Route path="/roles/show/:id" element={ <Layout> <ShowRole /> </Layout> } />

        {/* Permission routes */}
        <Route path="/permissions" element={ <Layout> <ReadPermission /> </Layout> } />
        <Route path="/permissions/create" element={ <Layout> <CreatePermission /> </Layout> } />
        <Route path="/permissions/edit/:id" element={ <Layout> <EditPermission /> </Layout> } />

        {/* User routes */}
        <Route path="/users" element={ <Layout> <ReadUser /> </Layout> } />
        <Route path="/users/create" element={ <Layout> <CreateUser /> </Layout> } />
        <Route path="/users/edit/:id" element={ <Layout> <EditUser /> </Layout> } />
        <Route path="/users/show/:id" element={ <Layout> <ShowUser /> </Layout> } />
       

      </Routes>
    </Router>
  );
}

export default App;
