import ActivityDetailPage from '@/src/components/activity/ActivityDetailPage';

// This route is static promotional content and does not require client-side behavior.
export default function NewArrivalSeasonPage() {
  return (
    <ActivityDetailPage
      bannerSrc="/images/activity/新品嚐鮮季.png"
      bannerAlt="新品嚐鮮季活動"
      sections={[
        {
          title: '新商品登場，毛孩生活升級',
          description:
            '新品不只是新上架的商品，更是替毛孩生活加入新選擇的機會。也許是一款更適合牠口味的零食，也許是一個能陪牠消耗精力的玩具，也可能是一件讓飼主照顧起來更順手的清潔用品。mofu 新品嚐鮮季，幫你把值得關注的新好物整理好，讓你不用慢慢找，也能快速發現適合毛孩的選擇。',
        },
        {
          title: '限時優惠，嚐鮮更無負擔',
          description:
            '想試新品，最怕買了不確定適不適合。這次新品嚐鮮季推出限時優惠，讓飼主可以用更輕鬆的價格嘗試新商品。你可以從毛孩平常最常用、最常吃、最需要的品項開始挑選，也可以搭配不同類型商品，替毛孩準備一份新的日常小驚喜。',
        },
        {
          title: '為不同毛孩準備不同選擇',
          description:
            '每隻毛孩都有自己的習慣。有些喜歡安靜陪伴，有些精力旺盛；有些嘴巴挑剔，有些什麼都想試；有些需要更多清潔照護，有些則需要外出用品輔助。新品嚐鮮季希望讓每一位飼主都能依照家中毛孩的個性，找到剛好適合牠的商品。',
        },
      ]}
      steps={[
        '活動期間內，至 mofu 新品活動頁或指定新品專區選購商品。',
        '指定新品將享有限時活動優惠。',
        '將商品加入購物車並完成結帳，即可享有新品優惠。',
        '活動商品數量有限，售完為止。',
        '優惠價格、活動期間與適用商品依網站公告為準。',
      ]}
      notes={[
        '本活動僅適用於指定新品商品。',
        '活動優惠不得折換現金。',
        '商品數量有限，售完為止。',
        '若訂單取消、退貨或付款未完成，將不適用本活動優惠。',
        'mofu 保留活動修改、皙停及最終解釋之權利。',
      ]}
    />
  );
}
