type HeadingProps = {
    heading: string;
    subtitle?: string;
    spacing?: string;
    sm?: boolean;
    className?: string;
}

export default function Heading({ 
    heading, 
    subtitle,
    spacing = "1",
    sm,
    className,
 }: HeadingProps) {
    return (
        <div className={`text-[#1B223C] md:leading-6 space-y-1 md:space-y-${spacing} ${className}`}>
            <h2 className={`${sm ? 'text-base' : 'text-xl'} font-semibold`}>{heading}</h2>
            <p className={`text-xs md:text-base font-normal`}>{subtitle}</p>
          </div>
    )
}