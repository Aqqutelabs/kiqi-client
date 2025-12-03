declare module "bootstrap";
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

export {};
