import { ChangeEvent } from "react";
import { useAppContext } from "../../context/AppContext";

const UserBalance = () => {
  const { appState, appDispatch } = useAppContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    appDispatch({
      type: "SET_BALANCE",
      payload: {
        key: "USDT",
        value: parseFloat(e.target.value) || 0,
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm">USDT: </p>
      <input
        type="text"
        className="text-2xl text-red font-bold"
        value={appState.balance.USDT}
        onChange={handleChange}
      />
    </div>
  );
};

export default UserBalance;
