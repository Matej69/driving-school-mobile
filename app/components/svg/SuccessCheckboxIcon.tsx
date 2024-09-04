import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';
import { View } from 'react-native';
import colors from '@/app/colors';


type GreenCheckboxIconType = {
    size: number
}

const GreenCheckboxIcon = (p: GreenCheckboxIconType) => {
  return (
    <View>
      <Svg width={p.size} height={p.size} viewBox='0 0 100 100'>
        {/* Green circle */}
        <Circle cx="50" cy="50" r="40" fill={colors.success} />
        {/* White checkmark */}
        <Path d="M30 50 L45 65 L70 35" stroke="white" strokeWidth="10" fill="none" />
      </Svg>
    </View>
  );
};

export default GreenCheckboxIcon;