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
    spacing = "0",
    sm,
    className,
 }: HeadingProps) {
    return (
        <div className={`text-[#0F172B] md:leading-6 md:space-y-${spacing} ${className}`}>
            <h2 className={`${sm ? 'text-base' : 'text-xl'} font-medium`}>{heading}</h2>
            <p className={`text-xs md:text-sm font-normal text-[#62748E]`}>{subtitle}</p>
          </div>
    )
}