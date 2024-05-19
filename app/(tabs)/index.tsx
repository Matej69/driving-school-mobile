import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Questions() {
  return (
    <SafeAreaView>
      <Text className={`bg-base bg-base-text`}>Questions</Text>
    </SafeAreaView>
  );
}