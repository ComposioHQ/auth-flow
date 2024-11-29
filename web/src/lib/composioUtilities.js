import axios from 'axios';

const checkConnection = async ({ user_id, app_name }) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/checkconnection`,
            {
                user_id: user_id,
                app_name: app_name.toUpperCase()
            }
        );
        return response.data.authenticated;
    } catch (error) {
        console.error('Error checking connection:', error);
        return false;
    }
}

const getConnectionParams = async ({ integration_id }) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/getconnectionparams`,
            { integration_id }
        );
        return response.data;
    } catch (error) {
        console.error('Error getting connection parameters:', error);
        return null;
    }
}

const createConnection = async ({ 
    user_id, 
    app_name, 
    redirect_url = null, 
    integration_id = null, 
    expected_params_body = null 
}) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/newconnection`, 
            { 
                user_id, 
                app_name,
                ...(redirect_url && { redirect_url }),
                ...(integration_id && { integration_id }),
                ...(expected_params_body && { expected_params_body })
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating connection:', error);
        return null;
    }
}

export { checkConnection, getConnectionParams, createConnection };