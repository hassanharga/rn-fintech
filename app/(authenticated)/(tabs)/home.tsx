import DropDown from "@/app/components/Dropdown";
import RoundedButton from "@/app/components/RoundedButton";
import Colors from "@/constants/Colors";
// import { useBalanceStore } from "@/store/balanceStore";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Page = () => {
  // const { balance, runTransaction, transactions, clearTransactions } = useBalanceStore();

  const onAddMoney = () => {};

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      {/* balance */}
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{1400}</Text>
          <Text style={styles.currency}>€</Text>
        </View>
      </View>
      {/* actions */}
      <View style={styles.actionRow}>
        <RoundedButton title="Add Money" icon={"add"} onPress={onAddMoney} />
        <RoundedButton title="Exchange" icon={"refresh"} onPress={onAddMoney} />
        <RoundedButton title="Details" icon={"list"} onPress={onAddMoney} />
        <DropDown />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
  },
  balance: {
    fontSize: 50,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 20,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
    overflow: "hidden",
  },
});

export default Page;
