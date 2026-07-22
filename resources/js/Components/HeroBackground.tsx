interface HeroBackgroundProps {
    className?: string;
}

export function HeroBackground({ className = '' }: HeroBackgroundProps) {
    return (
        <div className={`pointer-events-none absolute inset-0 ${className}`}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
            <div className="absolute -right-16 -top-10 h-56 w-56 rounded-full bg-blue-600/15 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-600/15 blur-3xl" />
        </div>
    );
}
