'use client';
import { LuShoppingCart, LuChevronRight } from 'react-icons/lu';

export default function HomePage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-10">HomePage</div>

      <div className="example flex justify-center gap-4">
<<<<<<< HEAD
        <div className="w-100 border rounded-2xl p-4">
=======
        <div className="w-100 rounded-2xl border p-4">
>>>>>>> main
          <h2 className="typo-h4 mb-4">.next-button</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span>純文字(預設)</span>
              <button type="button" className="next-button typo-tab">
                加入購物車
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span>icon+文字</span>
              <button
                type="button"
<<<<<<< HEAD
                className="next-button typo-tab flex justify-center items-center gap-2"
=======
                className="next-button typo-tab flex items-center justify-center gap-2"
>>>>>>> main
              >
                <LuShoppingCart />
                <span>加入購物車</span>
              </button>
            </div>
          </div>
        </div>
<<<<<<< HEAD
        <div className="w-100 border rounded-2xl p-4">
=======
        <div className="w-100 rounded-2xl border p-4">
>>>>>>> main
          <h2 className="typo-h4 mb-4">.back-button</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span>純文字(預設)</span>
              <button type="button" className="back-button typo-tab">
                加入購物車
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span>icon+文字</span>
              <button
                type="button"
<<<<<<< HEAD
                className="back-button typo-tab flex justify-center items-center gap-2"
=======
                className="back-button typo-tab flex items-center justify-center gap-2"
>>>>>>> main
              >
                <LuShoppingCart />
                <span>加入購物車</span>
              </button>
            </div>
          </div>
        </div>
<<<<<<< HEAD
        <div className="w-100 border rounded-2xl p-4">
=======
        <div className="w-100 rounded-2xl border p-4">
>>>>>>> main
          <h2 className="typo-h4 mb-4">.link-button</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span>純文字(預設)</span>
              <button type="button" className="link-button typo-tab">
                查看詳情
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span>icon+文字</span>
              <button
                type="button"
<<<<<<< HEAD
                className="link-button typo-tab flex justify-center items-center gap-2"
=======
                className="link-button typo-tab flex items-center justify-center gap-2"
>>>>>>> main
              >
                <span>查看詳情</span>
                <LuChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
