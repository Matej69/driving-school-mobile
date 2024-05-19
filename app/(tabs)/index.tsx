import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardItem } from '../components/card-item';
import { View } from 'react-native-animatable';

export default function Questions() {

  const ChildComp = () => <Text>sssssssssssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s ssssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s ssssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s ss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s s s s s s s s s s ssssss sssss sssss sss s s s s s s s s s s s s s s</Text>
  
  return (
    <SafeAreaView className='flex flex-col p-2'>
      <ScrollView>
        <View className='mt-2' />
        <CardItem color='success'>
          <ChildComp/>
        </CardItem>
        <View className='mt-2' />
        <CardItem color='failure'>
          <ChildComp/>
        </CardItem>
        <View className='mt-2' />
        <CardItem color='base'>
          <ChildComp/>
        </CardItem> 
      </ScrollView>
    </SafeAreaView>
  );
}