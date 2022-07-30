import { ScrollView } from "react-native";
import { View } from "react-native";
import { Avatar, List, Text } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import CurrencyIcon from "../components/CurrencyIcon";
import { sBalance, sProgress, sUsername, sActivatedContract, sContract, numberFormat } from "../utils/ValorantAPI";
// import ProgressCircle from 'react-native-progress/Circle';
// import * as Progress from 'react-native-progress';
import AgentContract from "../components/Contract";

import { useFonts, Barlow_800ExtraBold } from '@expo-google-fonts/barlow';

export default function Contracts() {
  let [fontsLoaded] = useFonts({
    Barlow_800ExtraBold,
  });
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
    <ScrollView style={{ padding: 10 }}>
      {sContract?.map((item) => (<AgentContract item={item} key={item.uuid} activated={false}/>))}
    </ScrollView>
    </>
  );
}
