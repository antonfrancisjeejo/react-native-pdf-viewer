import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, View, Button, StatusBar} from 'react-native';
import Pdf from 'react-native-pdf';
import Orientation, {
  OrientationLocker,
  PORTRAIT,
  LANDSCAPE,
  useOrientationChange,
  OrientationType,
} from 'react-native-orientation-locker';

const App = () => {
  const [orientation, setOrientation] = useState(OrientationType.PORTRAIT);
  const [fullScreen, setFullScreen] = useState(false);

  useOrientationChange(deviceOrientation => {
    if (deviceOrientation === OrientationType.PORTRAIT) {
      setOrientation(OrientationType.PORTRAIT);
      console.log('portrait');
    }
    if (deviceOrientation === OrientationType['LANDSCAPE-LEFT']) {
      setOrientation(OrientationType['LANDSCAPE-LEFT']);
      console.log('landscape-left');
    }
  });

  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      Orientation.removeAllListeners();
    };
  }, []);

  const source = {
    uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
    cache: true,
  };
  return (
    <View style={styles.container}>
      <StatusBar hidden={fullScreen} />
      <OrientationLocker
        orientation={PORTRAIT}
        onChange={orientation => console.log('onChange', orientation)}
        onDeviceChange={orientation =>
          console.log('onDeviceChange', orientation)
        }
      />
      <Button
        title="Rotate Pdf"
        onPress={() =>
          orientation === OrientationType.PORTRAIT
            ? Orientation.lockToLandscape()
            : Orientation.lockToPortrait()
        }
      />
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
      <Button
        title="Full Screen"
        onPress={() => setFullScreen(prev => !prev)}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
