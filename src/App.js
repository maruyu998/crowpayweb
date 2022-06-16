import { BrowserRouter, Link, Route, Routes, HashRouter } from 'react-router-dom';
import Signin from './pages/Signin.js';
import Signup from './pages/Signup.js';
import Signout from './pages/Signout.js';
import Home from './pages/Home.js';
import Send from './pages/Send.js';
import Request from './pages/Request.js';
import Transactions from './pages/Transactions.js';
import User from './pages/User.js';
import Notifications from './pages/Notifications.js';

export default function App() {
	return (
		<div>
			<HashRouter>
        <Routes>
          <Route path="/" element={<Home /> }/>
          <Route path="/signin" element={<Signin /> }/>
          <Route path="/signup" element={<Signup /> }/>
          <Route path="/signout" element={<Signout /> }/>
          <Route path="/send" element={<Send /> }/>
          <Route path="/request" element={<Request /> }/>
          <Route path="/transactions" element={<Transactions /> }/>
          <Route path="/user" element={<User /> }/>
          <Route path="/notifications" element={<Notifications /> }/>
        </Routes>
			</HashRouter>
		</div>
	);
}
