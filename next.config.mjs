/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep M0's "type errors don't block a deploy" behaviour; run `npx tsc --noEmit` to check types.
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
