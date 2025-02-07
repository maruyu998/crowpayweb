import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { TopProvider } from "./contexts/TopProvider";
import AlertBox from "./components/elements/AlertBox";
import HomePage from "./pages/HomePage";
import { UserInfoProvider } from "./contexts/UserInfoProvider";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import GraphPage from "./pages/GraphPage";
import NotificationPage from "./pages/NotificationPage";
import SettingPage from "./pages/SettingPage";
import TransactionPage from "./pages/TransactionPage";
import IssuePage from "./pages/IssuePage";
import FriendPage from "./pages/FriendPage";

export default function App() {
	
	return (
		<TopProvider>
			<BrowserRouter>
				<UserInfoProvider>
					<Routes>
						<Route path="/" element={<HomePage/>}/>
						<Route path="/signin" element={<SigninPage /> }/>
						<Route path="/signup" element={<SignupPage /> }/>
						<Route path="/issue" element={<IssuePage /> }/>
						<Route path="/transaction" element={<TransactionPage /> }/>
						<Route path="/setting" element={<SettingPage /> }/>
						<Route path="/notification" element={<NotificationPage /> }/>
						<Route path="/graph" element={<GraphPage /> }/>
						<Route path="/friend" element={<FriendPage /> }/>
						<Route path="*" element={<Navigate to="/"/> }/>
					</Routes>
				</UserInfoProvider>
			</BrowserRouter>
			<div className="fixed bottom-2 right-2 z-50">
				<AlertBox />
			</div>
		</TopProvider>
	);
}
