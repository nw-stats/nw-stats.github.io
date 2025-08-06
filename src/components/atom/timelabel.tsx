export interface TimeLabelProps {
    seconds: number;
    className?: string; // optional Tailwind or other styles
}

const TimeLabel: React.FC<TimeLabelProps> = ({ seconds, className }) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const label = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

    return (
        <span className={className}>
            {label}
        </span>
    );
};

export default TimeLabel;
