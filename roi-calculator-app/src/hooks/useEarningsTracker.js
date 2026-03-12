import { useState, useEffect } from 'react';
import { loadEarnings, saveEarnings, deleteEarning, updateEarning, getNodeMapping, updateNodeMapping, addEarning, clearAllEarnings } from '../utils/earningsStorage.js';
import { parseEarningsText } from '../utils/earningsParser.js';
import { addEarning as addEarningToStorage } from '../utils/earningsStorage.js';

/**
 * Hook managing core earnings data and handlers
 */
export function useEarningsTracker() {
    const [earnings, setEarnings] = useState([]);
    const [nodeMapping, setNodeMapping] = useState({});
    const [pasteText, setPasteText] = useState('');
    const [parseResult, setParseResult] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        setEarnings(loadEarnings());
        setNodeMapping(getNodeMapping());
    }, []);

    const handleParse = () => {
        const result = parseEarningsText(pasteText);
        setParseResult(result);

        if (result.success) {
            const addResult = addEarningToStorage(result.earnings);
            setEarnings(loadEarnings());
            setPasteText('');
        }
    };

    const handleDelete = (earningId) => {
        if (confirm('Delete this earning?')) {
            deleteEarning(earningId);
            setEarnings(loadEarnings());
        }
    };

    const handleStartEdit = (earning) => {
        setEditingId(earning.id);
        setEditForm({ ...earning });
    };

    const handleSaveEdit = () => {
        if (editingId && editForm) {
            updateEarning(editingId, editForm);
            setEarnings(loadEarnings());
            setEditingId(null);
            setEditForm({});
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleClearAll = () => {
        if (confirm('Delete ALL earnings? This cannot be undone.')) {
            clearAllEarnings();
            setEarnings([]);
        }
    };

    const handleUpdateNodeMapping = (nodeId, licenseType) => {
        updateNodeMapping(nodeId, licenseType, nodeMapping[nodeId]?.bound || false);
        setNodeMapping(getNodeMapping());
    };

    const handleUpdateNodeBound = (nodeId, bound) => {
        updateNodeMapping(nodeId, nodeMapping[nodeId]?.licenseType || 'Unknown', bound);
        setNodeMapping(getNodeMapping());
    };

    return {
        earnings, setEarnings,
        nodeMapping, setNodeMapping,
        pasteText, setPasteText,
        parseResult, setParseResult,
        editingId, setEditingId,
        editForm, setEditForm,
        handleParse, handleDelete, handleStartEdit, handleSaveEdit, handleCancelEdit,
        handleClearAll, handleUpdateNodeMapping, handleUpdateNodeBound
    };
}
