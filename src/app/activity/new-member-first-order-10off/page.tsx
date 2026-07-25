import ActivityDetailPage from '@/src/components/activity/ActivityDetailPage';

// This route is static promotional content and does not require client-side behavior.
export default function NewMemberFirstOrder10OffPage() {
  return (
    <ActivityDetailPage
      bannerSrc="/images/activity/會員首購9折.png"
      bannerAlt="新會員首購九折活動"
      sections={[
        {
          title: '給新毛友的第一份禮物',
          description:
            '第一次在 mofu 購物，不只是一次下單，也是一段陪伴的開始。毛孩的生活需要許多細節，吃得安心、玩得開心、睡得舒服、清潔方便，每一個選擇都藏著飼主的用心。mofu 新毛友見面禮，讓你第一次挑選毛孩用品時，可以用更優惠的價格，帶回真正需要的好物。',
        },
        {
          title: '首購九折，金額沒有上限',
          description:
            '這次會員首購九折優惠沒有折扣金額上限，適合一次補齊毛孩需要的用品。無論是剛開始準備飼養用品的新手，或是想趁首購優惠多帶幾樣商品的飼主，都能享受更划算的購物體驗。從小零食到大型補貨，九折優惠都能讓每一筆消費更有感。',
        },
        {
          title: '新手飼主也能安心挑選',
          description:
            '不知道該從哪裡開始買嗎？可以先從毛孩每天都會用到的商品開始：主食、零食、清潔用品、外出用品、保健補給，都是很適合首購加入購物車的品項。mofu 精選毛孩日常需要的好物，讓你不用一次就成為專家，也能慢慢找到最適合家中寶貝的生活方式。',
        },
      ]}
      steps={[
        '活動期間內，註冊成為 mofu 會員。',
        '符合首購資格之會員，可於結帳時使用會員首購九折優惠。',
        '本活動可搭配優惠券活動使用。',
        '每位會員限使用一張優惠券。',
        '本活動折扣金額沒有上限。',
        '優惠資格與折扣結果依結帳頁顯示為準。',
      ]}
      notes={[
        '本活動限 mofu 會員首購使用。',
        '每位會員限使用一次首購九折優惠。',
        '若訂單取消、退貨或付款未完成，優惠資格依系統判定為準。',
        '部分商品可能不適用本活動，實際適用商品依網站公告為準。',
        'mofu 保留活動修改、暫停及最終解釋之權利。',
      ]}
    />
  );
}
