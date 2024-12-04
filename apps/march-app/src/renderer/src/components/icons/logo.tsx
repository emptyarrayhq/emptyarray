import { type JSX } from 'react'

interface Props {
  size?: number
}

const Logo = ({ size = 64 }: Props): JSX.Element => {
  return (
    <svg
      width={size}
      height={size + 2}
      viewBox="0 0 64 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33.0083 0.000508212C37.3756 -0.0281548 42.3973 1.15503 47.0812 3.7001C49.9834 5.27708 52.5971 7.28014 54.9503 9.65995C57.9964 12.7408 60.4026 16.27 62.0114 20.3316C62.7957 22.3122 63.3668 24.392 63.9139 26.4609C64.3708 28.1879 62.949 29.886 61.0971 29.9934C59.1716 30.1049 57.6223 28.795 57.056 26.7302C54.5104 17.4506 48.7276 11.2979 39.9312 8.18006C36.5361 6.97673 32.9958 6.76601 29.4202 7.10558C21.2995 7.87664 15.0779 11.9548 10.42 18.7203C8.7453 21.1528 7.61969 23.8711 6.88964 26.7591C6.43574 28.5548 5.23202 29.7933 3.46098 29.9281C1.16594 30.1029 -0.340717 28.2 0.0663666 26.3447C1.32692 20.5973 3.76091 15.4827 7.6267 11.1171C11.2331 7.04464 15.4987 3.9684 20.5237 2.04307C24.2518 0.614568 28.1166 0.000508212 33.0083 0.000508212Z"
        fill="#3A3A3A"
      />
      <path
        d="M32.1622 33.1537C37.6569 33.1537 43.1513 33.1537 48.646 33.1537C49.649 33.1537 49.6295 33.1529 49.5712 34.1527C49.4 37.0925 48.5874 39.8323 47.1089 42.3447C44.561 46.6743 40.8654 49.4064 36.0988 50.623C34.3104 51.0793 32.4881 51.2631 30.6722 51.0623C26.9611 50.6516 23.6027 49.2901 20.7652 46.7306C17.2784 43.5855 15.2831 39.6343 14.8071 34.8777C14.7723 34.5296 14.7501 34.1795 14.7 33.8338C14.6184 33.2715 14.8627 33.1405 15.3777 33.1431C19.2479 33.1624 23.1182 33.1534 26.9884 33.1534C28.7129 33.1537 30.4377 33.1537 32.1622 33.1537Z"
        fill="black"
      />
      <path
        d="M35.4639 62.4798C35.4693 60.8365 36.723 59.151 38.2472 58.741C40.7526 58.0669 43.169 57.1677 45.4256 55.7969C47.1649 54.7402 48.9059 54.9923 50.0907 56.3508C51.4747 57.9374 51.2079 60.1309 49.5248 61.3442C46.4712 63.5453 43.1165 64.9889 39.5361 65.8884C37.3293 66.4428 35.4562 64.8776 35.4639 62.4798Z"
        fill="#3A3A3A"
      />
      <path
        d="M16.7208 55.1431C17.3112 55.3222 17.9673 55.3851 18.4807 55.7006C20.8222 57.1403 23.3503 58.0493 25.953 58.7929C28.4144 59.4958 29.5799 62.4351 28.269 64.5337C27.4953 65.7722 26.381 66.2237 24.9981 65.8979C21.3041 65.0273 17.856 63.5442 14.6297 61.4708C12.5788 60.1529 12.463 57.4438 14.4349 55.9921C15.1354 55.4765 15.8231 55.2507 16.7208 55.1431Z"
        fill="#3A3A3A"
      />
      <path
        d="M7.10097 52.5698C5.86287 52.6026 5.05815 52.0804 4.45611 51.1551C2.28168 47.8136 0.974519 44.0994 0.0562029 40.2223C-0.291106 38.7562 1.02056 37.0088 2.63049 36.6494C4.65079 36.1982 6.34755 37.7841 6.85099 39.3096C7.41775 41.0272 7.98626 42.7464 8.63358 44.4323C8.9406 45.2316 9.43154 45.956 9.84115 46.7132C10.4367 47.8133 10.779 48.946 10.3061 50.2001C9.75007 51.6747 8.49846 52.5673 7.10097 52.5698Z"
        fill="#3A3A3A"
      />
      <path
        d="M53.4717 48.9226C53.7332 48.2219 53.9006 47.4615 54.2729 46.8312C55.5652 44.6431 56.4608 42.2961 57.0692 39.8246C57.5718 37.7837 59.1491 36.4743 61.0332 36.5769C62.9546 36.6815 64.3516 38.5232 63.9217 40.4546C63.0918 44.1837 61.7806 47.712 59.7251 50.9186C58.8268 52.32 57.5581 52.8585 56.1418 52.4251C54.6305 51.9623 53.6126 50.5749 53.4717 48.9226Z"
        fill="#3A3A3A"
      />
    </svg>
  )
}

