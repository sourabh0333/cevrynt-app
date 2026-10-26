/*
 * Class strings shared by the client sidebar and the server-rendered parts
 * it shows (workspace switcher, profile). A plain module, so server
 * components can import the strings themselves.
 */

// Text that leaves on collapse and returns once the rail has mostly opened.
export const fade =
  "whitespace-nowrap transition-[opacity,transform,visibility] duration-[100ms] ease-out delay-[120ms] collapsed:invisible collapsed:-translate-x-1 collapsed:opacity-0 collapsed:delay-0";

// Padding that eases in step with the sidebar width.
export const glide = "transition-[padding] duration-300 ease-sidebar";

export const switcherBox =
  "relative mb-2.5 flex h-[54px] flex-none cursor-pointer items-center overflow-hidden rounded-[16px] border border-teal/7 bg-teal/7 pl-2.5 text-left text-muted transition-[padding,height] duration-300 ease-sidebar collapsed:h-[46px] collapsed:pl-[9px]";

export const profileBox = `relative flex flex-none items-center pt-3 pb-2.5 pl-1 collapsed:pl-2 ${glide}`;
