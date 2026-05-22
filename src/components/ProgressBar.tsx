import { colors } from "@/constants/colorscheme";
import * as Progress from "react-native-progress";

type ProgressProps = {
  target: number;
  value: number;
  color?: string;
};
export default function ProgressBar({ target, value, color }: ProgressProps) {
  const progress = value / target;
  return (
    <Progress.Bar
      progress={progress}
      width={null}
      height={8}
      borderRadius={100}
      color={color ?? colors.accent}
      unfilledColor={colors.primary}
      borderWidth={0}
    />
  );
}
