export function Upvote({ upvoteState, size = "20px" }) {
  return (
    <>
      {!upvoteState ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 28 28"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-big-up stroke-white/75 duration-100 group-hover:stroke-primary"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
            className="-translate-x-[0.11rem] -translate-y-[0.13rem] scale-[130%]"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 28 28"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-big-up group-hover:stoke-white fill-primary stroke-primary duration-100"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
            className="-translate-x-[0.11rem] -translate-y-[0.13rem] scale-[130%]"
          />
        </svg>
      )}
    </>
  );
}

export function Downvote({ downvoteState, size = "20px" }) {
  return (
    <>
      {!downvoteState ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 28 28"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-big-down stroke-white/75 duration-100 group-hover:stroke-danger"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"
            className="-translate-x-[0.11rem] -translate-y-[0.13rem] scale-[130%]"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 28 28"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-big-down fill-danger opacity-100 stroke-danger duration-100 group-hover:stroke-danger"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"
            className="-translate-x-[0.11rem] -translate-y-[0.13rem] scale-[130%]"
          />
        </svg>
      )}
    </>
  );
}

export function Comment({ size = "20px" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-white/75 duration-100 group-hover:stroke-primary"
    >
      <path
        d="M7.79111 25.2L13.6346 19.3566H23.1998C24.3044 19.3566 25.1998 18.4611 25.1998 17.3566V4.80005C25.1998 3.69548 24.3044 2.80005 23.1998 2.80005H4.7998C3.69524 2.80005 2.7998 3.69548 2.7998 4.80005V17.3566C2.7998 18.4611 3.69524 19.3566 4.79981 19.3566H7.79111V25.2Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="matrix(1, 0, 0, 1, -1.7763568394002505e-15, 1.7763568394002505e-15)"
      />
    </svg>
  );
}

export function Stats({ size = "20px" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-white/75 duration-100 group-hover:stroke-primary"
    >
      <path
        d="M17.4341 24.6026V4.39722C17.4341 3.84493 16.9864 3.39722 16.4341 3.39722H11.3662C10.8139 3.39722 10.3662 3.84493 10.3662 4.39722V24.6026M17.4341 24.6026L17.4322 12.396C17.4321 11.8437 17.8799 11.3959 18.4322 11.3959H23.5C24.0523 11.3959 24.5 11.8436 24.5 12.3959V23.6026C24.5 24.1548 24.0523 24.6026 23.5 24.6026H17.4341ZM17.4341 24.6026H10.3662M10.3662 24.6026V18.6026C10.3662 18.0503 9.91845 17.6026 9.36616 17.6026H4.5C3.94772 17.6026 3.5 18.0503 3.5 18.6026V23.6026C3.5 24.1548 3.94771 24.6026 4.5 24.6026H10.3662Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Bookmark({ bookmarkState, size = "20px" }) {
  return (
    <>
      {!bookmarkState ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-white/75 duration-100 group-hover:stroke-primary"
        >
          <path
            d="M5.6001 3.80005C5.6001 3.24776 6.04781 2.80005 6.6001 2.80005H21.4001C21.9524 2.80005 22.4001 3.24776 22.4001 3.80005V24.1325C22.4001 24.5564 21.9057 24.788 21.58 24.5166L14.0001 18.2L6.42019 24.5166C6.09453 24.788 5.6001 24.5564 5.6001 24.1325V3.80005Z"
            strokeWidth="2"
            strokeLinejoin="round"
            transform="matrix(1, 0, 0, 1, -8.881784197001252e-16, 0)"
          />
        </svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.6001 3.80005C5.6001 3.24776 6.04781 2.80005 6.6001 2.80005H21.4001C21.9524 2.80005 22.4001 3.24776 22.4001 3.80005V24.1325C22.4001 24.5564 21.9057 24.788 21.58 24.5166L14.0001 18.2L6.42019 24.5166C6.09453 24.788 5.6001 24.5564 5.6001 24.1325V3.80005Z"
            // stroke={color}
            // fill={color}
            strokeWidth="2"
            strokeLinejoin="round"
            transform="matrix(1, 0, 0, 1, -8.881784197001252e-16, 0)"
            className="stroke-primary fill-primary duration-100 group-hover:stroke-primary"
          />
        </svg>
      )}
    </>
  );
}

