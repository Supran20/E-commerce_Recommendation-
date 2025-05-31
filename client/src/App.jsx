import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { Items } from "./pages/Items";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Details } from "./pages/Details";
import { Cart } from "./pages/Cart";
import { Recommendation } from "./pages/Recommendation";
import { Customers } from "./pages/Customers";
import { Charts } from "./pages/Charts";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<Items />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/charts/:name" element={<Charts />} />
      </Routes>
    </Router>
  );
};

export default App;
