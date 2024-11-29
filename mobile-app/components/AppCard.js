import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { checkConnection, createConnection } from '../composioUtilities';
import ConnectAccountPopup from './ConnectAccountPopup';
import * as WebBrowser from 'expo-web-browser';

export const AppCard = ({ 
  app, 
  logo,
  userId,
  isUserIdEmpty
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (userId) {
      checkConnectionStatus();
    } else {
      setIsConnected(false);
      setConnecting(false);
    }
  }, [userId]);

  const checkConnectionStatus = async () => {
    const sanitizedId = userId?.trim();
    if (!sanitizedId) return;

    setIsLoading(true);
    try {
      const result = await checkConnection({
        user_id: sanitizedId,
        app_name: app.appName
      });
      setIsConnected(result);
    } catch (error) {
      console.error(`Error checking connection for ${app.appName}:`, error);
    } finally {
      setIsLoading(false);
      setConnecting(false);
    }
  };

  const handleConnect = async () => {
    if (!userId?.trim() || isConnected) return;
    
    if (app.auth_type === "API_KEY") {
      setIsModalVisible(true);
    } else {
      try {
        setConnecting(true);
        const response = await createConnection({
          user_id: userId.trim(),
          app_name: app.appName,
          redirect_url: 'https://composio.dev',
          integration_id: app.integration_id,
        });

        // Open in app
        if (response?.url) {
          await WebBrowser.openBrowserAsync(response.url);  
          await checkConnectionStatus();
        }
        // Open in browser
        // if (response?.url) {
        //   console.log("response.url", response.url);
        //   await Linking.openURL(response.url);
        //   await checkConnectionStatus();
        // }
      } catch (error) {
        console.error(`Error connecting to ${app.appName}:`, error);
      } finally {
        setConnecting(false);
      }
    }
  };

  const handleSuccessfulConnection = async () => {
    setIsModalVisible(false);
    await checkConnectionStatus();
  };

  const getButtonText = () => {
    if (isLoading) return 'Checking...';
    if (connecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    return 'Connect';
  };

  return (
    <View style={styles.appCard}>
      <View style={styles.appInfoRow}>
        <Image
          source={logo}
          style={styles.appLogo}
        />
        <View style={styles.appTextContainer}>
          <Text style={styles.appName}>{app.appName}</Text>
          <Text style={styles.authType}>{app.auth_type}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.connectButton,
          isConnected && styles.connectedButton,
          isUserIdEmpty && styles.disabledButton,
          (connecting || isLoading) && styles.connectingButton
        ]}
        onPress={handleConnect}
        disabled={isLoading || isUserIdEmpty || connecting || isConnected}
      >
        {(isLoading || connecting) ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[
            styles.connectButtonText,
            isUserIdEmpty && styles.disabledButtonText
          ]}>
            {getButtonText()}
          </Text>
        )}
      </TouchableOpacity>
      
      {app.auth_type === "API_KEY" && (
        <ConnectAccountPopup
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setConnecting(false);
          }}
          integration_id={app.integration_id}
          user_id={userId}
          app_name={app.appName}
          redirect_url="your-redirect-url-here"
          onSuccess={handleSuccessfulConnection}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
  },
  appInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  appLogo: {
    width: 50,
    height: 50,
    marginRight: 25,
  },
  appTextContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  authType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 0,
  },
  connectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  connectedButton: {
    backgroundColor: '#34C759',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  disabledButtonText: {
    color: '#666666',
  },
  connectingButton: {
    opacity: 0.7,
  },
}); 