import React, { useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { buildArkoseHtml } from './src/ArkoseChallenge';

const ARKOSE_PUBLIC_KEY = '<YOUR_PUBLIC_KEY>';
const ARKOSE_HOSTNAME = 'https://client-api.arkoselabs.com';

interface ArkoseMessage {
  callback: string;
  token?: string;
  response?: unknown;
}

export default function App(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const isSmallScreen = width <= 350;

  const html = useMemo(
    () => buildArkoseHtml({ publicKey: ARKOSE_PUBLIC_KEY, hostname: ARKOSE_HOSTNAME }),
    [],
  );

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    let message: ArkoseMessage;
    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }

    switch (message.callback) {
      case 'onCompleted':
        // Send message.token to your backend for server-side verification
        break;
      case 'onError':
      case 'onFailed':
        // Handle error: message.response contains error details
        break;
      default:
        console.log(`Arkose callback: ${message.callback}`);
        break;
    }
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Arkose Demo App</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.ecContainer, isSmallScreen && styles.ecContainerSmall]}>
          <WebView
            androidLayerType="hardware"
            source={{ html }}
            onMessage={handleMessage}
            originWhitelist={['https://']}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  ecContainer: {
    minHeight: 500,
    maxHeight: 600,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    minWidth: 300,
    width: '100%',
  },
  ecContainerSmall: {
    width: 300,
    marginLeft: 10,
  },
  textContainer: {
    height: 100,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
