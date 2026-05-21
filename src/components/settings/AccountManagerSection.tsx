import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { countImportedTasks } from '../../utils/dataIO';
import { PlusIcon, PencilIcon, TrashIcon, DownloadIcon, UploadIcon } from './Icons';
import Modal from '../ui/Modal';

interface AccountManagerSectionProps {
    setToast: (toast: { type: 'success' | 'error'; message: string } | null) => void;
    setShowDeleteModal: (show: boolean) => void;
}

export default function AccountManagerSection({ setToast, setShowDeleteModal }: AccountManagerSectionProps) {
    const {
        accounts, activeAccountId, setActiveAccountId, activeAccount,
        addAccount, updateActiveAccount, exportAccount, importAccount
    } = useSettings();

    const [isRenaming, setIsRenaming] = useState(false);
    const [importModalData, setImportModalData] = useState<{ data: unknown; taskCount: number } | null>(null);

    const handleRenameSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') setIsRenaming(false);
    };

    const handleExportAccount = async () => {
        try {
            const data = await exportAccount(activeAccountId);
            if (!data) {
                setToast({ type: 'error', message: 'Failed to export account.' });
                setTimeout(() => setToast(null), 3000);
                return;
            }

            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            a.href = url;
            a.download = `koszy-${data.account.name.replace(/\s+/g, '-').toLowerCase()}-${date}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setToast({ type: 'success', message: 'Account exported successfully!' });
            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            console.error('Export error:', err);
            setToast({ type: 'error', message: 'Failed to export account.' });
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleImportClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = handleFileChange;
        input.click();
    };

    const handleFileChange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.account || !data.version) {
                throw new Error('Invalid format');
            }

            const taskCount = countImportedTasks(data.tasks);
            setImportModalData({ data, taskCount });
        } catch (err) {
            console.error('Import parse error:', err);
            setToast({ type: 'error', message: 'Invalid file format.' });
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleConfirmImport = async () => {
        if (!importModalData) return;

        try {
            await importAccount(activeAccountId, importModalData.data);
            setToast({ type: 'success', message: 'Account imported successfully!' });
            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            console.error('Import error:', err);
            setToast({ type: 'error', message: 'Failed to import account.' });
            setTimeout(() => setToast(null), 3000);
        }

        setImportModalData(null);
    };

    return (
        <div className="bg-[#1c1d21] border border-[#52525b] rounded-xl p-4 md:p-6 shadow-lg">
            <p className="text-sm text-gray-300 mb-1">More than one account? Add it here.</p>
            <p className="text-sm font-bold text-white mb-4">Importing will overwrite the selected account data.</p>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => addAccount()}
                        className="flex items-center gap-1.5 bg-transparent border border-[#52525b] hover:border-blue-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add
                    </button>

                    <select
                        value={activeAccountId}
                        onChange={(e) => setActiveAccountId(e.target.value)}
                        className="bg-[#18181b] border border-[#52525b] text-white text-sm rounded-md px-3 py-1.5 min-w-[120px] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 appearance-none transition-all"
                    >
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setIsRenaming(!isRenaming)}
                        className="flex items-center gap-1.5 bg-transparent border border-[#52525b] hover:border-blue-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Rename
                    </button>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={accounts.length === 1}
                        className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/60 text-red-400 border border-red-900/50 hover:border-red-500 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={handleExportAccount} className="flex items-center gap-1.5 bg-transparent border border-[#52525b] hover:border-blue-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                        <DownloadIcon className="w-4 h-4" />
                        Export Account
                    </button>
                    <button onClick={handleImportClick} className="flex items-center gap-1.5 bg-transparent border border-[#52525b] hover:border-blue-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                        <UploadIcon className="w-4 h-4" />
                        Import Account
                    </button>
                </div>
            </div>

            {/* Rename Input */}
            {isRenaming && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <input
                        autoFocus
                        type="text"
                        value={activeAccount?.name || ''}
                        onChange={(e) => updateActiveAccount('name', e.target.value)}
                        onKeyDown={handleRenameSubmit}
                        className="bg-[#18181b] border border-blue-500/50 text-white text-sm rounded-md px-3 py-1.5 w-full max-w-[256px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                    <button onClick={() => setIsRenaming(false)} className="text-sm px-2 py-1.5 text-blue-500 hover:brightness-110 font-bold">Save</button>
                </div>
            )}

            {/* Import Confirmation Modal */}
            {importModalData && (
                <Modal onClose={() => setImportModalData(null)} bgClass="bg-black/80">
                    <div className="bg-[#18181b] border border-[#52525b] p-6 rounded-xl max-w-sm w-full shadow-2xl">
                        <h3 className="text-white font-bold text-lg mb-2">Import Account Data</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            This will replace all data for <span className="text-white font-bold">{activeAccount?.name}</span> with the imported data.
                        </p>
                        <div className="bg-white/5 rounded-lg p-3 mb-6 border border-white/10">
                            <p className="text-xs text-gray-400 mb-1">Account Name</p>
                            <p className="text-sm text-white font-bold">{importModalData.data?.account?.name}</p>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <p className="text-gray-500">AR / WL</p>
                                    <p className="text-white">{importModalData.data?.account?.ar} / {importModalData.data?.account?.wl}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Server</p>
                                    <p className="text-white">{importModalData.data?.account?.server}</p>
                                </div>
                            </div>
                            <p className="mt-3 text-xs text-gray-500">
                                {importModalData.taskCount} completed task{importModalData.taskCount !== 1 ? 's' : ''} will be imported
                            </p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setImportModalData(null)}
                                className="px-4 py-2 text-gray-400 hover:text-white hover:border-blue-500 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmImport}
                                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 px-5 py-2 rounded-lg font-bold transition-colors shadow-md"
                            >
                                Import
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
