import Image from 'next/image'

interface LogoProps {
  variant: 'light' | 'dark'
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
}

export default function Logo({
  variant,
  width = 120,
  height = 32,
  className,
  style,
}: LogoProps) {
  const src = variant === 'dark'
    ? '/branding/logo-white.png'
    : '/branding/logo-color.png'

  return (
    <div
      className={className}
      style={{ 
        position: 'relative',
        width: width,
        height: height,
        ...style 
      }}
    >
      <Image
        src={src}
        alt="Performia"
        fill
        sizes='(max-width: 768px) 100vw, 150px'
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  );
}
