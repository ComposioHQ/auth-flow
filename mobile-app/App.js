import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
const appData = require('./assets/appData.json');
import gmailLogo from './assets/gmail-logo.png';
import shopifyLogo from './assets/shopify-logo.png';
import { globalStyles } from './styles/globalStyles';
import { AppCard } from './components/AppCard';

export default function App() {
  const [userId, setUserId] = useState('');
  const [submittedUserId, setSubmittedUserId] = useState('');

  const isUserIdEmpty = !userId?.trim();

  const handleUpdate = () => {
    Keyboard.dismiss();
    const sanitizedId = userId.trim();
    setSubmittedUserId(sanitizedId);
    console.log('Updating user ID:', sanitizedId);
  };

  const handleInputChange = (text) => {
    setUserId(text);
  };

  return (
    <View
      style={globalStyles.container}
      onStartShouldSetResponder={() => {
        Keyboard.dismiss();
        return true;
      }}
    >
      <Text style={globalStyles.title}>Composio Auth Flow</Text>

      <View style={globalStyles.centeredContent}>
        <View style={globalStyles.inputWrapper}>
          <View style={globalStyles.inputContainer}>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter User ID"
              value={userId}
              onChangeText={handleInputChange}
            />
            <TouchableOpacity style={globalStyles.updateButton} onPress={handleUpdate}>
              <Text style={globalStyles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={globalStyles.appsWrapper}>
          {appData.apps.map((app) => (
            <AppCard
              key={app.integration_id}
              app={app}
              logo={app.appName === 'Gmail' ? gmailLogo : shopifyLogo}
              userId={submittedUserId}
              isUserIdEmpty={isUserIdEmpty}
            />
          ))}
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
