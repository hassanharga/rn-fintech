import DropDown from "@/components/Dropdown";
import RoundedButton from "@/components/RoundedButton";
import WidgetList from "@/components/SortableList/WidgetList";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useBalanceStore } from "@/store/balanceStore";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Page = () => {
  const { balance, runTransaction, transactions, clearTransactions } = useBalanceStore();
  const headerHeight = useHeaderHeight();

  const onAddMoney = () => {
    runTransaction({
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
      title: `Added Money ${transactions.length + 1}`,
    });
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={{ paddingTop: headerHeight }}>
      {/* balance */}
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>€</Text>
        </View>
      </View>
      {/* actions */}
      <View style={styles.actionRow}>
        <RoundedButton title="Add Money" icon={"add"} onPress={onAddMoney} />
        <RoundedButton title="Exchange" icon={"refresh"} onPress={clearTransactions} />
        <RoundedButton title="Details" icon={"list"} onPress={onAddMoney} />
        <DropDown />
      </View>
      {/* transactions */}
      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={styles.transactions}>
        {transactions.length === 0 && <Text style={{ color: Colors.gray }}>No transactions</Text>}
        {transactions.reverse().map((transaction) => (
          <View key={transaction.id} style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View style={styles.circle}>
              <Ionicons name={transaction.amount > 0 ? "add" : "remove"} size={24} color={Colors.dark} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "400" }}>{transaction.title}</Text>
              <Text style={{ color: Colors.gray, fontSize: 12 }}>{transaction.date.toLocaleString()}</Text>
            </View>
            <Text>{transaction.amount}€</Text>
          </View>
        ))}
      </View>
      {/* widgets */}
      <Text style={defaultStyles.sectionHeader}>Widgets</Text>
      <WidgetList />
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
  transactions: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Page;
