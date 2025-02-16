import Link from 'next/link'

export default function Tag({backgroundColor, textColor, name, link, className}) {
  return (
    <Link href={`${link === '' ? '' : link}`} 
    className={`w-max text-xs px-2 py-1 ${backgroundColor ? `bg-${backgroundColor}` : `bg-gray`} ${textColor ? `text-${textColor} ` : `text-white`} rounded-full p-1 `}>
      <p className={`${className}`}>
        {name}
      </p>
    </Link>
  );
}


