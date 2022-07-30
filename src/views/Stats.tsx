import { ScrollView } from "react-native";
import { View } from "react-native";
import { Avatar, List, Text } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import CurrencyIcon from "../components/CurrencyIcon";
import { sBalance, sProgress, sUsername, sFUsername,  sActivatedContract, sContract, numberFormat, sTitle, sAvatar } from "../utils/ValorantAPI";
// import ProgressCircle from 'react-native-progress/Circle';
// import * as Progress from 'react-native-progress';
import AgentContract from "../components/Contract";
import React, { useState} from 'react';
import { useFonts, Barlow_800ExtraBold } from '@expo-google-fonts/barlow';


export default function Profile() {
  const [contractsOpened, setcontractsOpened] = useState(false);

  let [fontsLoaded] = useFonts({
    Barlow_800ExtraBold,
  });
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
    <ScrollView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 15,
        }}
      >
        {/* <CircularProgress value={58} /> */}
        <Avatar.Image size={48} source={{ uri: sAvatar }} />
        <Text style={{ marginLeft: 10, fontSize: 30, fontWeight: "bold", textAlignVertical: "center"}}>
          {sFUsername}
        </Text>
        <Text style={{ marginLeft: 10, fontSize: 15, fontWeight: "normal", color: "gray", textAlignVertical: "center", marginTop: 3}}>
          {sTitle}
        </Text>
      </View>
      {(contractsOpened) ? (
        sContract?.map((item) => (<AgentContract item={item} key={item.uuid} activated={false} setState={setcontractsOpened}/>))
      ) : (
      <AgentContract item={sActivatedContract} activated={true} setState={setcontractsOpened}/>
      )
      }
      <List.Section>
        <List.Subheader>Rank</List.Subheader>
        <List.Item
          title="Rank"
          description={sProgress.level}
          left={(props) => <List.Icon {...props} icon="chevron-triple-up" />}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>Progress</List.Subheader>
        <List.Item
          title="Level"
          description={sProgress.level}
          left={(props) => <List.Icon {...props} icon="chevron-triple-up" />}
        />
        <List.Item
          title="XP"
          description={sProgress.xp}
          left={(props) => <List.Icon {...props} icon="chart-bubble" />}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>Balances</List.Subheader>
        <List.Item
          title="Valorant Points"
          description={sBalance.vp.toString()}
          descriptionNumberOfLines={1}
          left={(props) => <CurrencyIcon icon="vp" paper />}
        />
        <List.Item
          title="Radianite Points"
          description={sBalance.rad.toString()}
          descriptionNumberOfLines={1}
          left={(props) => <CurrencyIcon icon="rad" paper />}
        />
      </List.Section>
    </ScrollView>
    </>
  );
}
