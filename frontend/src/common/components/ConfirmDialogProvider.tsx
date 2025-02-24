import React, { createContext, useContext, useState, ReactNode } from 'react';
import ConfirmDialog from '@common/components/ConfirmDialog';

interface DialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmDialogContextProps {
  showConfirmDialog: (options: DialogOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextProps | undefined>(undefined);

export const ConfirmDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogOptions, setDialogOptions] = useState<DialogOptions | null>(null);
  const [resolveCallback, setResolveCallback] = useState<((result: boolean) => void) | null>(null);

  const showConfirmDialog = (options: DialogOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setDialogOptions(options);
      setResolveCallback(() => resolve);
    });
  };

  const handleClose = () => {
    setDialogOptions(null);
    resolveCallback?.(false); // User canceled
  };

  const handleConfirm = () => {
    setDialogOptions(null);
    resolveCallback?.(true); // User confirmed
  };

  const contextValue = React.useMemo(() => ({ showConfirmDialog }), [showConfirmDialog]);

  return (
    <ConfirmDialogContext.Provider value={contextValue}>
      {children}
      {dialogOptions && (
        <ConfirmDialog
          open={Boolean(dialogOptions)}
          title={dialogOptions.title || 'Confirmation'}
          message={dialogOptions.message}
          confirmText={dialogOptions.confirmText || 'Oui'}
          cancelText={dialogOptions.cancelText || 'Non'}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      )}
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = (): ConfirmDialogContextProps => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
  }
  return context;
};
