import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import { AuthProvider } from "./lib/auth-context";
import App from "./App";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import Admin from "./pages/Admin";
import "./index.css";

function Router() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/records" component={Records} />
        <Route path="/admin" component={Admin} />
        <Route path="/" component={App} />
      </Switch>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(<Router />);