export default Logo

export const LogoDark = ({ size = 64 }: Props): JSX.Element => {
  return (
    <svg
      width={size}
      height={size + 2}
      viewBox="0 0 49 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.272 0.000392709C28.6157 -0.021756 32.4604 0.892524 36.0466 2.85917C38.2685 4.07775 40.2697 5.62556 42.0713 7.4645C44.4035 9.84519 46.2457 12.5723 47.4775 15.7108C48.078 17.2413 48.5152 18.8483 48.934 20.447C49.2839 21.7815 48.1953 23.0937 46.7774 23.1767C45.3032 23.2629 44.1171 22.2507 43.6835 20.6551C41.7345 13.4846 37.3071 8.73017 30.5724 6.32095C27.973 5.39111 25.2624 5.22828 22.5248 5.49067C16.3075 6.08649 11.544 9.2378 7.97778 14.4657C6.69562 16.3453 5.83383 18.4459 5.27488 20.6775C4.92737 22.0651 4.00576 23.0221 2.64981 23.1262C0.892674 23.2613 -0.260861 21.7909 0.0508119 20.3572C1.01593 15.9161 2.87945 11.9639 5.83919 8.5905C8.60035 5.44359 11.8662 3.06649 15.7134 1.57874C18.5678 0.474893 21.5267 0.000392709 25.272 0.000392709Z"
        fill="#9C9C9D"
      />
      <path
        d="M24.6245 25.6188C28.8314 25.6188 33.038 25.6188 37.2449 25.6188C38.0128 25.6188 37.9979 25.6182 37.9532 26.3908C37.8222 28.6624 37.2 30.7795 36.068 32.7209C34.1173 36.0666 31.2879 38.1777 27.6384 39.1178C26.2692 39.4704 24.874 39.6125 23.4837 39.4573C20.6424 39.1399 18.0711 38.0879 15.8987 36.11C13.2291 33.6798 11.7014 30.6265 11.337 26.951C11.3104 26.682 11.2933 26.4115 11.255 26.1443C11.1925 25.7098 11.3795 25.6086 11.7738 25.6106C14.737 25.6256 17.7001 25.6186 20.6633 25.6186C21.9836 25.6188 23.3042 25.6188 24.6245 25.6188Z"
        fill="#EDEDED"
      />
      <path
        d="M27.1524 48.2799C27.1565 47.0101 28.1164 45.7077 29.2834 45.3908C31.2015 44.8699 33.0516 44.1751 34.7793 43.1158C36.1109 42.2993 37.4439 42.4941 38.351 43.5438C39.4106 44.7699 39.2063 46.4648 37.9178 47.4024C35.5798 49.1032 33.0114 50.2188 30.2701 50.9138C28.5806 51.3422 27.1465 50.1327 27.1524 48.2799Z"
        fill="#9C9C9D"
      />
      <path
        d="M12.802 42.6106C13.254 42.749 13.7564 42.7976 14.1494 43.0415C15.9422 44.1539 17.8777 44.8564 19.8704 45.4309C21.7549 45.9741 22.6472 48.2453 21.6436 49.867C21.0513 50.824 20.1981 51.1729 19.1393 50.9211C16.3111 50.2484 13.6711 49.1024 11.201 47.5002C9.63078 46.4818 9.5421 44.3885 11.0519 43.2667C11.5882 42.8682 12.1147 42.6938 12.802 42.6106Z"
        fill="#9C9C9D"
      />
      <path
        d="M5.43668 40.6222C4.48876 40.6475 3.87265 40.244 3.41171 39.529C1.74691 36.9469 0.746117 34.0768 0.0430304 31.0809C-0.222878 29.948 0.781367 28.5978 2.01397 28.32C3.56076 27.9713 4.85984 29.1968 5.24529 30.3756C5.67921 31.7029 6.11448 33.0313 6.61009 34.3341C6.84515 34.9517 7.22102 35.5115 7.53463 36.0966C7.99058 36.9467 8.25266 37.8219 7.89058 38.791C7.4649 39.9305 6.50663 40.6202 5.43668 40.6222Z"
        fill="#9C9C9D"
      />
      <path
        d="M40.9395 37.8038C41.1397 37.2624 41.2678 36.6748 41.5529 36.1877C42.5423 34.497 43.228 32.6833 43.6938 30.7735C44.0786 29.1965 45.2862 28.1847 46.7287 28.264C48.1998 28.3448 49.2694 29.768 48.9402 31.2604C48.3049 34.1419 47.301 36.8683 45.7273 39.3462C45.0395 40.4291 44.0681 40.8452 42.9837 40.5103C41.8267 40.1527 41.0474 39.0806 40.9395 37.8038Z"
        fill="#9C9C9D"
      />
    </svg>
  )
}
