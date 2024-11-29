import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { getConnectionParams, createConnection } from '../composioUtilities';

const ConnectAccountPopup = ({
    visible,
    onClose,
    integration_id,
    user_id,
    app_name,
    redirect_url,
    onSuccess
}) => {
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

        if (visible) {
            fetchConnectionParams();
        }
    }, [integration_id, visible]);

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
            await createConnection({
                user_id,
                app_name,
                redirect_url,
                integration_id,
                expected_params_body: formValues
            });
            onClose();
            onSuccess?.();
        } catch (err) {
            setError('Failed to create connection');
            console.error('Error creating connection:', err);
        } finally {
            setConnecting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>
                        {connectionParams?.auth_scheme === 'API_KEY'
                            ? 'API Key Authentication'
                            : 'Connect Your Account'}
                    </Text>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <ScrollView style={styles.formContainer}>
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#6B46C1" />
                            </View>
                        ) : (
                            connectionParams?.expected_params?.map((param) => (
                                <View key={param.name} style={styles.inputWrapper}>
                                    <View style={styles.labelContainer}>
                                        <Text style={styles.label}>
                                            {param.displayName}
                                            {param.required && <Text style={styles.required}>*</Text>}
                                        </Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        secureTextEntry={param.is_secret}
                                        value={formValues[param.name] || ''}
                                        onChangeText={(value) => handleInputChange(param.name, value)}
                                        placeholder={`Enter ${param.displayName.toLowerCase()}`}
                                    />
                                    {param.description && (
                                        <Text style={styles.description}>{param.description}</Text>
                                    )}
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.connectButton, connecting && styles.connectingButton]}
                            onPress={handleConnect}
                            disabled={connecting}
                        >
                            {connecting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.connectButtonText}>Connect</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        color: '#1a1a1a',
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        padding: 10,
        borderRadius: 6,
        marginBottom: 16,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
    },
    formContainer: {
        maxHeight: '70%',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    labelContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1a1a1a',
    },
    required: {
        color: '#DC2626',
        marginLeft: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        color: '#1a1a1a',
    },
    description: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    cancelButtonText: {
        color: '#1a1a1a',
        fontSize: 16,
        fontWeight: '500',
    },
    connectButton: {
        backgroundColor: '#6B46C1',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    connectingButton: {
        opacity: 0.7,
    },
    connectButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ConnectAccountPopup;