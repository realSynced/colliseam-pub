"use client";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import FindUsersModal from "../messages/components/findUsersModal";

export default function Messages() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <div className="h-full">
        <div className="flex h-full w-full flex-col items-center justify-center p-5">
          <div className="flex flex-col items-center text-white">
            <h1 className="text-3xl font-bold">Your Messages</h1>
            <p className="text-lg font-semibold text-white/75">Start a conversation with someone!</p>
            <button onClick={onOpen} className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-bold hover:bg-primaryHover">
              Message
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="opaque" size="xs" hideCloseButton scrollBehavior="inside">
        <ModalContent>{(onClose) => <FindUsersModal />}</ModalContent>
      </Modal>
    </>
  );
}
