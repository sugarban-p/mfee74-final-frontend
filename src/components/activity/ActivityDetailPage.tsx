import Image from 'next/image';
import Link from 'next/link';

interface ActivitySection {
  title: string;
  description: string;
}

interface ActivityDetailPageProps {
  bannerSrc: string;
  bannerAlt: string;
  sections: ActivitySection[];
  steps: string[];
  notes: string[];
}

export default function ActivityDetailPage({
  bannerSrc,
  bannerAlt,
  sections,
  steps,
  notes,
}: ActivityDetailPageProps) {
  return (
    <div className="mx-auto max-w-305 px-4 md:px-6">
      <div className="overflow-hidden rounded-2xl">
        <Image
          src={bannerSrc}
          alt={bannerAlt}
          width={1220}
          height={560}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <section className="mx-auto mt-12 max-w-245 space-y-12">
        {sections.map((section) => (
          <article key={section.title} className="space-y-4">
            <h2 className="typo-h3 border-l-4 border-primary pl-3 tracking-[0.08em] text-[#3a2b1d]">
              {section.title}
            </h2>
            <p className="typo-card-body leading-8 tracking-[0.06em] text-[#8A7D6E] md:pr-8">
              {section.description}
            </p>
          </article>
        ))}
      </section>

      <div className="mx-auto mt-16 max-w-245 px-6">
        <div className="relative border-t border-[#e9e3d8]">
          <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 justify-center">
            <span className="typo-tab bg-background px-4 tracking-[0.08em] whitespace-nowrap text-[#9d8f80]">
              活動辦法與注意事項
            </span>
          </div>
        </div>
      </div>

      <section className="mx-auto mt-12 max-w-245 pt-2">
        <h3 className="typo-h3 tracking-[0.08em] text-[#3a2b1d]">活動辦法</h3>
        <ol className="mt-6 space-y-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className="typo-card-body flex items-start gap-3 tracking-wider text-[#6f5b47]"
            >
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-12 mb-16 max-w-245">
        <h3 className="typo-h3 tracking-[0.08em] text-[#3a2b1d]">注意事項</h3>
        <ul className="mt-6 space-y-3">
          {notes.map((note) => (
            <li
              key={note}
              className="typo-card-body flex items-start gap-2 tracking-wider text-[#8d7a67]"
            >
              <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{note}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Link
            href="/"
            className="back-button typo-tab inline-flex items-center px-6 py-2 tracking-[0.06em]"
          >
            {'< 返回首頁'}
          </Link>
        </div>
      </section>
    </div>
  );
}
