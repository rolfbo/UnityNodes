import { useState } from 'react';
import { Info } from 'lucide-react';

const InfoTooltip = ({ content }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-block ml-1">
            <Info
                size={16}
                className="text-purple-400 cursor-help"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            />
            {show && (
                <div className="absolute z-50 w-64 p-3 bg-slate-800 border border-purple-400/30 rounded-lg shadow-lg text-sm text-purple-200 left-0 top-full mt-1">
                    {content}
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;
