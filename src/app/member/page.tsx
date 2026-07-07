import Link from 'next/link';

export default function MemberPage() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
      <h1 className="text-2xl font-bold text-base-content">會員中心</h1>
      <p className="mt-3 text-[16px] text-base-content/70">會員專區</p>
      <div className="mt-6">
        <Link className="btn btn-primary" href="/member/dashboard">
          前往儀表板
        </Link>
      </div>
    </section>
  );
}
