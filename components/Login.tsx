import React, { PropsWithChildren, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Snackbar, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { login } from "../utils/ValorantAPI";

interface props {
  user: user | undefined;
  setUser: Function;
  setSnackbarVisible: Function;
  setSnackbarTxt: Function;
}
export default function Login(props: PropsWithChildren<props>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("eu");
  const [dropdownShown, setDropdownShown] = useState(false);

  const handleLogin = async () => {
    props.setUser({ loading: true });
    let user = await login(username, password, region);
    if (user.error) {
      props.setUser(null);
      props.setSnackbarTxt(user.error);
      props.setSnackbarVisible(true);
    } else {
      props.setUser(user);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        style={{ width: 250, height: 50, marginBottom: 10 }}
        onChangeText={(text) => {
          setUsername(text);
        }}
        label="Username"
        autoCompleteType="username"
      />
      <TextInput
        label="Password"
        onChangeText={(text) => {
          setPassword(text);
        }}
        style={{ width: 250, height: 50, marginBottom: 10 }}
        autoCompleteType="password"
        secureTextEntry={true}
      />
      <View style={{ width: 100, marginBottom: 15 }}>
        <DropDown
          label={"Region"}
          mode={"outlined"}
          visible={dropdownShown}
          showDropDown={() => setDropdownShown(true)}
          onDismiss={() => setDropdownShown(false)}
          value={region}
          setValue={setRegion}
          list={[
            { label: "EU", value: "eu" },
            { label: "NA", value: "na" },
            { label: "AP", value: "ap" },
            { label: "KR", value: "kr" },
          ]}
        />
      </View>
      <Button
        onPress={handleLogin}
        mode="contained"
        loading={props.user?.loading}
      >
        Log In
      </Button>
    </View>
  );
}
