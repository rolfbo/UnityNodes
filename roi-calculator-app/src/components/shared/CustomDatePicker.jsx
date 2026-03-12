import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

const CustomDatePicker = ({ selected, onChange, placeholderText, ...props }) => {
    return (
        <div className="relative w-full">
            <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none z-10" />
            <DatePicker
                selected={selected}
                onChange={onChange}
                placeholderText={placeholderText}
                dateFormat="yyyy-MM-dd"
                className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-purple-400/30 rounded-lg text-white hover:border-purple-400/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors cursor-pointer outline-none"
                calendarClassName="custom-datepicker"
                wrapperClassName="w-full"
                popperContainer={({ children }) => {
                    return ReactDOM.createPortal(children, document.body);
                }}
                popperProps={{
                    strategy: 'fixed'
                }}
                {...props}
            />
        </div>
    );
};

export default CustomDatePicker;
