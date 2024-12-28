import { StyleSheet, View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import RoundedButton from "./RoundedButton";

const DropDown = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View>
          <RoundedButton title="More" icon={"ellipsis-horizontal"} />
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item key="statement">
          <DropdownMenu.ItemTitle>Statement</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: "list.bullet.rectangle.fill",
              pointSize: 24,
            }}
          />
        </DropdownMenu.Item>
        <DropdownMenu.Item key="converter">
          <DropdownMenu.ItemTitle>Converter</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: "coloncurrencysign.arrow.circlepath",
              pointSize: 24,
            }}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const styles = StyleSheet.create({});

export default DropDown;
