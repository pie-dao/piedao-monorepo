import classNames from '../../utils/classnames';

export const PrvIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 32 32"
    className={classNames(className)}
  >
    <path
      fill="#000064"
      d="M32 16c0-8.83656-7.1634-16-16-16C7.16344 0 0 7.16344 0 16c0 8.8366 7.16344 16 16 16 8.8366 0 16-7.1634 16-16Z"
    />
    <path
      fill="#fff"
      d="M13.0052 25.9326h6.8394l7.0051-15.0051-4.8912-2.98449L16.9016 5h-.0208v5.4715h.0208l3.5647 2.2383-3.5647 8.912h-.9534l-3.5648-8.912 3.5648-2.2383h.0207V5h-.0207l-5.057 2.94301L6 10.9275l7.0052 15.0051Z"
    />
  </svg>
);

export const ArvIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 32 32"
    className={classNames(className)}
  >
    <path
      fill="#0B78DD"
      d="M.0000014 16C6.3e-7 7.16345 7.16344.00000217 16 .0000014 24.8366 6.3e-7 32 7.16344 32 16c0 8.8366-7.1634 16-16 16C7.16345 32 .00000217 24.8366.0000014 16Z"
    />
    <path
      fill="#fff"
      d="M12.1554 5.94824h6.8394L26 20.9534l-4.8912 2.9845-5.057 2.943h-.0207v-5.4715h.0207l3.5648-2.2384-3.5648-8.9119h-.9534l-3.5647 8.9119 3.5647 2.2384h.0208v5.4715h-.0208l-5.0569-2.943-4.89124-2.9845L12.1554 5.94824Z"
    />
  </svg>
);

export const BanknotesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
    />
  </svg>
);

export const WalletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 13 13"
    className="w-5 h-5"
  >
    <path
      fill="currentColor"
      d="M11.6549 3.16667H2.98828c-.36819 0-.66667-.29848-.66667-.66667 0-.36819.29848-.66667.66667-.66667h8.66662C11.6549 1.09695 11.058.5 10.3216.5H2.98828C1.88371.5.988281 1.39543.988281 2.5v8.6667c0 .7363.596949 1.3333 1.333329 1.3333h9.33329c.7364 0 1.3334-.597 1.3334-1.3333V4.5c0-.73638-.597-1.33333-1.3334-1.33333ZM2.32161 11.1667V4.5h9.33329v1.33333H6.98828c-.36819 0-.66667.29848-.66667.66667v2.66667c0 .36819.29848.66666.66667.66666h4.66662v1.33337H2.32161ZM8.98828 7.5v.66667c0 .18409-.14924.33333-.33333.33333h-.66667c-.18409 0-.33333-.14924-.33333-.33333V7.5c0-.18409.14924-.33333.33333-.33333h.66667c.18409 0 .33333.14924.33333.33333Z"
    />
  </svg>
);

export const AuxoLogotype = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 71 18">
    <path
      fill="#1F0860"
      d="M11.5036.404938H6.33345L0 17.0053h4.42462l3.15133-1.0119h2.68515l3.1579 1.0119h4.1585L11.5036.404938ZM5.66052 13.3463l3.15793-9.17186h.20232c.04179.11711.08137.24305.12315.38225l3.03258 8.78961-1.9132-1.012H7.57815l-1.91543 1.012h-.0022Zm20.68378 3.9595c-1.5877 0-2.9556-.2496-4.1035-.749-1.148-.4994-2.0254-1.2484-2.6346-2.2493-.6091-.9988-.9148-2.2405-.9148-3.7231V.404938h4.3323V10.4893c0 1.0628.2815 1.9025.8422 2.5145.5608.6121 1.3877.9192 2.4784.9192 1.0908 0 1.9243-.3049 2.5026-.9192.5784-.612.8665-1.4517.8665-2.5145V.404938h4.308V10.5844c0 1.4826-.3056 2.7243-.9148 3.7231-.6091 1.0009-1.4844 1.7499-2.6235 2.2493-1.1392.4994-2.518.749-4.1388.749Zm8.7885-.2894 5.9442-8.75207L35.7112.404938h5.2229l3.0326 4.836722h.1187L47.118.404938h4.8842l-5.39 7.857182 5.9442 8.75208h-5.2471l-3.5845-5.7294h-.121l-3.5846 5.7294H35.135l-.0022.0022Zm27.1997.5789c-1.8143 0-3.3647-.3182-4.6555-.9545-1.2909-.6364-2.2827-1.5909-2.9732-2.8658-.6906-1.2727-1.0358-2.868-1.0358-4.78815 0-1.9201.3452-3.50877 1.0358-4.77485.6905-1.26607 1.6801-2.21618 2.9732-2.85253 1.2908-.636356 2.8434-.954532 4.6555-.954532s3.3646.318176 4.6577.954532c1.2909.63635 2.2827 1.58867 2.9732 2.85253.6905 1.26608 1.0358 2.85696 1.0358 4.77485 0 1.91785-.3453 3.51545-1.0358 4.78815-.6905 1.2727-1.6801 2.2294-2.9732 2.8658-1.2909.6363-2.8434.9545-4.6577.9545Zm0-3.3851c.6905 0 1.2997-.1038 1.8297-.3137.5299-.2099.9742-.5148 1.3348-.9192.3607-.4021.629-.8949.8071-1.4738.1759-.5811.2639-1.2329.2639-1.95763V8.48086c0-.7402-.088-1.40306-.2639-1.98197-.1759-.58111-.4464-1.07163-.8071-1.47377-.3606-.40214-.8071-.70927-1.3348-.91918-.53-.2099-1.1392-.31375-1.8297-.31375-.6905 0-1.3239.10385-1.8517.31375-.53.20991-.972.51704-1.3238.91918-.3519.40214-.618.89487-.7939 1.47377-.1759.58112-.2661 1.24177-.2661 1.98197v1.06501c0 .72473.088 1.37873.2661 1.95763.1759.5811.442 1.0717.7939 1.4738.3518.4044.7938.7093 1.3238.9192.53.2099 1.1458.3137 1.8517.3137Z"
    />
  </svg>
);

export const AuxoLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24">
    <rect width="24" height="24" x=".5" fill="url(#a)" rx="12" />
    <path
      fill="#1F0860"
      d="M14.8167 4.5h-4.412L5 18.75h3.7758l2.6892-.8687h2.2914l2.6949.8687H20L14.8167 4.5ZM9.83048 15.609l2.69482-7.87321h.1727c.0356.10053.0694.20864.1051.32813L15.391 15.609l-1.6327-.8687h-2.2914l-1.63455.8687h-.00187Z"
    />
    <defs>
      <linearGradient
        id="a"
        x1=".5"
        x2="23.8222"
        y1="4.63158"
        y2="5.04303"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" />
        <stop offset="1" stopColor="#F6F7FF" />
      </linearGradient>
    </defs>
  </svg>
);
