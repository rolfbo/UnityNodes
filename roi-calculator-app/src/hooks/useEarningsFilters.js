import { useState, useMemo } from 'react';

/**
 * Hook managing filters, sorting, and pagination for earnings data
 */
export function useEarningsFilters(earnings) {
    const [filterLicenseType, setFilterLicenseType] = useState('all');
    const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredEarnings = useMemo(() => {
        let filtered = [...earnings];

        if (filterLicenseType !== 'all') {
            filtered = filtered.filter(e => e.licenseType === filterLicenseType);
        }

        if (filterDateRange.start && filterDateRange.end) {
            filtered = filtered.filter(e => {
                const eDate = new Date(e.date);
                const startDate = new Date(filterDateRange.start);
                const endDate = new Date(filterDateRange.end);
                return eDate >= startDate && eDate <= endDate;
            });
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.nodeId.toLowerCase().includes(query) ||
                e.licenseType.toLowerCase().includes(query) ||
                e.date.includes(query)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            if (sortField === 'date') {
                aVal = new Date(a.date);
                bVal = new Date(b.date);
            }
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return sortDirection === 'asc' ? cmp : -cmp;
        });

        return filtered;
    }, [earnings, filterLicenseType, filterDateRange, searchQuery, sortField, sortDirection]);

    const filteredDeviceCount = useMemo(() => {
        return new Set(filteredEarnings.map(e => e.nodeId)).size;
    }, [filteredEarnings]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredEarnings.length / itemsPerPage);
    }, [filteredEarnings.length, itemsPerPage]);

    const paginatedEarnings = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredEarnings.slice(start, start + itemsPerPage);
    }, [filteredEarnings, currentPage, itemsPerPage]);

    const licenseTypes = useMemo(() => {
        const types = new Set(earnings.map(e => e.licenseType));
        return ['all', ...Array.from(types)];
    }, [earnings]);

    const uniqueNodeIds = useMemo(() => {
        return [...new Set(earnings.map(e => e.nodeId))];
    }, [earnings]);

    const handleQuickDateRange = (days) => {
        const end = new Date();
        const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
        setFilterDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        });
        setCurrentPage(1);
    };

    const handleThisMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setFilterDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        });
        setCurrentPage(1);
    };

    const handleLastMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        setFilterDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        });
        setCurrentPage(1);
    };

    return {
        filterLicenseType, setFilterLicenseType,
        filterDateRange, setFilterDateRange,
        searchQuery, setSearchQuery,
        sortField, setSortField,
        sortDirection, setSortDirection,
        currentPage, setCurrentPage,
        itemsPerPage, setItemsPerPage,
        filteredEarnings, filteredDeviceCount, totalPages, paginatedEarnings,
        licenseTypes, uniqueNodeIds,
        handleQuickDateRange, handleThisMonth, handleLastMonth
    };
}
