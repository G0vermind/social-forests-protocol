import Image from 'next/image';

interface AssetImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function AssetImage({ src, alt, className = '' }: AssetImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 backdrop-blur-md bg-brand-sepia/20 border border-brand-sepia/30 shadow-xl ${className}`}>
      <div className="relative w-full h-full min-h-[200px]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover rounded-xl hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>
    </div>
  );
}
