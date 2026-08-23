import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

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
import CropExpenseReport from "./Components/FarmCropComponent/CropExpenseReport";

// Expense
import ExpenseEntry from "./Components/ExpenseComponent/ExpenseEntry";
import ExpenseList from "./Components/ExpenseComponent/ExpenseList";

function App() {
  return (
    <div className="App">

      <BrowserRouter>

        <Routes>

          {/* =========================
              LOGIN
          ========================= */}

          <Route
            path="/"
            element={<LoginPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterUser />}
          />

          <Route
            path="/farmer-menu"
            element={<FarmerMenu />}
          />


          {/* =========================
              FARM
          ========================= */}

          <Route
            path="/farm-add"
            element={<FarmEntry />}
          />

          <Route
            path="/farm-entry"
            element={<FarmEntry />}
          />

          <Route
            path="/farm-list"
            element={<FarmList />}
          />


          {/* =========================
              CROP
          ========================= */}

          <Route
            path="/crop-add"
            element={<CropEntry />}
          />

          <Route
            path="/crop-entry"
            element={<CropEntry />}
          />

          <Route
            path="/crop-list"
            element={<CropList />}
          />


          {/* =========================
              FARM CROP REPORT
          ========================= */}

          <Route
            path="/farm-crop/:cid"
            element={<FarmCropReport />}
          />


          {/* =========================
              EXPENSE
          ========================= */}

          <Route
            path="/expense-entry"
            element={<ExpenseEntry />}
          />

          <Route
            path="/expense-list"
            element={<ExpenseList />}
          />


          {/* =========================
              CROP INPUTS
          ========================= */}

          <Route
            path="/crop-input/:cid"
            element={<CropInputsView />}
          />


          {/* =========================
              CROP EXPENSE REPORT
          ========================= */}

          <Route
            path="/crop-expense-report/:cropId"
            element={<CropExpenseReport />}
          />

        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;