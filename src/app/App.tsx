import { useSelector } from "react-redux";

import { RootState } from "./store";
import Dashboard from "../components/Dashboard";
import UploadScreen from "../components/UploadScreen";

function App() {
  const hasTransactions =
    useSelector(
      (state: RootState) =>
        state.transactions
          .transactions.length > 0
    );

  if (!hasTransactions) {
    return <UploadScreen />;
  }

  return <Dashboard />;
}

export default App;