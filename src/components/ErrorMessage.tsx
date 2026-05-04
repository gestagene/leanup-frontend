import { Text } from "react-native";

type Props = {
  message: string | null;
};

export default function ErrorText({ message }: Props) {
  if (!message) return null;
  return (
    <Text
      style={{
        color: "#ba2525",
        textAlign: "center",
        marginHorizontal: 24,
        marginTop: 8,
      }}
    >
      {message}
    </Text>
  );
}
