import { Package } from 'lucide-react';
import HelpTooltip from '../shared/HelpTooltip.jsx';

/**
 * Node configuration section - nodes and licenses per node
 */
export function NodeConfiguration({
    numNodes, setNumNodes,
    licensesPerNode, setLicensesPerNode,
    nodePrice, totalNodeCost,
    setLicensesRunBySelf, setLicensesLeased, setLicensesInactive
}) {
    const handleLicensesPerNodeChange = (newValue) => {
        setLicensesPerNode(newValue);
        // Reset license distribution when changing total licenses
        const defaultSelfRun = newValue * 0.25;
        const defaultLeased = newValue * 0.5;
        const defaultInactive = newValue - defaultSelfRun - defaultLeased;
        setLicensesRunBySelf(defaultSelfRun);
        setLicensesLeased(defaultLeased);
        setLicensesInactive(defaultInactive);
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Package className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">Node Configuration</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <HelpTooltip content="The number of Unity Nodes you want to purchase and operate. Each node costs $5,000 and comes with 200 Unity License NFTs.">
                        <label className="text-sm text-purple-300 block mb-2">
                            Number of Unity Nodes
                        </label>
                    </HelpTooltip>
                    <div className="flex gap-2 mb-2">
                        <button
                            onClick={() => setNumNodes(Math.max(1, numNodes - 1))}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-200 hover:text-purple-100 transition-colors"
                        >
                            -1
                        </button>
                        <input
                            type="number"
                            value={numNodes}
                            onChange={(e) => setNumNodes(Math.max(1, parseInt(e.target.value) || 1))}
                            className="flex-1 bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                            min="1"
                        />
                        <button
                            onClick={() => setNumNodes(numNodes + 1)}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-200 hover:text-purple-100 transition-colors"
                        >
                            +1
                        </button>
                    </div>
                    <p className="text-xs text-purple-300 mt-1">
                        ${nodePrice.toLocaleString()} per node × {numNodes} = ${totalNodeCost.toLocaleString()}
                    </p>
                </div>

                <div>
                    <HelpTooltip content="Each Unity Node comes with 200 Unity License NFTs by default. These licenses can be activated on smartphones to participate in the network and earn revenue.">
                        <label className="text-sm text-purple-300 block mb-2">
                            Licenses per Node
                        </label>
                    </HelpTooltip>
                    <div className="flex gap-2 mb-2">
                        <button
                            onClick={() => handleLicensesPerNodeChange(Math.max(1, licensesPerNode - 200))}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-200 hover:text-purple-100 transition-colors"
                        >
                            -200
                        </button>
                        <input
                            type="number"
                            value={licensesPerNode}
                            onChange={(e) => handleLicensesPerNodeChange(Math.max(1, parseInt(e.target.value) || 200))}
                            className="flex-1 bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                            min="1"
                        />
                        <button
                            onClick={() => handleLicensesPerNodeChange(licensesPerNode + 200)}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-200 hover:text-purple-100 transition-colors"
                        >
                            +200
                        </button>
                    </div>
                    <p className="text-xs text-purple-300 mt-1">
                        Total licenses available: {numNodes * licensesPerNode}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-blue-300 font-semibold mb-2">What's Included Per Node:</h3>
                    <ul className="text-sm text-blue-200 space-y-1">
                        <li>• {licensesPerNode} Unity License NFTs</li>
                        <li>• $1,875 MNTx staked (24mo lock)</li>
                        <li>• $1,875 WMTx staked (24mo lock)</li>
                        <li>• NFTs are transferable & sellable</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
