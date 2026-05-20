import { useState } from 'react';
import SectionHeader from '../components/game/SectionHeader';
import AuthSection from '../components/auth/AuthSection';
import DataManagementSection from '../components/settings/DataManagementSection';
import AccountManagerSection from '../components/settings/AccountManagerSection';
import AccountSettingsSection from '../components/settings/AccountSettingsSection';
import Toast from '../components/settings/Toast';
import DeleteModal from '../components/settings/DeleteModal';
import { useSettings } from '../context/SettingsContext';
import { game_terms } from '../config/gameTerms';

export default function Settings({ gameId = 'genshin' }) {
    const terms = game_terms[gameId] || game_terms.genshin;
    const { deleteActiveAccount } = useSettings();
    const [toast, setToast] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const confirmDelete = () => {
        deleteActiveAccount();
        setShowDeleteModal(false);
    };

    return (
        <div className="w-full max-w-[1000px] mx-auto pb-20 px-4 md:px-0">
            <SectionHeader title="Settings" />

            <DeleteModal
                isOpen={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

            <div className="space-y-4">

                <AuthSection />

                <DataManagementSection
                    setToast={setToast}
                />

                <AccountManagerSection
                    setToast={setToast}
                    setShowDeleteModal={setShowDeleteModal}
                />

                <AccountSettingsSection terms={terms} />

            </div>

            <Toast toast={toast} />
        </div>
    );
}