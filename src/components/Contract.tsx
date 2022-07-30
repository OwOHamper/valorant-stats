import { PropsWithChildren } from "react";
import * as React from 'react';
import { Card, Title, Paragraph, Button } from "react-native-paper";
import * as Progress from 'react-native-progress';
import { numberFormat } from "../utils/ValorantAPI";
import { Avatar, List, Text } from "react-native-paper";
import { useFonts, Barlow_800ExtraBold } from '@expo-google-fonts/barlow';
// import { contractsOpened } from "../views/Stats"


interface props {
  item: contract;
  activated: boolean;
  setState: Function;
}
export default function AgentContract(props: PropsWithChildren<props>) {
  return (
    <>
    {/* <Text>{props.item.agentName}</Text> */}
    <List.Item
      title={`${props.item.agentName} Contract`}
      description={(props.item.progression == 1) ? 
        (`Level ${props.item.level}`)
        : (`Level ${props.item.level} - ${numberFormat(props.item.xpInLevel)}/${numberFormat(props.item.totalXpNeededInLevel)}`)
      }
      left={(a) => <Avatar.Image size={48} source={{uri: props.item.displayIcon}} />}
      right={(a) => <Progress.Circle progress={props.item.progression} size={48} thickness={2.5} borderColor={(props.item.progression == 1) ? ("rgba(219, 200, 22, 1)") : ("rgba(250, 68, 84, 1)")} color={(props.item.progression == 1) ? ("rgba(219, 200, 22, 1)") : ("rgba(250, 68, 84, 1)")}
        showsText={true} style={{marginRight: 25}} borderWidth={1} animated={false}
        textStyle={{"fontSize": 13, "color": "white", "fontFamily": "Barlow_800ExtraBold"}}>
        {/* {(props.item.progression != 1) &&
        <Text style={{ fontSize: 13, "fontFamily": "Barlow_800ExtraBold", "marginRight": 0}}>
          {`${numberFormat(props.item.xpInLevel)}/${numberFormat(props.item.totalXpNeededInLevel)}`}
        </Text>
        } */}
        </Progress.Circle>}
      onPress={
        () => {
          // console.log(props.opened)
          if (props.activated) {
            // props.opened = true;
            props.setState(true);
          }
          else {
            // props.opened = false;
            props.setState(false);
          }
        }
      }


    />
    <Progress.Bar progress={props.item.totalProgression} width={null} color={"rgba(250, 68, 84, 1)"}/>
    {/* <List.Item
      title="Activated Contract"
      description={`${props.item.agentName} - Level ${props.item.level}`}
      left={(a) => <Avatar.Image size={48} source={{uri: props.item.displayIcon}} />}
      right={(a) => <ProgressCircle progress={props.item.progression} size={48} thickness={2.5} borderColor={"rgba(250, 68, 84, 1)"} color={"rgba(250, 68, 84, 1)"}
      showsText={true} style={{marginRight: 25}} borderWidth={1} animated={false}
      textStyle={{"fontSize": 13, "color": "white", "fontFamily": "Barlow_800ExtraBold"}}> 
        <Text style={{ fontSize: 10, "fontFamily": "Barlow_800ExtraBold"}}>{`${numberFormat(props.item.xpInLevel)}/${numberFormat(props.item.totalXpNeededInLevel)}`}</Text>
      </ProgressCircle>
    }/> */}
    </> 
  );
}
