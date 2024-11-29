import React from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { getConnectionParams, createConnection } from '../lib/composioUtilities'
import { MoonLoader } from 'react-spinners'
const ConnectAccountPopup = ({ open, setOpen, action, integration_id, user_id, app_name, redirect_url }) => {
    const [connectionParams, setConnectionParams] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        const fetchConnectionParams = async () => {
            if (!integration_id) return;
            try {
                setIsLoading(true);
                const response = await getConnectionParams({ integration_id });
                setConnectionParams(response);
                const initialValues = {};
                response.expected_params.forEach(param => {
                    initialValues[param.name] = param.default || '';
                });
                setFormValues(initialValues);
            } catch (err) {
                setError('Failed to fetch connection parameters');
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (open) {
            fetchConnectionParams();
        }
    }, [integration_id, open]);

    const handleInputChange = (paramName, value) => {
        setFormValues(prev => ({
            ...prev,
            [paramName]: value
        }));
    };

    const handleConnect = async () => {
        const missingRequired = connectionParams?.expected_params
            .filter(param => param.required && !formValues[param.name]);

        if (missingRequired?.length > 0) {
            setError(`Please fill in required fields: ${missingRequired.map(p => p.displayName).join(', ')}`);
            return;
        }
        try {
            setConnecting(true);
            const response = await createConnection({ user_id: user_id, app_name: app_name, redirect_url: redirect_url, integration_id: integration_id, expected_params_body: formValues });
        } catch (err) {
            setError('Failed to create connection');
            console.error('Error creating connection:', err);
        } finally {
            setConnecting(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-20">
            <DialogBackdrop
                className="fixed inset-0 bg-gray-500 bg-opacity-75"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                    >
                        <div>
                            <DialogTitle as="h3" className="text-xl font-semibold text-gray-900 mb-6">
                                {connectionParams?.auth_scheme === 'API_KEY' ? 'API Key Authentication' : 'Connect Your Account'}
                            </DialogTitle>

                            {error && (
                                <div className="mb-4 text-red-600 text-sm p-2 bg-red-50 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                                    </div>
                                ) : (
                                    connectionParams?.expected_params?.map((param) => (
                                        <div key={param.name} className="mb-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <label
                                                    htmlFor={param.name}
                                                    className="block text-sm font-semibold text-gray-900"
                                                >
                                                    {param.displayName}
                                                    {param.required && <span className="text-red-500 ml-1">*</span>}
                                                </label>
                                            </div>
                                            <input
                                                type={param.is_secret ? "password" : "text"}
                                                id={param.name}
                                                name={param.name}
                                                value={formValues[param.name] || ''}
                                                onChange={(e) => handleInputChange(param.name, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                                                placeholder={`Enter ${param.displayName.toLowerCase()}`}
                                                required={param.required}
                                            />
                                            {param.description && (
                                                <p className="mt-2 text-sm text-gray-500">
                                                    {param.description}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="inline-flex justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConnect}
                                disabled={isLoading}
                                className="inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50"
                            >
                                {connecting ? <MoonLoader color={"#ffffff"} loading={true} size={16} /> : "Connect"}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default ConnectAccountPopup;