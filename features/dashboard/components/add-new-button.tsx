"use client";

import { Button } from "@/components/ui/button";
import TemplateSelectionModal from "@/features/dashboard/components/template-selection-modal";
import { createPlayground } from "@/features/dashboard/actions";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Templates } from "@prisma/client";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // ✅ FIXED: use Templates enum
  const handleSubmit = async (data: {
    title: string;
    template: Templates;
    description?: string;
  }) => {
    try {
      const res = await createPlayground(data);

      toast("Playground created successfully");

      console.log("Creating new playground:", data);

      setIsModalOpen(false);

      router.push(`/playground/${res?.id}`);
    } catch (error) {
      console.error(error);
      toast("Failed to create playground");
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer
        transition-all duration-300 ease-in-out transform-gpu
        hover:bg-background hover:border-indigo-400 hover:scale-[1.02]
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_10px_30px_rgba(99,102,241,0.18)]"
      >
        <div className="flex flex-row items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            className="flex justify-center items-center bg-white
            transition-colors duration-300
            group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:via-indigo-500 group-hover:to-blue-500
            group-hover:border-transparent group-hover:text-white"
          >
            <Plus
              size={30}
              className="transition-transform duration-300 group-hover:rotate-[180deg]"
            />
          </Button>

          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Add New
            </h1>
            <p className="text-sm text-muted-foreground max-w-55">
              Create a new playground
            </p>
          </div>
        </div>

        <div className="overflow-hidden">
          <Image
            src="/add-new.svg"
            alt="Create new playground"
            width={70}
            height={70}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* ✅ FIXED: pass handleSubmit */}
      <TemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddNewButton;