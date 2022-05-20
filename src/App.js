import { BrowserRouter, Link, Route, Routes, HashRouter } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Signout from './pages/Signout';
import Home from './pages/Home';
import Send from './pages/Send';
import Request from './pages/Request';
import Transactions from './pages/Transactions';
import User from './pages/User';

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
        </Routes>
			</HashRouter>
		</div>
	);
}
