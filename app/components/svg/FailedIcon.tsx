import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';
import { View } from 'react-native';
import colors from '@/app/colors';


type FailedIconType = {
    size: number
}

const FailedIcon = (p: FailedIconType) => {
  return (
    <View>
      <Svg width={p.size} height={p.size} viewBox='0 0 100 100'>
        {/* Red circle */}
        <Circle cx="50" cy="50" r="40" fill="red" />
        {/* White "X" */}
        <Path d="M30 30 L70 70 M70 30 L30 70" stroke="white" strokeWidth="10" fill="none" />
      </Svg>
    </View>
  );
};

export default FailedIcon;