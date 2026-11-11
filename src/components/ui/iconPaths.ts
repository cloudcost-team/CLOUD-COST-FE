export type IconPath = {
  d: string;
  strokeWidth: number;
  linecap?: "round";
  linejoin?: "round";
};

export const iconPaths = {
  "alert-circle": [
    {
      d: "M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M10 6.5V10.5M10 13.4V13.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  "alert-triangle": [
    {
      d: "M10 3.5L17 16H3L10 3.5Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M10 8V11.5M10 13.7V13.8",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  "arrow-right": [
    {
      d: "M4.5 10H15.5M11 14.5L15.5 10L11 5.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  "bar-chart": [
    {
      d: "M4.5 16V10.5M10 16V4.5M15.5 16V8",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  bell: [
    {
      d: "M8.5 16.5H11.5M5.5 13.5V9C5.5 7.80653 5.97411 6.66193 6.81802 5.81802C7.66193 4.97411 8.80653 4.5 10 4.5C11.1935 4.5 12.3381 4.97411 13.182 5.81802C14.0259 6.66193 14.5 7.80653 14.5 9V13.5L15.5 14.5H4.5L5.5 13.5Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  calendar: [
    {
      d: "M5.5 4.5H14.5C15.6046 4.5 16.5 5.39543 16.5 6.5V14.5C16.5 15.6046 15.6046 16.5 14.5 16.5H5.5C4.39543 16.5 3.5 15.6046 3.5 14.5V6.5C3.5 5.39543 4.39543 4.5 5.5 4.5Z",
      strokeWidth: 1.6,
    },
    { d: "M3.5 8.5H16.5M7 3V6M13 3V6", strokeWidth: 1.6, linecap: "round" },
  ],
  check: [
    {
      d: "M4.5 10.5L8 14L15.5 6.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  "check-circle": [
    {
      d: "M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M7 10L9.2 12.2L13.2 8",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  "chevron-down": [
    {
      d: "M5 7.5L10 12.5L15 7.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  "chevron-left": [
    {
      d: "M12.5 5L7.5 10L12.5 15",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  "chevron-right": [
    {
      d: "M7.5 5L12.5 10L7.5 15",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  "chevron-up": [
    {
      d: "M5 12.5L10 7.5L15 12.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  clock: [
    {
      d: "M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M10 6.5V10L12.5 11.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  close: [
    {
      d: "M6 6L10 10M10 10L14 14M10 10L14 6M10 10L6 14",
      strokeWidth: 1.8,
      linecap: "round",
    },
  ],
  "external-link": [
    {
      d: "M8.5 4.5H4.5V15.5H15.5V11.5M15.5 8.5V4.5H11.5M15.5 4.5L9 11",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  "file-text": [
    {
      d: "M15 6.5L11.5 3H5.5V17H15V6.5ZM11.5 3V6.5H15M8 10H12.5M8 13H12.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  grid: [
    {
      d: "M4.5 3.5H7.5C8.05228 3.5 8.5 3.94772 8.5 4.5V7.5C8.5 8.05228 8.05228 8.5 7.5 8.5H4.5C3.94772 8.5 3.5 8.05228 3.5 7.5V4.5C3.5 3.94772 3.94772 3.5 4.5 3.5Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M12.5 3.5H15.5C16.0523 3.5 16.5 3.94772 16.5 4.5V7.5C16.5 8.05228 16.0523 8.5 15.5 8.5H12.5C11.9477 8.5 11.5 8.05228 11.5 7.5V4.5C11.5 3.94772 11.9477 3.5 12.5 3.5Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M4.5 11.5H7.5C8.05228 11.5 8.5 11.9477 8.5 12.5V15.5C8.5 16.0523 8.05228 16.5 7.5 16.5H4.5C3.94772 16.5 3.5 16.0523 3.5 15.5V12.5C3.5 11.9477 3.94772 11.5 4.5 11.5Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M12.5 11.5H15.5C16.0523 11.5 16.5 11.9477 16.5 12.5V15.5C16.5 16.0523 16.0523 16.5 15.5 16.5H12.5C11.9477 16.5 11.5 16.0523 11.5 15.5V12.5C11.5 11.9477 11.9477 11.5 12.5 11.5Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  info: [
    {
      d: "M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M10 9.5V13.5M10 6.6V6.7",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  link: [
    {
      d: "M8.5 11.5L11.5 8.5M9 6L10.5 4.5C11.0777 4.06671 11.7923 3.85636 12.5127 3.90755C13.233 3.95874 13.9107 4.26805 14.4213 4.77868C14.932 5.28931 15.2413 5.967 15.2925 6.68733C15.3436 7.40766 15.1333 8.12228 14.7 8.7L13.2 10.2M11 14L9.5 15.5C8.92228 15.9333 8.20766 16.1436 7.48733 16.0925C6.767 16.0413 6.08931 15.732 5.57868 15.2213C5.06805 14.7107 4.75874 14.033 4.70755 13.3127C4.65636 12.5923 4.86671 11.8777 5.3 11.3L6.8 9.8",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  logout: [
    {
      d: "M8 4H4.5V16H8M12 13.5L15.5 10L12 6.5M15.5 10H8",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  minus: [
    {
      d: "M4.5 10H15.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  plus: [
    {
      d: "M10 4.5V10M10 10V15.5M10 10H4.5M10 10H15.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  refresh: [
    {
      d: "M15.5 10C15.495 11.2722 15.0491 12.5032 14.2382 13.4836C13.4274 14.4639 12.3019 15.1328 11.0532 15.3764C9.80458 15.62 8.5101 15.4232 7.39026 14.8196C6.27042 14.2159 5.39448 13.2427 4.91162 12.0657C4.42875 10.8888 4.36883 9.58079 4.74207 8.3646C5.1153 7.1484 5.8986 6.09919 6.95855 5.39568C8.01851 4.69217 9.28957 4.37786 10.5553 4.50628C11.8209 4.63471 13.003 5.19792 13.9 6.1M15.5 3.5V6.5H12.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  sliders: [
    {
      d: "M4 6H16M4 14H16",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M9.3 6C9.3 6.99411 8.49411 7.8 7.5 7.8C6.50589 7.8 5.7 6.99411 5.7 6C5.7 5.00589 6.50589 4.2 7.5 4.2C8.49411 4.2 9.3 5.00589 9.3 6Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M14.3 14C14.3 14.9941 13.4941 15.8 12.5 15.8C11.5059 15.8 10.7 14.9941 10.7 14C10.7 13.0059 11.5059 12.2 12.5 12.2C13.4941 12.2 14.3 13.0059 14.3 14Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  "trending-down": [
    {
      d: "M3 6L8 11L11 8L17 14M17 10V14H13",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
  user: [
    {
      d: "M13 7C13 8.65685 11.6569 10 10 10C8.34315 10 7 8.65685 7 7C7 5.34315 8.34315 4 10 4C11.6569 4 13 5.34315 13 7Z",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
    {
      d: "M4 16.5C4 14.9087 4.63214 13.3826 5.75736 12.2574C6.88258 11.1321 8.4087 10.5 10 10.5C11.5913 10.5 13.1174 11.1321 14.2426 12.2574C15.3679 13.3826 16 14.9087 16 16.5",
      strokeWidth: 1.8,
      linecap: "round",
      linejoin: "round",
    },
  ],
} satisfies Record<string, IconPath[]>;

export type IconName = keyof typeof iconPaths;
