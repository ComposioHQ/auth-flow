import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners"
import { checkConnection, createConnection } from "../lib/composioUtilities";
import ConnectAccountPopup from "./ConnectAccountPopup";

const DemoApp = ({ appName, logo, user_id, integration_id, auth_type }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const checkConnectionStatus = async () => {
            setCheckingStatus(true);
            const connectionStatus = await checkConnection({ user_id: user_id, app_name: appName });
            setIsConnected(connectionStatus);
            setCheckingStatus(false);
        }
        checkConnectionStatus();
    }, [user_id]);

    const handleConnect = async () => {
        if (auth_type === "API_KEY") {
            setOpen(true);
        } else {
            try {
                setConnecting(true);
                const response = await createConnection({ user_id: user_id, app_name: appName, redirect_url: window.location.href, integration_id: integration_id });
                if (response.url) {
                    window.location.href = response.url;
                }
            } catch (error) {
                console.error('Error creating connection:', error);
            } finally {
                setConnecting(false);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 border border-gray-300 rounded-lg p-8 w-[22rem] h-[18rem]">
            {
                auth_type === "API_KEY" && (
                    <ConnectAccountPopup user_id={user_id} app_name={appName} open={open} setOpen={setOpen} action={handleConnect} integration_id={integration_id} />
                )
            }
            <div>
                <img
                    src={logo}
                    alt="App Logo"
                    className="w-28 mx-auto rounded-xl drop-shadow-lg"
                />
            </div>
            <div className="text-center">
                <p className="text-xl font-bold">{appName}</p>
            </div>
            <div className="mx-auto w-full">
                {checkingStatus ? (
                    <button
                        type="button"
                        className="flex mx-auto justify-center items-center focus:outline-none text-white w-full bg-purple-700 font-medium rounded-lg text-sm px-5 h-[2.5rem]"
                        disabled
                    >
                        <MoonLoader color={"#ffffff"} loading={true} size={16} />
                    </button>
                ) : !isConnected ? (
                    <button
                        type="button"
                        className="flex mx-auto justify-center items-center focus:outline-none text-white w-full bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 h-[2.5rem]"
                        onClick={handleConnect}
                    >
                        {connecting ? <MoonLoader color={"#ffffff"} loading={true} size={16} /> : "Connect"}
                    </button>
                ) : (
                    <button
                        type="button"
                        className="focus:outline-none text-white w-full bg-green-600 hover:bg-green-800 font-medium rounded-lg text-sm px-5 h-[2.5rem]"
                        onClick={() => setExecuteActionPopupOpen(true)}
                    >
                        Connected
                    </button>
                )}
            </div>
        </div>
    );
}

export default DemoApp;