export function Reply({ size = "20", color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path
        d="M10.3999 4.9001L4.2002 11.0998M4.2002 11.0998L10.3999 17.2995M4.2002 11.0998L19.8002 11.0998C22.0093 11.0998 23.8002 12.8906 23.8002 15.0998L23.8002 23.1001"
        // stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Share() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path
        d="M14.7501 5.59426L7.55008 0.824997L7.55008 3.525C1.24994 4.875 1.24994 11.175 1.24994 11.175C1.24994 11.175 3.94994 7.575 7.55008 8.025L7.55008 10.815L14.7501 5.59426Z"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Edit() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path
        d="M8.08647 3.2137L10.7865 5.9137M1.33652 12.6637L4.61101 12.0039C4.78484 11.9689 4.94445 11.8833 5.0698 11.7579L12.4001 4.42358C12.7515 4.07194 12.7513 3.50195 12.3995 3.1506L10.8467 1.59955C10.4951 1.24835 9.92541 1.24859 9.57411 1.60008L2.24309 8.93512C2.11798 9.0603 2.03255 9.21959 1.99749 9.39306L1.33652 12.6637Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Copy() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path
        d="M3.53388 5.64291L1.85879 7.318C1.23319 7.9436 0.873431 8.79482 0.880005 9.68943C0.886579 10.584 1.23847 11.4405 1.89375 12.0755C2.52877 12.7308 3.38536 13.0827 4.27983 13.0893C5.1947 13.096 6.02577 12.7565 6.65141 12.1309L8.3265 10.4558M10.4661 8.3571L12.1412 6.68201C12.7668 6.05641 13.1266 5.20518 13.12 4.31057C13.1134 3.41596 12.7615 2.55955 12.1062 1.9245C11.4714 1.28963 10.6149 0.937727 9.72032 0.931152C8.82571 0.924578 7.97437 1.26392 7.34874 1.88954L5.67364 3.56463M4.45983 9.49538L9.4851 4.4701"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Unhappy() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.83999 5.83999V5.08999C5.42577 5.08999 5.08999 5.42577 5.08999 5.83999H5.83999ZM5.91171 5.83999H6.66171C6.66171 5.42577 6.32592 5.08999 5.91171 5.08999V5.83999ZM10.16 5.83999V5.08999C9.74577 5.08999 9.40999 5.42577 9.40999 5.83999H10.16ZM10.2237 5.83999H10.9737C10.9737 5.42577 10.638 5.08999 10.2237 5.08999V5.83999ZM5.91171 5.89764V6.64764C6.32592 6.64764 6.66171 6.31186 6.66171 5.89764H5.91171ZM5.83999 5.89764H5.08999C5.08999 6.31186 5.42577 6.64764 5.83999 6.64764V5.89764ZM10.2237 5.89764V6.64764C10.638 6.64764 10.9737 6.31186 10.9737 5.89764H10.2237ZM10.16 5.89764H9.40999C9.40999 6.31186 9.74577 6.64764 10.16 6.64764V5.89764ZM7.99993 9.80285V9.05285V9.80285ZM9.85825 11.6082C10.0763 11.9604 10.5385 12.0692 10.8907 11.8512C11.2429 11.6331 11.3517 11.1709 11.1337 10.8187L9.85825 11.6082ZM4.86618 10.8187C4.64817 11.1709 4.75695 11.6331 5.10915 11.8512C5.46135 12.0692 5.92359 11.9604 6.1416 11.6082L4.86618 10.8187ZM14.45 7.99999C14.45 11.5622 11.5622 14.45 7.99999 14.45V15.95C12.3907 15.95 15.95 12.3907 15.95 7.99999H14.45ZM7.99999 14.45C4.43775 14.45 1.54999 11.5622 1.54999 7.99999H0.0499878C0.0499878 12.3907 3.60932 15.95 7.99999 15.95V14.45ZM1.54999 7.99999C1.54999 4.43775 4.43775 1.54999 7.99999 1.54999V0.0499878C3.60932 0.0499878 0.0499878 3.60932 0.0499878 7.99999H1.54999ZM7.99999 1.54999C11.5622 1.54999 14.45 4.43775 14.45 7.99999H15.95C15.95 3.60932 12.3907 0.0499878 7.99999 0.0499878V1.54999ZM5.83999 6.58999H5.91171V5.08999H5.83999V6.58999ZM10.16 6.58999H10.2237V5.08999H10.16V6.58999ZM5.16171 5.83999V5.89764H6.66171V5.83999H5.16171ZM5.91171 5.14764H5.83999V6.64764H5.91171V5.14764ZM6.58999 5.89764V5.83999H5.08999V5.89764H6.58999ZM9.47374 5.83999V5.89764H10.9737V5.83999H9.47374ZM10.2237 5.14764H10.16V6.64764H10.2237V5.14764ZM10.91 5.89764V5.83999H9.40999V5.89764H10.91ZM7.99993 10.5529C8.77226 10.5529 9.46066 10.9659 9.85825 11.6082L11.1337 10.8187C10.4814 9.76489 9.32633 9.05285 7.99993 9.05285V10.5529ZM6.1416 11.6082C6.5392 10.9659 7.2276 10.5529 7.99993 10.5529V9.05285C6.67353 9.05285 5.5185 9.76489 4.86618 10.8187L6.1416 11.6082Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Delete() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path
        d="M1 3.63235H13M5.5 11.5735V6.80882M8.5 11.5735V6.80882M10 14.75H4C3.17157 14.75 2.5 14.0389 2.5 13.1618V4.42647C2.5 3.98789 2.83579 3.63235 3.25 3.63235H10.75C11.1642 3.63235 11.5 3.98789 11.5 4.42647V13.1618C11.5 14.0389 10.8284 14.75 10 14.75ZM5.5 3.63235H8.5C8.91421 3.63235 9.25 3.27681 9.25 2.83824V2.04412C9.25 1.60554 8.91421 1.25 8.5 1.25H5.5C5.08579 1.25 4.75 1.60554 4.75 2.04412V2.83824C4.75 3.27681 5.08579 3.63235 5.5 3.63235Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Report() {
  return (
    <svg width="14" height="13" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path
        d="M10 9.90003V5.41447M10 13.2248V13.2642M15.6699 17H4.33007C2.7811 17 1.47392 15.9763 1.06265 14.5757C0.887092 13.9778 1.10281 13.3551 1.43276 12.8249L7.10269 2.60102C8.4311 0.466323 11.5689 0.466326 12.8973 2.60103L18.5672 12.8249C18.8972 13.3551 19.1129 13.9778 18.9373 14.5757C18.5261 15.9763 17.2189 17 15.6699 17Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Settings() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.6763 4.31627C13.2488 2.56124 10.7512 2.56124 10.3237 4.31627C10.2599 4.57999 10.1347 4.82492 9.95831 5.03112C9.78194 5.23732 9.55938 5.39897 9.30874 5.50291C9.0581 5.60684 8.78646 5.65014 8.51592 5.62927C8.24538 5.60839 7.9836 5.52394 7.75187 5.38279C6.20832 4.44227 4.44201 6.20855 5.38254 7.75207C5.99006 8.74884 5.45117 10.0494 4.31713 10.325C2.56096 10.7514 2.56096 13.25 4.31713 13.6753C4.58093 13.7392 4.8259 13.8645 5.03211 14.041C5.23831 14.2175 5.39991 14.4402 5.50375 14.691C5.6076 14.9418 5.65074 15.2135 5.62968 15.4841C5.60862 15.7547 5.52394 16.0165 5.38254 16.2482C4.44201 17.7917 6.20832 19.558 7.75187 18.6175C7.98356 18.4761 8.24536 18.3914 8.51597 18.3704C8.78658 18.3493 9.05834 18.3924 9.30912 18.4963C9.5599 18.6001 9.7826 18.7617 9.95911 18.9679C10.1356 19.1741 10.2609 19.4191 10.3248 19.6829C10.7512 21.439 13.2499 21.439 13.6752 19.6829C13.7393 19.4192 13.8647 19.1744 14.0413 18.9684C14.2178 18.7623 14.4405 18.6008 14.6912 18.497C14.9419 18.3932 15.2135 18.35 15.4841 18.3709C15.7546 18.3919 16.0164 18.4764 16.2481 18.6175C17.7917 19.558 19.558 17.7917 18.6175 16.2482C18.4763 16.0165 18.3918 15.7547 18.3709 15.4842C18.35 15.2136 18.3932 14.942 18.497 14.6913C18.6008 14.4406 18.7623 14.2179 18.9683 14.0414C19.1744 13.8648 19.4192 13.7394 19.6829 13.6753C21.439 13.2489 21.439 10.7502 19.6829 10.325C19.4191 10.2611 19.1741 10.1358 18.9679 9.95928C18.7617 9.78278 18.6001 9.56007 18.4962 9.3093C18.3924 9.05853 18.3493 8.78677 18.3703 8.51617C18.3914 8.24556 18.4761 7.98376 18.6175 7.75207C19.558 6.20855 17.7917 4.44227 16.2481 5.38279C16.0164 5.52418 15.7546 5.60886 15.484 5.62992C15.2134 5.65098 14.9417 5.60784 14.6909 5.504C14.4401 5.40016 14.2174 5.23856 14.0409 5.03236C13.8644 4.82616 13.7391 4.58119 13.6752 4.3174L13.6763 4.31627Z"
        stroke="white"
        stroke-width="2"
      />
      <path
        d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
        stroke="white"
        stroke-width="2"
      />
    </svg>
  );
}
