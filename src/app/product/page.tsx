
import Link from 'next/link';

export default async function ProductPage() {
  return (
    <>
      <div>ProductPage</div>
      <Link href="./product/cat">貓</Link>
    </>
  );
}
