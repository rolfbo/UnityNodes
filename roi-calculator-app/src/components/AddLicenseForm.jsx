/**
 * Add License Form Component
 *
 * This React component provides a modal form for adding new licenses to the system.
 * It supports full license address input with validation, paste functionality,
 * and comprehensive lease information collection.
 *
 * Key Features:
 * - Full license address input with validation
 * - Paste support (Ctrl+V or button click)
 * - License status selection (self-run, leased, available)
 * - Conditional lease information fields
 * - Form validation and error handling
 * - Auto-formatting and duplicate detection
 * - Preview of truncated address display
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onSave - Callback when license is successfully added
 * @returns {JSX.Element|null} The modal form or null if not open
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Plus,
    Copy,
    Check,
    AlertCircle,
    Info,
    Clipboard,
    Eye,
    EyeOff
} from 'lucide-react';
import {
    addLicense,
    validateLicenseAddress,
    truncateLicenseAddress
} from '../utils/licenseStorage.js';

export default function AddLicenseForm({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        licenseAddress: '',
        status: 'available',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        leaseStartDate: '',
        leaseDuration: '',
        leaseDurationUnit: 'months',
        revenueSplit: 70,
        monthlyFee: '',
        phoneId: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFullAddress, setShowFullAddress] = useState(false);
    const [pasteStatus, setPasteStatus] = useState(''); // 'success', 'error', or ''
    const addressInputRef = useRef(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                licenseAddress: '',
                status: 'available',
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                leaseStartDate: '',
                leaseDuration: '',
                leaseDurationUnit: 'months',
                revenueSplit: 70,
                monthlyFee: '',
                phoneId: '',
                notes: ''
            });
            setErrors({});
            setPasteStatus('');
            setShowFullAddress(false);
        }
    }, [isOpen]);

    // Handle license address changes with validation
    const handleAddressChange = (value) => {
        const cleanedValue = value.trim().toLowerCase();
        setFormData(prev => ({ ...prev, licenseAddress: cleanedValue }));

        // Clear previous errors
        if (errors.licenseAddress) {
            setErrors(prev => ({ ...prev, licenseAddress: '' }));
        }
    };

    // Handle paste functionality
    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            handleAddressChange(clipboardText);
            setPasteStatus('success');

            // Clear paste status after 2 seconds
            setTimeout(() => setPasteStatus(''), 2000);
        } catch (error) {
            console.error('Failed to read clipboard:', error);
            setPasteStatus('error');
            setTimeout(() => setPasteStatus(''), 2000);
        }
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            handlePaste();
        }
    };

    // Validate form data
    const validateForm = () => {
        const newErrors = {};

        // License address validation
        if (!formData.licenseAddress) {
            newErrors.licenseAddress = 'License address is required';
        } else if (!validateLicenseAddress(formData.licenseAddress)) {
            newErrors.licenseAddress = 'Invalid format. Must be 0x followed by 64 hexadecimal characters';
        }

        // Status-specific validations
        if (formData.status.startsWith('leased')) {
            if (!formData.customerName.trim()) {
                newErrors.customerName = 'Customer name is required for leased licenses';
            }
            if (!formData.leaseStartDate) {
                newErrors.leaseStartDate = 'Lease start date is required for leased licenses';
            }
            if (!formData.leaseDuration || parseFloat(formData.leaseDuration) <= 0) {
                newErrors.leaseDuration = 'Valid lease duration is required for leased licenses';
            }
            if (formData.revenueSplit < 0 || formData.revenueSplit > 100) {
                newErrors.revenueSplit = 'Revenue split must be between 0 and 100';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Determine binding status based on license status
            const isBound = formData.status === 'leased-bound' ||
                          (formData.status === 'self-run');

            // Prepare license data
            const licenseData = {
                leaseInfo: null,
                bindingInfo: {
                    isBound: isBound,
                    phoneId: formData.phoneId || null,
                    lastActive: isBound ? new Date().toISOString() : null,
                    downtimeDays: 0
                },
                notes: formData.notes
            };

            // Add lease info if applicable
            if (formData.status.startsWith('leased')) {
                licenseData.leaseInfo = {
                    customer: formData.customerName.trim(),
                    email: formData.customerEmail.trim() || null,
                    phone: formData.customerPhone.trim() || null,
                    startDate: formData.leaseStartDate,
                    duration: parseFloat(formData.leaseDuration),
                    durationUnit: formData.leaseDurationUnit,
                    revenueSplit: parseFloat(formData.revenueSplit),
                    monthlyFee: formData.monthlyFee ? parseFloat(formData.monthlyFee) : null
                };
            }

            // Add the license
            const result = addLicense(formData.licenseAddress, formData.status, licenseData);

            if (result.success) {
                onSave(result.license);
                onClose();
            } else {
                // Handle specific error types
                if (result.error === 'DUPLICATE_LICENSE') {
                    setErrors({ licenseAddress: 'This license address already exists in the system' });
                } else if (result.error === 'INVALID_ADDRESS') {
                    setErrors({ licenseAddress: result.message });
                } else {
                    setErrors({ general: result.message });
                }
            }
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle save and add another
    const handleSaveAndAddAnother = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Determine binding status based on license status
            const isBound = formData.status === 'leased-bound' ||
                          (formData.status === 'self-run');

            const licenseData = {
                leaseInfo: null,
                bindingInfo: {
                    isBound: isBound,
                    phoneId: formData.phoneId || null,
                    lastActive: isBound ? new Date().toISOString() : null,
                    downtimeDays: 0
                },
                notes: formData.notes
            };

            if (formData.status.startsWith('leased')) {
                licenseData.leaseInfo = {
                    customer: formData.customerName.trim(),
                    email: formData.customerEmail.trim() || null,
                    phone: formData.customerPhone.trim() || null,
                    startDate: formData.leaseStartDate,
                    duration: parseFloat(formData.leaseDuration),
                    durationUnit: formData.leaseDurationUnit,
                    revenueSplit: parseFloat(formData.revenueSplit),
                    monthlyFee: formData.monthlyFee ? parseFloat(formData.monthlyFee) : null
                };
            }

            const result = addLicense(formData.licenseAddress, formData.status, licenseData);

            if (result.success) {
                onSave(result.license);

                // Reset form for next entry
                setFormData({
                    licenseAddress: '',
                    status: 'available',
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    leaseStartDate: '',
                    leaseDuration: '',
                    leaseDurationUnit: 'months',
                    revenueSplit: 70,
                    monthlyFee: '',
                    phoneId: '',
                    notes: ''
                });
                setErrors({});
                setPasteStatus('');
                setShowFullAddress(false);

                // Focus back on address input
                setTimeout(() => {
                    addressInputRef.current?.focus();
                }, 100);
            } else {
                if (result.error === 'DUPLICATE_LICENSE') {
                    setErrors({ licenseAddress: 'This license address already exists in the system' });
                } else if (result.error === 'INVALID_ADDRESS') {
                    setErrors({ licenseAddress: result.message });
                } else {
                    setErrors({ general: result.message });
                }
            }
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-purple-400/30 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-purple-400/20">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Plus size={20} className="text-purple-400" />
                        Add New License
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* General Error */}
                    {errors.general && (
                        <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-3 flex items-center gap-2">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                            <span className="text-red-300 text-sm">{errors.general}</span>
                        </div>
                    )}

                    {/* License Address */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            License Address <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                ref={addressInputRef}
                                type="text"
                                value={formData.licenseAddress}
                                onChange={(e) => handleAddressChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="0x0125017d2460197d9efb92721703f5a2f5a0b43dcfe60d4368a3b4338caca278"
                                className={`w-full pl-3 pr-24 py-2 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 transition-colors outline-none ${errors.licenseAddress ? 'border-red-400' : 'border-purple-400/30 focus:border-purple-400'
                                    }`}
                                autoFocus
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={handlePaste}
                                    className={`p-1 rounded transition-colors ${pasteStatus === 'success' ? 'text-green-400 bg-green-900/20' :
                                            pasteStatus === 'error' ? 'text-red-400 bg-red-900/20' :
                                                'text-slate-400 hover:text-purple-400 hover:bg-purple-900/20'
                                        }`}
                                    title="Paste from clipboard (Ctrl+V)"
                                >
                                    {pasteStatus === 'success' ? <Check size={14} /> :
                                        pasteStatus === 'error' ? <X size={14} /> :
                                            <Clipboard size={14} />}
                                </button>
                                {formData.licenseAddress && (
                                    <button
                                        type="button"
                                        onClick={() => setShowFullAddress(!showFullAddress)}
                                        className="p-1 text-slate-400 hover:text-purple-400 hover:bg-purple-900/20 rounded transition-colors"
                                        title={showFullAddress ? "Show truncated" : "Show full address"}
                                    >
                                        {showFullAddress ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Address Preview */}
                        {formData.licenseAddress && (
                            <div className="text-xs text-slate-500 bg-slate-800/30 rounded px-2 py-1">
                                {showFullAddress ? (
                                    <span>Full: {formData.licenseAddress}</span>
                                ) : (
                                    <span>Display: {truncateLicenseAddress(formData.licenseAddress)}</span>
                                )}
                                {validateLicenseAddress(formData.licenseAddress) && (
                                    <Check size={12} className="inline ml-2 text-green-400" />
                                )}
                            </div>
                        )}

                        {errors.licenseAddress && (
                            <p className="text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle size={14} />
                                {errors.licenseAddress}
                            </p>
                        )}
                    </div>

                    {/* License Status */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            License Status <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                        >
                            <option value="available">Available (Not leased, not bound)</option>
                            <option value="self-run">Self-run (I operate this license myself - bound)</option>
                            <option value="leased-bound">Leased & Bound (Rented to customer, actively earning)</option>
                            <option value="leased-unbound">Leased but Unbound (Rented to customer, not earning - revenue loss!)</option>
                        </select>
                        <p className="text-xs text-slate-500">
                            Choose the current status of this license. Status determines whether the license is bound (actively earning) or unbound. Leased licenses require additional customer information.
                        </p>
                    </div>

                    {/* Lease Information (Conditional) */}
                    {formData.status.startsWith('leased') && (
                        <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-purple-400/20">
                            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Info size={14} className="text-purple-400" />
                                Lease Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Customer Name */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">
                                        Customer Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                                        placeholder="John's Nodes Ltd"
                                        className={`w-full px-3 py-2 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 transition-colors outline-none ${errors.customerName ? 'border-red-400' : 'border-purple-400/30 focus:border-purple-400'
                                            }`}
                                    />
                                    {errors.customerName && (
                                        <p className="text-red-400 text-sm">{errors.customerName}</p>
                                    )}
                                </div>

                                {/* Customer Email */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">
                                        Customer Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.customerEmail}
                                        onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                                        placeholder="contact@johnsnodes.com"
                                        className="w-full px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                                    />
                                </div>

                                {/* Customer Phone */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">
                                        Customer Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.customerPhone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                                        placeholder="+1 (555) 123-4567"
                                        className="w-full px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                                    />
                                </div>

                                {/* Lease Start Date */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">
                                        Lease Start Date <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.leaseStartDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, leaseStartDate: e.target.value }))}
                                        className={`w-full px-3 py-2 bg-slate-800/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-500/20 transition-colors outline-none ${errors.leaseStartDate ? 'border-red-400' : 'border-purple-400/30 focus:border-purple-400'
                                            }`}
                                    />
                                    {errors.leaseStartDate && (
                                        <p className="text-red-400 text-sm">{errors.leaseStartDate}</p>
                                    )}
                                </div>

                                {/* Lease Duration */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">
                                        Lease Duration <span className="text-red-400">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            step="0.5"
                                            value={formData.leaseDuration}
                                            onChange={(e) => setFormData(prev => ({ ...prev, leaseDuration: e.target.value }))}
                                            placeholder="12"
                                            className={`flex-1 px-3 py-2 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 transition-colors outline-none ${errors.leaseDuration ? 'border-red-400' : 'border-purple-400/30 focus:border-purple-400'
                                                }`}
                                        />
                                        <select
                                            value={formData.leaseDurationUnit}
                                            onChange={(e) => setFormData(prev => ({ ...prev, leaseDurationUnit: e.target.value }))}
                                            className="px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                                        >
                                            <option value="months">Months</option>
                                            <option value="days">Days</option>
                                        </select>
                                    </div>
                                    {errors.leaseDuration && (
                                        <p className="text-red-400 text-sm">{errors.leaseDuration}</p>
                                    )}
                                </div>

                                {/* Revenue Split */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">
                                        Revenue Split (%) <span className="text-red-400">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={formData.revenueSplit}
                                            onChange={(e) => setFormData(prev => ({ ...prev, revenueSplit: parseInt(e.target.value) }))}
                                            className="flex-1 accent-purple-500"
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.revenueSplit}
                                            onChange={(e) => setFormData(prev => ({ ...prev, revenueSplit: parseInt(e.target.value) || 0 }))}
                                            className={`w-16 px-2 py-1 bg-slate-800/50 border rounded text-white text-center text-sm focus:ring-2 focus:ring-purple-500/20 transition-colors outline-none ${errors.revenueSplit ? 'border-red-400' : 'border-purple-400/30 focus:border-purple-400'
                                                }`}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Percentage of earnings that goes to you (operator)
                                    </p>
                                    {errors.revenueSplit && (
                                        <p className="text-red-400 text-sm">{errors.revenueSplit}</p>
                                    )}
                                </div>

                                {/* Monthly Fee */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">
                                        Monthly Fee ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.monthlyFee}
                                        onChange={(e) => setFormData(prev => ({ ...prev, monthlyFee: e.target.value }))}
                                        placeholder="50.00"
                                        className="w-full px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                                    />
                                    <p className="text-xs text-slate-500">
                                        Optional fixed monthly fee from the customer
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Device Information (Optional) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            Device/Phone ID (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.phoneId}
                            onChange={(e) => setFormData(prev => ({ ...prev, phoneId: e.target.value }))}
                            placeholder="device-123 or phone-identifier (for tracking)"
                            className="w-full px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                        />
                        <p className="text-xs text-slate-500">
                            Optional identifier for the device this license is bound to
                        </p>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Additional notes about this license..."
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none resize-none"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-purple-400/20">
                        <button
                            type="button"
                            onClick={handleSaveAndAddAnother}
                            disabled={isSubmitting}
                            className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-4 py-2 rounded-lg transition-colors border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Plus size={16} />
                            Save & Add Another
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check size={16} />
                                    Save License
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}