import ActivityDetailPage from '@/src/components/activity/ActivityDetailPage';

// This route is static promotional content and does not require client-side behavior.
export default function PetFestival1000Off100Page() {
  return (
    <ActivityDetailPage
      bannerSrc="/images/activity/滿千折百.png"
      bannerAlt="滿 1000 折 100 活動"
      sections={[
        {
          title: '毛孩好物，一次買更划算',
          description:
            '照顧毛孩的生活從來不是單一需求。牠需要好吃的零食，也需要乾淨的環境；需要日常陪伴，也需要健康照護。毛孩好物節替飼主準備簡單又直接的滿額折扣，讓你在選購多樣商品時，可以更輕鬆達到優惠門檻。日常該買的，趁現在一次補齊。',
        },
        {
          title: '滿 $1000 現折 $100',
          description:
            '活動規則簡單明確，單筆訂單滿 $1000 即可折抵 $100。無論是小家庭日常補貨，或是多毛家庭定期採買，都能感受到滿額折扣的實用。想替毛孩多帶幾包零食、補充清潔用品，或是幫牠換一個新玩具，這次都是剛剛好的時機。',
        },
        {
          title: '優惠券一起搭，省更多',
          description:
            '毛孩好物節可搭配優惠券活動使用，每人限用一張。結帳時選擇符合資格的優惠券，再搭配滿額折扣，讓整體購物金額更划算。對於已經有購物清單的飼主來說，這是非常適合下單的活動。',
        },
      ]}
      steps={[
        '活動期間內，於 mofu 官網單筆消費滿 $1000，即可享有現折 $100 優惠。',
        '本活動可搭配優惠券活動使用。',
        '每位會員限使用一張優惠券。',
        '滿額折扣依單筆訂單商品金額計算。',
        '折扣結果依結帳頁顯示為準。',
        '活動商品與適用範圍依網站公告為準。',
      ]}
      notes={[
        '本活動以單筆訂單計算，不得跨訂單合併。',
        '若訂單取消、退貨或部分退貨後未達活動門檻，mofu 保留取消優惠資格之權利。',
        '優惠不得折換現金。',
        '部分商品可能不適用本活動，實際適用商品依網站公告為準。',
        'mofu 保留活動修改、暫停及最終解釋之權利。',
      ]}
    />
  );
}
