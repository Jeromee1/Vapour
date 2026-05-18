export default function Footer() {
  return (
    <div className="footer px-15 py-6 bg-black w-full">
      <hr className="opacity-40 my-4" />
      <div className="flex justify-center w-full">
        <h2 className="text-xs !text-gray-400 text-center break-words max-w-screen-md">
          © 2025 Vapour Corporation. All rights reserved. All trademarks are property of their respective owners in the
          Non-existent countries. This is complete BS. Privacy Policy | Legal | Vapour Subscriber
          Agreement | Refunds | Cookies
        </h2>
      </div>
      <hr className="opacity-40 my-4" />
      <div className="w-full flex justify-around">
        <h2 className="text-center mb-2 text-sm">© Jeremy Ho 2025</h2>
        <h2 className="text-center text-xs">For educational purposes</h2>
      </div>
    </div>
  );
}
