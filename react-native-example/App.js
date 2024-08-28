/**
 * Entrypoint for the Arkose Labs React-Native example.
 */

import React, { useMemo } from 'react';
import { createStyles, maxWidth } from 'react-native-media-queries';

import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WebView } from 'react-native-webview';

import { ArkoseChallenge } from './components/ArkoseChallenge';

/*
  Replace the following variables with the public key and
  hostname (if applicable) that has been setup for your account
*/
const ARKOSE_PUBLIC_KEY = '11111111-1111-1111-1111-111111111111';
const ARKOSE_HOSTNAME = 'https://client-api.arkoselabs.com';

const App = () => {
  const html = useMemo(
    () => 
      ArkoseChallenge({ 
        arkosePublicKey: ARKOSE_PUBLIC_KEY, 
        arkoseHostname: ARKOSE_HOSTNAME 
    }), [ARKOSE_PUBLIC_KEY, ARKOSE_HOSTNAME],
  );

  // Message Handler for handling messages from the webview
  const arkoseMessageHandler = event => {
    const { callback, token } = JSON.parse(event.nativeEvent.data);
    if (callback === 'onCompleted') {
      console.log('Arkose ' + callback + ' token = ' + token);
      return;
    } 
    console.log('Arkose ' + callback);
  };

  return (
    <SafeAreaView style={style.wrapper}>
      <View style={ style.textContainer }>
        <Text style={ style.text }>Arkose Demo App</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
      <View style={ style.ecContainer }>
        <WebView
          androidLayerType="hardware"
          source={ { html } }
          onMessage={ arkoseMessageHandler }
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {

  ecContainer: {
    minHeight: 500,
    maxHeight: 600,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'auto',
    minWidth: 300,
    width: '100%',
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
}

const style = createStyles(
  styles, 
  // for small screens change screen width
  maxWidth(350, 
    {
      ecContainer: {
        width: 300,
        left: 10,
        overflow: 'auto',
      }
    }
  ));

export default App;