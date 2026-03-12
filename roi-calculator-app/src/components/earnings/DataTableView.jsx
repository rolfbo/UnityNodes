import { FiltersPanel } from './FiltersPanel.jsx';
import { EarningsTable } from './EarningsTable.jsx';
import { PaginationControls } from './PaginationControls.jsx';
import { NodeMappingPanel } from './NodeMappingPanel.jsx';

export function DataTableView({ 
    searchQuery, setSearchQuery, filterLicenseType, setFilterLicenseType, licenseTypes,
    paginatedEarnings, editingId, editForm, setEditForm, handleStartEdit, handleSaveEdit, handleCancelEdit, handleDelete,
    selectedEarningIds, toggleSelect, toggleSelectAll,
    currentPage, totalPages, itemsPerPage, setItemsPerPage, setCurrentPage,
    nodeMapping, uniqueNodeIds, handleUpdateNodeMapping, handleUpdateNodeBound
}) {
    return (
        <div className="space-y-6">
            <FiltersPanel searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterLicenseType={filterLicenseType} setFilterLicenseType={setFilterLicenseType} licenseTypes={licenseTypes} />
            <EarningsTable paginatedEarnings={paginatedEarnings} editingId={editingId} editForm={editForm} setEditForm={setEditForm} handleStartEdit={handleStartEdit} handleSaveEdit={handleSaveEdit} handleCancelEdit={handleCancelEdit} handleDelete={handleDelete} selectedEarningIds={selectedEarningIds} toggleSelect={toggleSelect} toggleSelectAll={toggleSelectAll} />
            <PaginationControls currentPage={currentPage} totalPages={totalPages} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} setCurrentPage={setCurrentPage} />
            <NodeMappingPanel nodeMapping={nodeMapping} uniqueNodeIds={uniqueNodeIds} handleUpdateNodeMapping={handleUpdateNodeMapping} handleUpdateNodeBound={handleUpdateNodeBound} />
        </div>
    );
}
