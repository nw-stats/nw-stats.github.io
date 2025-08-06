import { useMediaQuery } from "react-responsive";

export interface LabelIconProps {
    text: string,
    icon: React.ReactNode,
}
const LabelIcon: React.FC<LabelIconProps> = ({ text, icon }) => {
    const isSmall = useMediaQuery({ maxWidth: 768 });
    return (
        <span>{isSmall ? icon : text}</span>
    );
};
export default LabelIcon;
