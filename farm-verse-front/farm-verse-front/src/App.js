import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Login
import LoginPage from "./Components/LoginComponent/LoginPage";
import RegisterUser from "./Components/LoginComponent/RegisterUser";
import FarmerMenu from "./Components/LoginComponent/FarmerMenu";

// Farm & Crop
import FarmEntry from "./Components/FarmCropComponent/FarmEntry";
import FarmList from "./Components/FarmCropComponent/FarmList";
import CropEntry from "./Components/FarmCropComponent/CropEntry";
import CropList from "./Components/FarmCropComponent/CropList";
import FarmCropReport from "./Components/FarmCropComponent/FarmCropReport";
import CropInputsView from "./Components/FarmCropComponent/CropInputsView";

// Expense
import ExpenseEntry from "./Components/ExpenseComponent/ExpenseEntry";
import ExpenseList from "./Components/ExpenseComponent/ExpenseList";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* Login */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/farmer-menu" element={<FarmerMenu />} />

          {/* Farm */}
          <Route path="/farm-add" element={<FarmEntry />} />
          <Route path="/farm-entry" element={<FarmEntry />} />
          <Route path="/farm-list" element={<FarmList />} />

          {/* Crop */}
          <Route path="/crop-add" element={<CropEntry />} />
          <Route path="/crop-entry" element={<CropEntry />} />
          <Route path="/crop-list" element={<CropList />} />

          <Route
            path="/farm-crop/:cid"
            element={<FarmCropReport />}
          />

          {/* Expenses */}
          <Route
            path="/expense-entry"
            element={<ExpenseEntry />}
          />

          <Route
            path="/expense-list"
            element={<ExpenseList />}
          />

          {/* Crop Inputs */}
          <Route
            path="/crop-input/:cid"
            element={<CropInputsView />}
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;