import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

const HelpTooltip = ({ content, children }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="inline-flex items-center cursor-help"
            >
                {children}
                <HelpCircle size={14} className="ml-1 text-purple-400 hover:text-purple-300" />
            </div>
            {show && (
                <div className="absolute z-50 w-64 p-3 bg-slate-800 border border-purple-400/30 rounded-lg shadow-lg text-sm text-purple-200 left-0 top-full mt-1">
                    {content}
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 border-l border-t border-purple-400/30 transform rotate-45"></div>
                </div>
            )}
        </div>
    );
};

export default HelpTooltip;
