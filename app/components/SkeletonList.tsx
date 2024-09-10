import React, { useCallback, useEffect, useRef } from 'react';

import {
  Animated,
  DimensionValue,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../colors';
import { Skeleton } from './Skeleton';

type SkeletonListProps = {
  itemsNumber: number;
};

export const SkeletonList = ({
  itemsNumber
}: SkeletonListProps) => {

  
  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: colors.rootBackground, padding: 4}}>
      {
        Array.from({ length: itemsNumber }, (_, i) => (
          <View key={`skeleton-${i}`} style={{ padding: 4, width: '100%', height: '10%', display: 'flex', flexDirection: 'row' }}>
            <View style={{ width: '15%', height: '100%', padding: 2 }}>
              <Skeleton width={'100%'} height={'100%'} bgColor='#ccc' borderRadius={999}></Skeleton>
            </View>
            <View style={{ width: '85%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <Skeleton width={'100%'} height={'20%'} bgColor='#ccc'></Skeleton>
            <Skeleton width={'100%'} height={'20%'} bgColor='#ccc'></Skeleton>
            <Skeleton width={'100%'} height={'20%'} bgColor='#ccc'></Skeleton>
            </View>
          </View>
        ))
      }
    </View>
  )
};