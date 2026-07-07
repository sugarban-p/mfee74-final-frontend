import { Button, Flex } from "@radix-ui/themes";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function CheckoutButtons() {
  return (
    <Flex direction="column" gap="6" align="start">
      <Button
        radius="full"
        variant="surface"
        style={{
          width: "240px",
          height: "82px",
          backgroundColor: "#FFFFFF",
          color: "#6B635C",
          border: "1px solid #E6DED6",
          fontSize: "22px",
          fontWeight: 700,
          gap: "10px",
        }}
      >
        <LuChevronLeft size={24} />
        返回修改
      </Button>

      <Button
        radius="full"
        variant="solid"
        style={{
          width: "500px",
          height: "110px",
          backgroundColor: "#E98943",
          color: "#FFFFFF",
          fontSize: "30px",
          fontWeight: 700,
          gap: "12px",
        }}
      >
        下一步：確認金額
        <LuChevronRight size={28} />
      </Button>
    </Flex>
  );
}