import { AlertTriangle } from 'lucide-react';

/**
 * Disclaimer footer
 */
export function Disclaimer() {
    return (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-8">
            <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                    <h3 className="text-red-300 font-semibold mb-1">Disclaimer</h3>
                    <p className="text-sm text-red-200">
                        This calculator is for illustrative purposes only and does not constitute financial advice. Actual returns may vary significantly based on network performance, market conditions, token price fluctuations, and other factors. Always conduct thorough due diligence before making investment decisions. Past performance does not guarantee future results.
                    </p>
                </div>
            </div>
        </div>
    );
}
