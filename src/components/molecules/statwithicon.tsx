interface StatDisplayProps {
    icon: React.ReactElement;
    value: number | React.ReactNode;
}

const StatWithIcon: React.FC<StatDisplayProps> = ({ icon, value }) => {
    return (
        <div className="grid grid-rows-2 place-items-center">
            {icon}
            <div>{value}</div>
        </div>
    );
};

export default StatWithIcon;
