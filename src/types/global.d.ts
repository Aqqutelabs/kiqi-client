declare module "bootstrap/dist/js/bootstrap.bundle.min.js";
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

export {};
