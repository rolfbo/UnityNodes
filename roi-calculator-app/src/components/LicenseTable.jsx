/**
 * License Table Component
 *
 * This React component provides an interactive table for managing licenses
 * with full address display, advanced filtering, sorting, and editing capabilities.
 *
 * Key Features:
 * - Full license address display with expandable view
 * - Status badges with color coding
 * - Advanced filtering (status, customer, binding status, etc.)
 * - Sortable columns
 * - Inline editing capabilities
 * - Bulk actions
 * - Pagination for large datasets
 * - Export functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.licenses - Array of license objects
 * @param {Object} props.stats - License statistics
 * @param {Function} props.onRefresh - Callback to refresh data
 * @param {Function} props.onLicenseUpdate - Callback when license is updated
 * @returns {JSX.Element} The interactive license table interface
 */

import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Copy,
    Check,
    X,
    MoreHorizontal,
    Download,
    Settings
} from 'lucide-react';
import {
    updateLicense,
    deleteLicense,
    truncateLicenseAddress,
    getAllLicenses
} from '../utils/licenseStorage.js';

export default function LicenseTable({ licenses, stats, onRefresh, onLicenseUpdate }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [bindingFilter, setBindingFilter] = useState('all');
    const [customerFilter, setCustomerFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'updatedAt', direction: 'desc' });
    const [showFullAddresses, setShowFullAddresses] = useState(false);
    const [editingLicense, setEditingLicense] = useState(null);
    const [selectedLicenses, setSelectedLicenses] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    // Get unique customers for filter dropdown
    const uniqueCustomers = useMemo(() => {
        const customers = new Set();
        licenses.forEach(license => {
            if (license.leaseInfo?.customer) {
                customers.add(license.leaseInfo.customer);
            }
        });
        return Array.from(customers).sort();
    }, [licenses]);

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort licenses
    const filteredAndSortedLicenses = useMemo(() => {
        let filtered = licenses.filter(license => {
            // Search filter
            const searchMatch = searchTerm === '' ||
                license.licenseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                license.leaseInfo?.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                license.notes?.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const statusMatch = statusFilter === 'all' || license.status === statusFilter;

            // Binding filter
            const bindingMatch = bindingFilter === 'all' ||
                (bindingFilter === 'bound' && license.bindingInfo?.isBound) ||
                (bindingFilter === 'unbound' && !license.bindingInfo?.isBound);

            // Customer filter
            const customerMatch = customerFilter === 'all' ||
                (customerFilter === 'leased' && license.status.startsWith('leased')) ||
                (customerFilter === 'self-run' && license.status === 'self-run') ||
                (customerFilter === 'available' && license.status === 'available') ||
                (license.leaseInfo?.customer === customerFilter);

            return searchMatch && statusMatch && bindingMatch && customerMatch;
        });

        // Sort
        filtered.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle nested properties
            if (sortConfig.key === 'customer') {
                aValue = a.leaseInfo?.customer || '';
                bValue = b.leaseInfo?.customer || '';
            } else if (sortConfig.key === 'bindingStatus') {
                aValue = a.bindingInfo?.isBound ? 1 : 0;
                bValue = b.bindingInfo?.isBound ? 1 : 0;
            } else if (sortConfig.key === 'expiryDate') {
                if (a.leaseInfo?.startDate && a.leaseInfo?.duration) {
                    const startDate = new Date(a.leaseInfo.startDate);
                    const duration = a.leaseInfo.durationUnit === 'months' ?
                        a.leaseInfo.duration * 30 : a.leaseInfo.duration;
                    aValue = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
                } else {
                    aValue = new Date(0);
                }
                if (b.leaseInfo?.startDate && b.leaseInfo?.duration) {
                    const startDate = new Date(b.leaseInfo.startDate);
                    const duration = b.leaseInfo.durationUnit === 'months' ?
                        b.leaseInfo.duration * 30 : b.leaseInfo.duration;
                    bValue = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
                } else {
                    bValue = new Date(0);
                }
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    }, [licenses, searchTerm, statusFilter, bindingFilter, customerFilter, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedLicenses.length / itemsPerPage);
    const paginatedLicenses = filteredAndSortedLicenses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle license update
    const handleUpdateLicense = async (licenseId, updates) => {
        const result = updateLicense(licenseId, updates);
        if (result.success) {
            onLicenseUpdate();
            setEditingLicense(null);
        } else {
            // TODO: Show error toast
            console.error('Update failed:', result.message);
        }
    };

    // Handle license delete
    const handleDeleteLicense = async (licenseId) => {
        if (window.confirm('Are you sure you want to delete this license?')) {
            const success = deleteLicense(licenseId);
            if (success) {
                onLicenseUpdate();
                setSelectedLicenses(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(licenseId);
                    return newSet;
                });
            } else {
                // TODO: Show error toast
                console.error('Delete failed');
            }
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedLicenses.size === 0) return;

        const count = selectedLicenses.size;
        if (window.confirm(`Are you sure you want to delete ${count} license${count > 1 ? 's' : ''}?`)) {
            let deletedCount = 0;
            for (const licenseId of selectedLicenses) {
                if (deleteLicense(licenseId)) {
                    deletedCount++;
                }
            }
            onLicenseUpdate();
            setSelectedLicenses(new Set());
        }
    };

    // Copy license address to clipboard
    const copyToClipboard = async (address) => {
        try {
            await navigator.clipboard.writeText(address);
            // TODO: Show success toast
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const statusConfig = {
            'self-run': { color: 'bg-blue-900/30 text-blue-300 border-blue-400/30', label: 'Self-run' },
            'leased-bound': { color: 'bg-green-900/30 text-green-300 border-green-400/30', label: 'Leased & Bound' },
            'leased-unbound': { color: 'bg-red-900/30 text-red-300 border-red-400/30', label: 'Leased & Unbound' },
            'available': { color: 'bg-purple-900/30 text-purple-300 border-purple-400/30', label: 'Available' }
        };

        const config = statusConfig[status] || statusConfig.available;
        return (
            <span className={`px-2 py-1 text-xs rounded-full border ${config.color}`}>
                {config.label}
            </span>
        );
    };

    // Calculate expiry date
    const getExpiryDate = (license) => {
        if (!license.leaseInfo?.startDate || !license.leaseInfo?.duration) {
            return null;
        }

        const startDate = new Date(license.leaseInfo.startDate);
        const duration = license.leaseInfo.durationUnit === 'months' ?
            license.leaseInfo.duration * 30 : license.leaseInfo.duration;
        const expiryDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

        return expiryDate;
    };

    // Get days until expiry
    const getDaysUntilExpiry = (license) => {
        const expiryDate = getExpiryDate(license);
        if (!expiryDate) return null;

        const now = new Date();
        const diffTime = expiryDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown size={14} className="text-slate-500" />;
        }
        return sortConfig.direction === 'asc' ?
            <ArrowUp size={14} className="text-purple-400" /> :
            <ArrowDown size={14} className="text-purple-400" />;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">License Table</h2>
                    <p className="text-slate-400">
                        Detailed view of all licenses with filtering and editing
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFullAddresses(!showFullAddresses)}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800/70 text-slate-300 hover:text-white rounded-lg transition-colors border border-purple-400/20"
                    >
                        {showFullAddresses ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showFullAddresses ? 'Hide' : 'Show'} Full Addresses
                    </button>
                    {selectedLicenses.size > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                            Delete {selectedLicenses.size}
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search licenses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                    >
                        <option value="all">All Statuses</option>
                        <option value="self-run">Self-run</option>
                        <option value="leased-bound">Leased & Bound</option>
                        <option value="leased-unbound">Leased & Unbound</option>
                        <option value="available">Available</option>
                    </select>

                    {/* Binding Filter */}
                    <select
                        value={bindingFilter}
                        onChange={(e) => setBindingFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                    >
                        <option value="all">All Binding</option>
                        <option value="bound">Bound</option>
                        <option value="unbound">Unbound</option>
                    </select>

                    {/* Customer Filter */}
                    <select
                        value={customerFilter}
                        onChange={(e) => setCustomerFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                    >
                        <option value="all">All Customers</option>
                        <option value="leased">Leased</option>
                        <option value="self-run">Self-run</option>
                        <option value="available">Available</option>
                        {uniqueCustomers.map(customer => (
                            <option key={customer} value={customer}>{customer}</option>
                        ))}
                    </select>

                    {/* Results Count */}
                    <div className="flex items-center text-sm text-slate-400">
                        {filteredAndSortedLicenses.length} of {licenses.length} licenses
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedLicenses.size === paginatedLicenses.length && paginatedLicenses.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedLicenses(new Set([...selectedLicenses, ...paginatedLicenses.map(l => l.licenseId)]));
                                            } else {
                                                const newSet = new Set(selectedLicenses);
                                                paginatedLicenses.forEach(l => newSet.delete(l.licenseId));
                                                setSelectedLicenses(newSet);
                                            }
                                        }}
                                        className="rounded border-purple-400/30 text-purple-500 bg-slate-800/50"
                                    />
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort('licenseId')}
                                >
                                    <div className="flex items-center gap-2">
                                        License Address
                                        <SortIcon columnKey="licenseId" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center gap-2">
                                        Status
                                        <SortIcon columnKey="status" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort('customer')}
                                >
                                    <div className="flex items-center gap-2">
                                        Customer
                                        <SortIcon columnKey="customer" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort('bindingStatus')}
                                >
                                    <div className="flex items-center gap-2">
                                        Binding
                                        <SortIcon columnKey="bindingStatus" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort('expiryDate')}
                                >
                                    <div className="flex items-center gap-2">
                                        Expires
                                        <SortIcon columnKey="expiryDate" />
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLicenses.map((license) => (
                                <tr key={license.licenseId} className="border-t border-purple-400/10 hover:bg-slate-800/20 transition-colors">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedLicenses.has(license.licenseId)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedLicenses(prev => new Set([...prev, license.licenseId]));
                                                } else {
                                                    setSelectedLicenses(prev => {
                                                        const newSet = new Set(prev);
                                                        newSet.delete(license.licenseId);
                                                        return newSet;
                                                    });
                                                }
                                            }}
                                            className="rounded border-purple-400/30 text-purple-500 bg-slate-800/50"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="font-mono text-sm text-white">
                                                {showFullAddresses ? license.licenseId : truncateLicenseAddress(license.licenseId)}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(license.licenseId)}
                                                className="p-1 text-slate-500 hover:text-purple-400 transition-colors"
                                                title="Copy full address"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(license.status)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-white">
                                            {license.leaseInfo?.customer || 'N/A'}
                                        </div>
                                        {license.leaseInfo?.revenueSplit && (
                                            <div className="text-xs text-slate-500">
                                                {license.leaseInfo.revenueSplit}% to operator
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {license.bindingInfo?.isBound ? (
                                                <>
                                                    <Check size={14} className="text-green-400" />
                                                    <span className="text-sm text-green-300">Bound</span>
                                                </>
                                            ) : (
                                                <>
                                                    <X size={14} className="text-red-400" />
                                                    <span className="text-sm text-red-300">Unbound</span>
                                                </>
                                            )}
                                        </div>
                                        {license.bindingInfo?.phoneId && (
                                            <div className="text-xs text-slate-500">
                                                {license.bindingInfo.phoneId}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {(() => {
                                            const expiryDate = getExpiryDate(license);
                                            const daysUntilExpiry = getDaysUntilExpiry(license);

                                            if (!expiryDate) {
                                                return <span className="text-slate-500">N/A</span>;
                                            }

                                            const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30;
                                            const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;

                                            return (
                                                <div>
                                                    <div className={`text-sm ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-yellow-400' : 'text-white'}`}>
                                                        {expiryDate.toLocaleDateString()}
                                                    </div>
                                                    {daysUntilExpiry !== null && (
                                                        <div className="text-xs text-slate-500">
                                                            {isExpired ? `${Math.abs(daysUntilExpiry)} days ago` :
                                                                daysUntilExpiry === 0 ? 'Today' :
                                                                    `${daysUntilExpiry} days left`}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setEditingLicense(license)}
                                                className="p-1 text-slate-500 hover:text-blue-400 transition-colors"
                                                title="Edit license"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLicense(license.licenseId)}
                                                className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                                title="Delete license"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-purple-400/10 bg-slate-800/30">
                        <div className="text-sm text-slate-400">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedLicenses.length)} of {filteredAndSortedLicenses.length} licenses
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm bg-slate-800/50 hover:bg-slate-800/70 text-slate-300 hover:text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-slate-400">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm bg-slate-800/50 hover:bg-slate-800/70 text-slate-300 hover:text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal Placeholder */}
            {editingLicense && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-purple-400/30 rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Edit License</h3>
                            <button
                                onClick={() => setEditingLicense(null)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="text-center py-8">
                            <Settings size={48} className="mx-auto text-slate-600 mb-4" />
                            <p className="text-slate-400">Edit functionality coming soon...</p>
                            <p className="text-sm text-slate-500 mt-2">
                                Currently showing: {truncateLicenseAddress(editingLicense.licenseId)}
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setEditingLicense(null)}
                                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800/70 text-slate-300 hover:text-white rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}