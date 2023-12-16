/**
 * useDisclosure
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/hooks/use-disclosure/src/index.ts
 */
import { useCallback, useState } from "preact/hooks";
import { useCallbackRef } from "./useCallbackRef.ts";

export interface UseDisclosureProps {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onClose?(): void;
  onOpen?(): void;
  id?: string;
}

/**
 * `useDisclosure` is a custom hook used to help handle common open, close, or toggle scenarios.
 * It can be used to control feedback component such as `Modal`, `AlertDialog`, `Drawer`, etc.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-disclosure
 */
export function useDisclosure(props: UseDisclosureProps = {}) {
  const {
    onClose: onCloseProp,
    onOpen: onOpenProp,
    isOpen: isOpenProp,
  } = props;

  const handleOpen = useCallbackRef(onOpenProp);
  const handleClose = useCallbackRef(onCloseProp);

  const [isOpenState, setIsOpen] = useState(props.defaultIsOpen || false);

  const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenState;

  const isControlled = isOpenProp !== undefined;

  const onClose = useCallback(() => {
    if (!isControlled) {
      setIsOpen(false);
    }
    handleClose?.();
  }, [isControlled, handleClose]);

  const onOpen = useCallback(() => {
    if (!isControlled) {
      setIsOpen(true);
    }
    handleOpen?.();
  }, [isControlled, handleOpen]);

  const onToggle = useCallback(() => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpen, onOpen, onClose]);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    isControlled,
  };
}

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>;
