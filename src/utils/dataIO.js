export const createExportData = (account, tasks, gameId = 'genshin') => {
    if (!account) return null;

    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        gameId,
        account: {
            id: account.id,
            name: account.name,
            server: account.server,
            ar: account.ar,
            wl: account.wl,
            gender: account.gender
        },
        tasks: tasks || {}
    };
};

export const parseImportedData = (importData) => {
    if (!importData || !importData.account) {
        throw new Error('Invalid import data');
    }

    return {
        account: importData.account,
        tasks: importData.tasks || {}
    };
};

export const applyImportedAccount = (accounts, accountId, importedAccount) => {
    return accounts.map(acc => {
        if (acc.id === accountId) {
            return {
                ...acc,
                name: importedAccount.name || acc.name,
                server: importedAccount.server || acc.server,
                ar: importedAccount.ar ?? acc.ar,
                wl: importedAccount.wl ?? acc.wl,
                gender: importedAccount.gender || acc.gender
            };
        }
        return acc;
    });
};

export const buildTaskInsertRows = (accountId, importedTasks, userId) => {
    const rows = [];
    Object.keys(importedTasks).forEach(gameId => {
        Object.keys(importedTasks[gameId]).forEach(taskId => {
            if (importedTasks[gameId][taskId]?.completedAt) {
                rows.push({
                    user_id: userId,
                    account_id: accountId,
                    game_id: gameId,
                    task_id: taskId,
                    completed_at: importedTasks[gameId][taskId].completedAt
                });
            }
        });
    });
    return rows;
};

export const countImportedTasks = (tasks) => {
    let count = 0;
    if (tasks) {
        Object.values(tasks).forEach(gameTasks => {
            count += Object.keys(gameTasks).length;
        });
    }
    return count;
};